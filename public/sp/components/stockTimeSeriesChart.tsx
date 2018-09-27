import * as React from 'react';

import { lineChart } from '../charts/line-chart';

interface IProps {
	data: string[][];
	elementId: string;
	height: number;
	timeIndex: number;
	timeRangeOption: string;
	valueIndex: number;
	width: number;
}

export default class StockTimeSeries extends React.Component<IProps, any> {
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
