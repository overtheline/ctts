import {
	forEach,
	groupBy,
	map,
} from 'lodash';
import * as React from 'react';
import Select from 'react-select';

import { lineChart } from './charts/line-chart';
import { scatterChart } from './charts/scatter-chart';
import './styles.css';

interface ISelectOption {
	label: string;
	value: string;
}

export interface ISPDatum {
	Name: string;
	close: number;
	date: string;
	high: number;
	low: number;
	open: number;
	volume: number;
}

interface IState {
	chartZeroName?: ISelectOption;
	chartOneName?: ISelectOption;
	spNames: ISelectOption[];
}

const lineChartElementIds = ['line-chart-0', 'line-chart-1'];
const scatterChartElementId = 'scatter-chart-0';

export default class SPApp extends React.Component<any, IState> {
	constructor(props: any) {
		super(props);

		this.state = {
			spNames: [],
		};
	}

	public componentDidMount() {
		this.fetchSPNames();
	}

	public render() {
		return (
			<div>
				<h1>S and P</h1>
				<div className={'split-container'}>
					{!!this.state.spNames.length && this.renderLineCharts()}
					{!!this.state.spNames.length && this.renderScatterChart()}
				</div>
			</div>
		);
	}

	private renderScatterChart = () => {
		return (
			<div className={'right-container'}>
				<div className={'scatter-chart-container'}>
					<div id={scatterChartElementId} />
				</div>
			</div>
		);
	}

	private renderLineCharts = () => {
		return (
			<div className={'left-container'}>
				<div className={'line-chart-container'}>
					<div className={'dropdown'}>
					<Select
						onChange={this.changeChartZero}
						options={this.state.spNames}
						value={this.state.chartZeroName}
					/>
					</div>
					<div id={lineChartElementIds[0]} />
				</div>
				<div className={'line-chart-container'}>
					<div className={'dropdown'}>
					<Select
						onChange={this.changeChartOne}
						options={this.state.spNames}
						value={this.state.chartOneName}
					/>
					</div>
					<div id={lineChartElementIds[1]} />
				</div>
			</div>
		);
	}

	private fetchSPNames = () => {
		fetch('/sp/names').then(
			(res) => res.json(),
			(err) => { console.log(err); }
		).then(
			(names: string[]) => {
				const spNames = map(
					names,
					(name) => ({
						label: name,
						value: name,
					})
				);
				this.setState({
					chartOneName: spNames[1],
					chartZeroName: spNames[0],
					spNames,
				}, () => {
					this.fetchSPData();
				});
			}
		);
	}

	private fetchSPData = async (): Promise<void> => {
		if (!this.state.chartZeroName || !this.state.chartOneName) {
			return;
		}

		await fetch(`/sp/data?names=${this.state.chartZeroName.value},${this.state.chartOneName.value}`).then(
			(res) => res.json(),
			(err) => { console.log(err); }
		).then(
			(data: ISPDatum[]) => {
				if (!this.state.chartZeroName || !this.state.chartOneName) {
					return;
				}

				const groupedData = groupBy(data, 'Name');

				forEach(
					[groupedData[this.state.chartZeroName.value], groupedData[this.state.chartOneName.value]],
					(groupData, index) => {
						lineChart({
							data: groupData,
							elementId: lineChartElementIds[index],
							height: 300,
							width: 900,
						});
					}
				);

				scatterChart({
					data: [groupedData[this.state.chartZeroName.value], groupedData[this.state.chartOneName.value]],
					elementId: scatterChartElementId,
					height: 500,
					width: 500,
				});
			}
		);
	}

	private changeChartZero = (nextValue: ISelectOption) => {
		this.setState({ chartZeroName: nextValue }, () => {
			this.fetchSPData();
		});
	}

	private changeChartOne = (nextValue: ISelectOption) => {
		this.setState({ chartOneName: nextValue }, () => {
			this.fetchSPData();
		});
	}
}
