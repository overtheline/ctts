import * as React from 'react';

import { scatterChart } from '../charts/scatter-chart';

interface IProps {
	elementId: string;
	height: number;
	timeIndex: number;
	timeRangeOption: string;
	valueIndex: number;
	width: number;
	xData: string[][];
	xLabel: string;
	yData: string[][];
	yLabel: string;
}

export default class StockCorrelation extends React.Component<IProps, any> {
	public componentDidMount() {
		if (this.props.xData && this.props.yData) {
			scatterChart(this.props);
		}
	}

	public componentDidUpdate() {
		if (this.props.xData && this.props.yData) {
			scatterChart(this.props);
		}
	}

	public render() {
		return (
			<div id={this.props.elementId} />
		);
	}
}
