import * as React from 'react';

import { IScatterChartConfig, scatterChart } from '../d3/scatter-chart';

export type IProps = IScatterChartConfig;

export default class ScatterChart extends React.Component<IProps, any> {
	public componentDidMount() {
		if (this.props.data) {
			scatterChart(this.props);
		}
	}

	public componentDidUpdate() {
		if (this.props.data) {
			scatterChart(this.props);
		}
	}

	public render() {
		return (
			<div id={this.props.elementId} />
		);
	}
}
