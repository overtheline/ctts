import * as _ from 'lodash';
import * as React from 'react';

import TimeRangeControl from './components/timeRangeControl';
import TwoStockCompare from './components/twoStockCompare';
import {
	fetchStockData,
} from './fetch';
import './styles.css';
import {
	computeAppStateWithCompareSettings,
	computeAppStateWithCorrelationNames,
	computeAppStateWithMetadata,
	computeAppStateWithTimeRange,
} from './utils/updateAppState';

import CorrelationTable from './components/correlationTable';

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
	stockData: string[][];
}

export interface ICorrelationTableSettings {
	selectedStockNames: string[];
	correlationMatrix: number[][];
}

export interface IModuleSettings {
	twoStockCompareSettings: ITwoStockCompareSettings;
	correlationTableSettings: ICorrelationTableSettings;
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
	moduleSettings: IModuleSettings;
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
			correlationMatrix: [],
			selectedStockNames: ['AAPL', 'MSFT', 'AMZN', 'AMD', 'INTC'],
		},
		twoStockCompareSettings: {
			selectedStockNames: ['AAPL', 'MSFT'],
			stockData: [],
		},
	},
};

export default class StockApp extends React.Component<any, IAppState> {
	constructor(props: any) {
		super(props);

		// itnitial state
		this.state = itnitialAppState;
	}

	public async componentDidMount() {
		this.setState(await computeAppStateWithMetadata(this.state));
		this.setState(await computeAppStateWithCompareSettings(
			this.state,
			this.state.moduleSettings.twoStockCompareSettings.selectedStockNames
		));
	}

	public render() {
		const {
			appControlSettings: {
				selectedTimeRangeOption,
			},
			metadata: {
				stockColumnHeaders,
				stockNames,
			},
			moduleSettings: {
				twoStockCompareSettings,
				correlationTableSettings,
			},
		} = this.state;

		return (
			<div>
				<h1>CTTS</h1>
				<TimeRangeControl
					options={timeRangeOptions}
					onClick={this.updateSelectedTimeRange}
					selectedTimeRangeOption={selectedTimeRangeOption}
				/>
				{this.renderTwoStockCompare()}
				<CorrelationTable
					selectedTableData={[[1, 2, 3], [4, 5, 6], [7, 8, 9]]}
					selectedTableNames={['a', 'b', 'c']}
					stockNames={['a', 'b', 'c', 'd']}
				/>
			</div>
		);
	}

	private renderTwoStockCompare = () => {
		const {
			appControlSettings: {
				selectedTimeRangeOption,
			},
			metadata: {
				stockColumnHeaders,
				stockNames,
			},
			moduleSettings: {
				twoStockCompareSettings,
			},
		} = this.state;

		if (!twoStockCompareSettings.stockData.length) {
			return null;
		}

		return (
			<TwoStockCompare
					selectedStockNames={twoStockCompareSettings.selectedStockNames}
					selectedTimeRangeOption={selectedTimeRangeOption}
					updateSelectedStocks={this.updateCompareSelectedStockNames}
					stockColumnHeaders={stockColumnHeaders}
					stockData={twoStockCompareSettings.stockData}
					stockNames={stockNames}
			/>
		);
	}

	private updateCompareSelectedStockNames = async (selectedStockNames: string[]): Promise<void> => {
		this.setState(await computeAppStateWithCompareSettings(this.state, selectedStockNames));
	}

	private updateCorrelationSelectedStockNames = (selectedStockNames: string[]): void => {
		this.setState(computeAppStateWithCorrelationNames(this.state, selectedStockNames));
	}

	private updateSelectedTimeRange = (event: any): void => {
		this.setState(computeAppStateWithTimeRange(this.state, event.target.value));
	}
}
