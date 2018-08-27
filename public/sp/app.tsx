import {
	map,
} from 'lodash';
import * as React from 'react';
import Select from 'react-select';

import { lineChart } from './charts/line-chart';
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
	selectedName?: ISelectOption;
	spNames: ISelectOption[];
}

const LINE_GRAPH_ELEMENT_ID = 'line-graph-0';

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
				<div className={'dropdown'}>
					{!!this.state.spNames.length && this.renderNamesDropdown()}
				</div>
				<div id={LINE_GRAPH_ELEMENT_ID} />
			</div>
		);
	}

	private renderNamesDropdown = () => (
		<Select
			onChange={this.changeSelectedNameHandler}
			options={this.state.spNames}
			value={this.state.selectedName}
		/>
	)

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
					selectedName: spNames[0],
					spNames,
				}, () => {
					this.fetchSPData();
				});
			}
		);
	}

	private fetchSPData = async () => {
		if (!this.state.selectedName) {
			return;
		}

		await fetch(`/sp/data?name=${this.state.selectedName.value}`).then(
			(res) => res.json(),
			(err) => { console.log(err); }
		).then(
			(data: ISPDatum[]) => {
				lineChart({
					data,
					elementId: LINE_GRAPH_ELEMENT_ID,
					height: 900,
					width: 900,
				});
			}
		);
	}

	private changeSelectedNameHandler = (nextValue: ISelectOption) => {
		this.setState({ selectedName: nextValue }, () => {
			this.fetchSPData();
		});
	}
}
