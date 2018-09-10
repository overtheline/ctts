import * as _ from 'lodash';
import * as React from 'react';
import Select from 'react-select';

import {
	ISelectOption,
	IStockDataStore,
} from '../app';
import StockCorrelation from './stockCorrelationChart';
import StockTimeSeries from './stockTimeSeriesChart';

export interface ITwoStockCompareProps {
	selectedStockNames: string[];
	selectedTimeRangeOption: string;
	stockColumnHeaders: string[];
	stockDataStore: IStockDataStore;
	stockNames: ISelectOption[];
	updateSelectedStocks: (selectedStockNames: string[]) => void;
}

const lineChartElementIds = ['line-chart-0', 'line-chart-1'];
const scatterChartElementId = 'scatter-chart-0';

export default class TwoStockCompare extends React.Component<ITwoStockCompareProps, any> {
	public render() {
		if (!this.props.stockNames.length) {
			return null;
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
			stockDataStore,
		} = this.props;

		const xChartValue = _.find(
			this.props.stockNames,
			(nameOption) => nameOption.value === this.props.selectedStockNames[0]
		);
		const yChartValue = _.find(
			this.props.stockNames,
			(nameOption) => nameOption.value === this.props.selectedStockNames[1]
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
							options={this.props.stockNames}
							value={xChartValue}
						/>
					</div>
					<StockTimeSeries
						data={stockDataStore[selectedStockNames[0]]}
						elementId={lineChartElementIds[0]}
						height={200}
						timeIndex={timeIndex}
						timeRangeOption={selectedTimeRangeOption}
						valueIndex={valueIndex}
						width={500}
					/>
				</div>
				<div className={'line-chart-container'}>
					<div className={'dropdown'}>
						<Select
							maxMenuHeight={200}
							onChange={this.changeYChartValue}
							options={this.props.stockNames}
							value={yChartValue}
						/>
					</div>
					<StockTimeSeries
						data={stockDataStore[selectedStockNames[1]]}
						elementId={lineChartElementIds[1]}
						height={200}
						timeIndex={timeIndex}
						timeRangeOption={selectedTimeRangeOption}
						valueIndex={valueIndex}
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
			stockDataStore,
			stockColumnHeaders,
		} = this.props;

		const valueIndex = stockColumnHeaders.findIndex((col) => col === 'close');
		const timeIndex = stockColumnHeaders.findIndex((col) => col === 'date');

		return (
			<div className={'right-container'}>
				<div className={'scatter-chart-container'}>
					<StockCorrelation
						elementId={scatterChartElementId}
						height={400}
						timeIndex={timeIndex}
						timeRangeOption={selectedTimeRangeOption}
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
