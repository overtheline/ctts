import {
	bindAll,
	map,
	mapValues,
} from 'lodash';
import * as React from 'react';

import {
	IIrisDatum,
	IRawIrisDatum,
} from '../../types';
import {
	IrisChart,
} from './chart/scatter';

interface IProps {
	title: string;
}

export default class IrisGraph extends React.Component<IProps, any> {
	private irisChart: IrisChart;

	constructor(props: IProps) {
		super(props);

		bindAll(this, [
			'handlePredict',
			'handleGetData',
		]);
	}

	public componentDidMount(): void {
		fetch('/irisdata/irisData')
			.then(
				(res) => res.json(),
				(err) => { console.log(err); }
			)
			.then(
				(json: IRawIrisDatum[]) => {
					const data = map(
						json,
						(datum) => mapValues(datum, (val, key) => key !== 'type' ? Number(val) : val)
					) as IIrisDatum[];
					this.irisChart = new IrisChart('#iris-chart');
					this.irisChart.renderChart(data);
				},
				(err) => { console.log(err); }
			);
	}

	public render(): JSX.Element {
		return (
			<div>
				<h1>{this.props.title}</h1>
				<section>
					<div>
						<input type="button" value="predict" onClick={this.handlePredict}/>
					</div>
					<div>
						<input type="button" value="get data" onClick={this.handleGetData}/>
					</div>
					<div>
						<div id="iris-chart" />
					</div>
				</section>
			</div>
		);
	}

	private handlePredict(): void {
		fetch(`/irisdata/predictIris?petalLength=${0.5}&petalWidth=${3.4}&sepalLength=${4.5}&sepalWidth=${2.5}`)
			.then(
				(res) => res.json(),
				(err) => { console.log(err); }
			)
			.then(
				(prediction) => {
					const datum = {
						...prediction.features,
						type: prediction.classification,
					};

					this.irisChart.updateChart([datum]);
				},
				(err) => { console.log(err); }
			);
	}

	private handleGetData(): void {
		fetch('/irisdata/irisData')
			.then(
				(res) => res.json(),
				(err) => { console.log(err); }
			)
			.then(
				(json) => { console.log(json); },
				(err) => { console.log(err); }
			);
	}
}
