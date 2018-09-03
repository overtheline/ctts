import * as _ from 'lodash';
import * as React from 'react';
import Select from 'react-select';

import StockCorrelation from './components/stockCorrelationChart';
import StockTimeSeries from './components/stockTimeSeriesChart';
import TimeRangeControl from './components/timeRangeControl';
import {
	fetchStockData,
	fetchStockNames,
} from './fetch';
import './styles.css';

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
		return (
			<div>
				<h1>CTTS</h1>
				<TimeRangeControl
					options={timeRangeOptions}
					onClick={this.changeTimeRange}
				/>
				<div className={'split-container'}>
					{!!this.state.stockNames.length && this.renderLeftContainer()}
					{!!this.state.stockNames.length && this.renderRightContainer()}
				</div>
			</div>
		);
	}

	private renderRightContainer = () => {
		const {
			selectedStockNames,
			stockDataStore,
			stockColumnHeaders,
		} = this.state;
		const valueIndex = stockColumnHeaders.findIndex((col) => col === 'close');

		return (
			<div className={'right-container'}>
				<div className={'scatter-chart-container'}>
					<StockCorrelation
						elementId={scatterChartElementId}
						height={400}
						valueIndex={valueIndex}
						width={400}
						xData={stockDataStore[selectedStockNames[0]]}
						xLabel={selectedStockNames[0]}
						yData={stockDataStore[selectedStockNames[1]]}
						yLabel={selectedStockNames[1]}
					/>
				</div>
			</div>
		);
	}

	private renderLeftContainer = () => {
		const {
			selectedStockNames,
			stockDataStore,
			stockColumnHeaders,
		} = this.state;

		const xChartValue = _.find(
			this.state.stockNames,
			(nameOption) => nameOption.value === this.state.selectedStockNames[0]
		);
		const yChartValue = _.find(
			this.state.stockNames,
			(nameOption) => nameOption.value === this.state.selectedStockNames[1]
		);
		const valueIndex = stockColumnHeaders.findIndex((col) => col === 'close');
		const timeIndex = stockColumnHeaders.findIndex((col) => col === 'date');

		return (
			<div className={'left-container'}>
				<div className={'line-chart-container'}>
					<div className={'dropdown'}>
						<Select
							maxMenuHeight={200}
							onChange={this.changeXChartValue}
							options={this.state.stockNames}
							value={xChartValue}
						/>
					</div>
					<StockTimeSeries
						data={stockDataStore[selectedStockNames[0]]}
						elementId={lineChartElementIds[0]}
						height={200}
						timeIndex={timeIndex}
						valueIndex={valueIndex}
						width={500}
					/>
				</div>
				<div className={'line-chart-container'}>
					<div className={'dropdown'}>
						<Select
							maxMenuHeight={200}
							onChange={this.changeYChartValue}
							options={this.state.stockNames}
							value={yChartValue}
						/>
					</div>
					<StockTimeSeries
						data={stockDataStore[selectedStockNames[1]]}
						elementId={lineChartElementIds[1]}
						height={200}
						timeIndex={timeIndex}
						valueIndex={valueIndex}
						width={500}
					/>
				</div>
			</div>
		);
	}

	private updateStockData = async (): Promise<void> => {
		this.setState(await fetchStockData(this.state.selectedStockNames));
	}

	private changeXChartValue = ({value}: ISelectOption): void => {
		const selectedStockNames = this.state.selectedStockNames.slice();
		selectedStockNames[0] = value;

		this.setState({ selectedStockNames }, this.updateStockData);
	}

	private changeYChartValue = ({value}: ISelectOption): void => {
		const selectedStockNames = this.state.selectedStockNames.slice();
		selectedStockNames[1] = value;

		this.setState({ selectedStockNames }, this.updateStockData);
	}

	private changeTimeRange = (event: any): void => {
		this.setState({
			selectedTimeRangeOption: event.target.value,
		});
	}
}
