import * as _ from 'lodash';
import * as React from 'react';

import TimeRangeControl from './components/timeRangeControl';
import TwoStockCompare from './components/twoStockCompare';
import {
	fetchStockData,
	fetchStockNames,
} from './fetch';
import './styles.css';

import CorrelationTable from './components/correlationTable';

export interface ISelectOption {
	label: string;
	value: string;
}

export interface IRawStockData {
	columnHeaders: string[];
	rows: string[][];
}

export interface IStockDataStore {
	[name: string]: string[][];
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

export interface IState {
	selectedStockNames: string[];
	selectedTimeRangeOption: string;
	stockColumnHeaders: string[];
	stockDataStore: IStockDataStore;
	stockNames: ISelectOption[];
}

const timeRangeOptions: string[] = [
	'5yrs',
	'1yr',
	'6mo',
	'1mo',
];

export default class StockApp extends React.Component<any, IState> {
	constructor(props: any) {
		super(props);

		// itnitial state
		this.state = {
			selectedStockNames: ['AAPL', 'MSFT'],
			selectedTimeRangeOption: timeRangeOptions[0],
			stockColumnHeaders: [],
			stockDataStore: {},
			stockNames: [],
		};
	}

	public async componentDidMount() {
		const stockNames = await fetchStockNames();

		this.setState({
			stockNames,
		}, this.updateStockData);
	}

	public render() {
		const {
			selectedStockNames,
			selectedTimeRangeOption,
			stockColumnHeaders,
			stockDataStore,
			stockNames,
		} = this.state;

		return (
			<div>
				<h1>CTTS</h1>
				<TimeRangeControl
					options={timeRangeOptions}
					onClick={this.changeTimeRange}
					selectedTimeRangeOption={this.state.selectedTimeRangeOption}
				/>
				<TwoStockCompare
						selectedStockNames={selectedStockNames}
						selectedTimeRangeOption={selectedTimeRangeOption}
						updateSelectedStocks={this.updateSelectedStocks}
						stockColumnHeaders={stockColumnHeaders}
						stockDataStore={stockDataStore}
						stockNames={stockNames}
				/>
				<CorrelationTable
					selectedTableData={[[1, 2, 3], [4, 5, 6], [7, 8, 9]]}
					selectedTableNames={['a', 'b', 'c']}
					stockNames={['a', 'b', 'c', 'd']}
				/>
			</div>
		);
	}

	private updateStockData = async (): Promise<void> => {
		this.setState(await fetchStockData(this.state.selectedStockNames));
	}

	private updateSelectedStocks = (selectedStockNames: string[]) => {
		this.setState({ selectedStockNames }, this.updateStockData);
	}

	private changeTimeRange = (event: any): void => {
		this.setState({
			selectedTimeRangeOption: event.target.value,
		});
	}
}
