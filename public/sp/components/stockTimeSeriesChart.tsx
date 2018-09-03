import * as React from 'react';

import { lineChart } from '../charts/line-chart';

export interface IStockTimeSeriesProps {
	data: string[][];
	elementId: string;
	height: number;
	timeIndex: number;
	valueIndex: number;
	width: number;
}

export default class StockTimeSeries extends React.Component<IStockTimeSeriesProps, any> {
	public componentDidMount() {
		if (this.props.data) {
			lineChart(this.props);
		}
	}

	public componentDidUpdate() {
		if (this.props.data) {
			lineChart(this.props);
		}
	}

	public render() {
		return (
			<div id={this.props.elementId} />
		);
	}
}
