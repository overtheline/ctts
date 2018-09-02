import {
	filter,
	find,
	forEach,
	groupBy,
	map,
	reduce,
	some,
	zip,
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

export interface IRawStockData {
	columnHeaders: string[];
	rows: string[][];
}

export interface IStockDatum {
	close: number;
	date: string;
	high: number;
	low: number;
	Name: string;
	open: number;
	volume: number;
}

interface IState {
	chartOneName: string;
	chartZeroName: string;
	selectedTimeRangeOption: string;
	stockNames: ISelectOption[];
}

const lineChartElementIds = ['line-chart-0', 'line-chart-1'];
const scatterChartElementId = 'scatter-chart-0';
const timeRangeOptions: string[] = [
	'5yrs',
	'1yr',
	'6mo',
];

export default class StockApp extends React.Component<any, IState> {
	constructor(props: any) {
		super(props);

		// itnitial state
		this.state = {
			chartOneName: 'AAPL',
			chartZeroName: 'MSFT',
			selectedTimeRangeOption: timeRangeOptions[0],
			stockNames: [],
		};
	}

	public componentDidMount() {
		this.fetchStockNames();
	}

	public render() {
		return (
			<div>
				<h1>CTTS</h1>
				<div className={'control-container'}>
					{this.renderControls()}
				</div>
				<div className={'split-container'}>
					{!!this.state.stockNames.length && this.renderLineCharts()}
					{!!this.state.stockNames.length && this.renderScatterChart()}
				</div>
			</div>
		);
	}

	private renderControls = () => {
		return map(timeRangeOptions, (option) => (
			<input
				key={option}
				onClick={this.changeTimeRange}
				type={'button'}
				value={option}
			/>
		));
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
		const chartZeroValue = find(
			this.state.stockNames,
			(nameOption) => nameOption.value === this.state.chartZeroName
		);
		const chartOneValue = find(
			this.state.stockNames,
			(nameOption) => nameOption.value === this.state.chartOneName
		);
		return (
			<div className={'left-container'}>
				<div className={'line-chart-container'}>
					<div className={'dropdown'}>
					<Select
						maxMenuHeight={200}
						onChange={this.changeChartZero}
						options={this.state.stockNames}
						value={chartZeroValue}
					/>
					</div>
					<div id={lineChartElementIds[0]} />
				</div>
				<div className={'line-chart-container'}>
					<div className={'dropdown'}>
					<Select
						maxMenuHeight={200}
						onChange={this.changeChartOne}
						options={this.state.stockNames}
						value={chartOneValue}
					/>
					</div>
					<div id={lineChartElementIds[1]} />
				</div>
			</div>
		);
	}

	private fetchStockNames = () => {
		fetch('/sp/names').then(
			(res) => res.json(),
			(err) => { console.log(err); }
		).then(
			(names: string[]) => {
				const stockNames: ISelectOption[] = map(
					names,
					(name) => ({
						label: name,
						value: name,
					})
				);

				this.setState({
					stockNames,
				}, () => {
					this.fetchStockData();
				});
			}
		);
	}

	private fetchStockData = async (): Promise<void> => {
		if (!this.state.chartZeroName || !this.state.chartOneName) {
			return;
		}

		await fetch(`/sp/data?names=${this.state.chartZeroName},${this.state.chartOneName}`).then(
			(res) => res.json(),
			(err) => { console.log(err); }
		).then(
			({ columnHeaders, rows }: IRawStockData) => {
				if (!this.state.chartZeroName || !this.state.chartOneName) {
					return;
				}

				const groupZeroData = {
					columnHeaders,
					rows: filter(rows, (row) => some(row, (d) => d === this.state.chartZeroName)),
				};
				const groupOneData = {
					columnHeaders,
					rows: filter(rows, (row) => some(row, (d) => d === this.state.chartOneName)),
				};

				forEach(
					[groupZeroData, groupOneData],
					(groupData, index) => {
						lineChart({
							data: groupData,
							elementId: lineChartElementIds[index],
							height: 200,
							width: 500,
						});
					}
				);

				const scatterData = zip(
					map(groupZeroData.rows, (row) => Number(row[0])),
					map(groupOneData.rows, (row) => Number(row[0]))
				);

				scatterChart({
					data: scatterData,
					elementId: scatterChartElementId,
					height: 400,
					width: 400,
					xLabel: this.state.chartZeroName,
					yLabel: this.state.chartOneName,
				});
			}
		);
	}

	private changeChartZero = ({value}: ISelectOption) => {
		this.setState({ chartZeroName: value }, () => {
			this.fetchStockData();
		});
	}

	private changeChartOne = ({value}: ISelectOption) => {
		this.setState({ chartOneName: value }, () => {
			this.fetchStockData();
		});
	}

	private changeTimeRange = (event: any) => {
		this.setState({
			selectedTimeRangeOption: event.target.value,
		});
	}
}
