import {
	bindAll,
	map,
	mapValues,
} from 'lodash';
import * as React from 'react';

import { IFnnReport } from '../../services/ml/iris/getIrisFnn';
import ScatterChart, { IProps as IScatterProps } from './components/scatterChart';
import { IDatum } from './d3/scatter-chart';

interface IProps {
	title: string;
}

interface IState {
	chartProps: IScatterProps[];
	report?: IFnnReport;
}

const CHART_HEIGHT = 500;
const CHART_WIDTH = 500;

const featureNames = ['petalLength', 'petalWidth', 'sepalLength', 'sepalWidth'];

function getScatterProps(json: IFnnReport, xIndex: number, yIndex: number): IScatterProps {
	const trainingFeatures = json.datasets.trainingSet.features.map(
		(d) => [d[xIndex], d[yIndex]]
	) as Array<[number, number]>;
	const trainingLabels = json.datasets.trainingSet.labels;
	const testLabels = json.datasets.testSet.labels;
	const predictionFeatures = json.datasets.predictionResultSet.features.map(
		(d) => [d[xIndex], d[yIndex]]
	) as Array<[number, number]>;
	const predictionLabels = json.datasets.predictionResultSet.labels;

	const trainingData = trainingFeatures.map<IDatum>(
		(d, i) => ({
			correct: true,
			datasetType: 'training',
			features: d,
			label: trainingLabels[i],
		})
	);
	const predictionData = predictionFeatures.map<IDatum>(
		(d, i) => ({
			correct: testLabels[i] === predictionLabels[i],
			datasetType: 'prediction',
			features: d,
			label: predictionLabels[i],
		})
	);

	return {
		data: [...trainingData, ...predictionData],
		elementId: `chart-${xIndex}-${yIndex}`,
		height: CHART_HEIGHT,
		width: CHART_WIDTH,
		xLabel: featureNames[xIndex],
		yLabel: featureNames[yIndex],
	};
}

export default class IrisGraph extends React.Component<IProps, IState> {
	constructor(props: IProps) {
		super(props);

		this.state = {
			chartProps: [],
		};
	}

	public componentDidMount(): void {
		fetch('/irisdata/irisFnn')
			.then(
				(res) => res.json(),
				(err) => { console.log(err); }
			)
			.then(
				(json: IFnnReport) => {
					const chartProps = [];
					for (let i = 0; i < featureNames.length; i++) {
						for (let j = i; j < featureNames.length; j++) {
							chartProps.push(getScatterProps(json, i, j));
						}
					}

					this.setState({ chartProps, report: json });
				}
			);
	}

	public render(): JSX.Element {
		return (
			<div>
				<h1>{this.props.title}</h1>
				<section>
					<div>
						{this.renderReport()}
					</div>
					<div style={{ display: 'GRID', gridTemplateColumns: '40% 40%' }}>
						{this.state.chartProps.length ? this.renderCharts() : '...Loading'}
					</div>
				</section>
			</div>
		);
	}

	private renderReport(): JSX.Element {
		if (this.state.report) {
			return (
				<div>
					<div>{`accuracy: ${this.state.report.accuracy * 100}%`}</div>
					<div>{`ratio: ${this.state.report.ratio[0]} : ${this.state.report.ratio[1]}`}</div>
				</div>
			);
		}

		return <div>{'...Loading'}</div>;
	}

	private renderCharts(): JSX.Element[] {
		return this.state.chartProps.map((d, i) => (
			<ScatterChart {...d} key={`${d.xLabel}:${d.yLabel}:${i}`} />
		));
	}
}
