import * as _ from 'lodash';
import * as React from 'react';
import Select from 'react-select';

import { arrayValueIndex } from '../../../utils/array-value-index-map';
import StockCorrelation from './stockCorrelationChart';
import StockTimeSeries from './stockTimeSeriesChart';

export interface IProps {
	selectedStockNames: string[];
	selectedTimeRangeOption: string;
	stockColumnHeaders: string[];
	stockData: string[][];
	stockNames: string[];
	updateSelectedStocks: (selectedStockNames: string[]) => void;
}

interface ISelectOption {
	value: string;
	label: string;
}

interface IState {
	stockNameOptions: ISelectOption[];
}

const lineChartElementIds = ['line-chart-0', 'line-chart-1'];
const scatterChartElementId = 'scatter-chart-0';

export default class TwoStockCompare extends React.Component<IProps, IState> {
	constructor(props: IProps) {
		super(props);

		this.state = {
			stockNameOptions: props.stockNames.map((name) => ({ value: name, label: name })),
		};
	}

	public render() {
		if (!this.props.stockNames.length) {
			return (
				<div>Nothing to show here.</div>
			);
		}

		return (
			<div className={'split-container'}>
				{this.renderLeftContainer()}
				{this.renderRightContainer()}
			</div>
		);
	}

	private renderLeftContainer = () => {
		const {
			selectedStockNames,
			selectedTimeRangeOption,
			stockColumnHeaders,
			stockData,
		} = this.props;
		const {
			stockNameOptions,
		} = this.state;

		const xOptionIdx = stockNameOptions.findIndex(
			(nameOption) => nameOption.value === this.props.selectedStockNames[0]
		);
		const yOptionIdx = stockNameOptions.findIndex(
			(nameOption) => nameOption.value === this.props.selectedStockNames[1]
		);
		const nameIdx = arrayValueIndex(stockColumnHeaders, 'Name');
		const timeIdx = arrayValueIndex(stockColumnHeaders, 'date');
		const valueIdx = arrayValueIndex(stockColumnHeaders, 'close');
		const xChartData = stockData
			.filter((datum) => datum[nameIdx] === selectedStockNames[0])
			.map((datum) => [datum[timeIdx], datum[valueIdx]]);
		const yChartData = stockData
			.filter((datum) => datum[nameIdx] === selectedStockNames[1])
			.map((datum) => [datum[timeIdx], datum[valueIdx]]);

		return (
			<div className={'left-container'}>
				<div className={'line-chart-container'}>
					<div className={'dropdown'}>
						<Select
							maxMenuHeight={200}
							onChange={this.changeXChartValue}
							options={stockNameOptions}
							value={stockNameOptions[xOptionIdx]}
						/>
					</div>
					<StockTimeSeries
						data={xChartData}
						elementId={lineChartElementIds[0]}
						height={200}
						timeIndex={0}
						timeRangeOption={selectedTimeRangeOption}
						valueIndex={1}
						width={500}
					/>
				</div>
				<div className={'line-chart-container'}>
					<div className={'dropdown'}>
						<Select
							maxMenuHeight={200}
							onChange={this.changeYChartValue}
							options={stockNameOptions}
							value={stockNameOptions[yOptionIdx]}
						/>
					</div>
					<StockTimeSeries
						data={yChartData}
						elementId={lineChartElementIds[1]}
						height={200}
						timeIndex={0}
						timeRangeOption={selectedTimeRangeOption}
						valueIndex={1}
						width={500}
					/>
				</div>
			</div>
		);
	}

	private renderRightContainer = () => {
		const {
			selectedStockNames,
			selectedTimeRangeOption,
			stockColumnHeaders,
			stockData,
		} = this.props;

		const nameIdx = arrayValueIndex(stockColumnHeaders, 'Name');
		const timeIdx = stockColumnHeaders.findIndex((col) => col === 'date');
		const valueIdx = stockColumnHeaders.findIndex((col) => col === 'close');
		const xData = stockData
			.filter((datum) => datum[nameIdx] === selectedStockNames[0])
			.map((datum) => [datum[timeIdx], datum[valueIdx]]);
		const yData = stockData
			.filter((datum) => datum[nameIdx] === selectedStockNames[1])
			.map((datum) => [datum[timeIdx], datum[valueIdx]]);

		return (
			<div className={'right-container'}>
				<div className={'scatter-chart-container'}>
					<StockCorrelation
						elementId={scatterChartElementId}
						height={400}
						timeIndex={0}
						timeRangeOption={selectedTimeRangeOption}
						valueIndex={1}
						width={400}
						xData={xData}
						xLabel={selectedStockNames[0]}
						yData={yData}
						yLabel={selectedStockNames[1]}
					/>
				</div>
			</div>
		);
	}

	private changeXChartValue = ({value}: ISelectOption): void => {
		const selectedStockNames = this.props.selectedStockNames.slice();
		selectedStockNames[0] = value;

		this.props.updateSelectedStocks(selectedStockNames);
	}

	private changeYChartValue = ({value}: ISelectOption): void => {
		const selectedStockNames = this.props.selectedStockNames.slice();
		selectedStockNames[1] = value;

		this.props.updateSelectedStocks(selectedStockNames);
	}
}
