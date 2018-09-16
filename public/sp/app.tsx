import * as _ from 'lodash';
import * as React from 'react';

import TimeRangeControl from './components/timeRangeControl';
import TwoStockCompare from './components/twoStockCompare';
import {
	fetchStockData,
} from './fetch';
import './styles.css';
import {
	computeAppStateWithMetadata, computeAppStateWithStockData,
} from './utils/updateAppState';

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

export interface ITwoStockCompareSettings {
	selectedStockNames: string[];
}

export interface ICorrelationTableSettings {
	selectedStockNames: string[];
}

export interface IMetadata {
	stockColumnHeaders: string[];
	stockNames: string[];
}

export interface IAppControlSettings {
	selectedTimeRangeOption: string;
}

export interface IAppState {
	appControlSettings: IAppControlSettings;
	metadata: IMetadata;
	moduleSettings: {
		twoStockCompareSettings: ITwoStockCompareSettings;
		correlationTableSettings: ICorrelationTableSettings;
	};
	stockDataStore: IStockDataStore;
}

const timeRangeOptions: string[] = [
	'5yrs',
	'1yr',
	'6mo',
	'1mo',
];

const itnitialAppState: IAppState = {
	appControlSettings: {
		selectedTimeRangeOption: timeRangeOptions[0],
	},
	metadata: {
		stockColumnHeaders: [],
		stockNames: [],
	},
	moduleSettings: {
		correlationTableSettings: {
			selectedStockNames: ['AAPL', 'MSFT'],
		},
		twoStockCompareSettings: {
			selectedStockNames: ['AAPL', 'MSFT'],
		},
	},
	stockDataStore: {},
};

export default class StockApp extends React.Component<any, IAppState> {
	constructor(props: any) {
		super(props);

		// itnitial state
		this.state = itnitialAppState;
	}

	public async componentDidMount() {
		this.setState(await computeAppStateWithMetadata(this.state), this.updateStockData);
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
		this.setState(await computeAppStateWithStockData(this.state));
	}

	private updateSelectedStocks = (selectedStockNames: string[]): void => {
		this.setState({ selectedStockNames }, this.updateStockData);
	}

	private changeTimeRange = (event: any): void => {
		this.setState({
			selectedTimeRangeOption: event.target.value,
		});
	}
}
