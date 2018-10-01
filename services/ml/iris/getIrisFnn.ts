import * as FNN from 'ml-fnn';

import { IRawIrisDatum } from '../../../types/irisTypes';
import { fetchAllIrisData } from '../../db/getAllIrisData';

export interface IFnnParameters {
	activation: string;
	activationParam: number;
	hiddenLayers: number[];
	iterations: number;
	learningRate: number;
	regularization: number;
}

export interface ITrainingSet {
	features: number[][];
	labels: string[];
}

export type ITestSet = ITrainingSet;

export type IPredictionResultSet = ITrainingSet;

export interface IDatasets {
	predictionResultSet: IPredictionResultSet;
	testSet: ITestSet;
	trainingSet: ITrainingSet;
}

export interface IFnnReport {
	parameters: IFnnParameters;
	accuracy: number;
	ratio: number[];
	datasets: IDatasets;
}

function prepareDatasets(dbData: IRawIrisDatum[]): IDatasets {
	const trainingSetSize = Math.floor(dbData.length * 0.7);
	const featureData = dbData.map(
		({petalLength, petalWidth, sepalLength, sepalWidth}) => [
			Number(petalLength),
			Number(petalWidth),
			Number(sepalLength),
			Number(sepalWidth),
		]
	);

	const labelData = dbData.map(({type}) => type);

	return featureData.reduce(
		(acc: IDatasets, feature, i) => {
			const label = labelData[i];

			if (i < trainingSetSize) {
				acc.trainingSet.features.push(feature);
				acc.trainingSet.labels.push(label);
			} else {
				acc.testSet.features.push(feature);
				acc.predictionResultSet.features.push(feature);
				acc.testSet.labels.push(label);
			}

			return acc;
		},
		{
			predictionResultSet: {
				features: [],
				labels: [],
			},
			testSet: {
				features: [],
				labels: [],
			},
			trainingSet: {
				features: [],
				labels: [],
			},
		}
	);
}

function generateReport(parameters: IFnnParameters, datasets: IDatasets): IFnnReport {
	const ratio = datasets.predictionResultSet.labels.reduce(
		([pos, neg], label, i) => label === datasets.testSet.labels[i] ? [pos + 1, neg] : [pos, neg + 1],
		[0, 0]
	);
	const accuracy = (ratio[0]) / (ratio[0] + ratio[1]);

	return {
		accuracy,
		datasets,
		parameters,
		ratio,
	};
}

const defaultFnnParameters = {
	activation: 'tanh',
	activationParam: 1,
	hiddenLayers: [5],
	iterations: 30000,
	learningRate: 0.00005,
	regularization: 0.005,
};

export default async function getIrisFnn(fnnParameters: IFnnParameters = defaultFnnParameters): Promise<IFnnReport> {
	const dbData = await fetchAllIrisData();
	const datasets = prepareDatasets(dbData);

	const fnn = new FNN(fnnParameters);
	fnn.train(datasets.trainingSet.features, datasets.trainingSet.labels);
	datasets.predictionResultSet.labels = fnn.predict(datasets.predictionResultSet.features);

	return generateReport(fnnParameters, datasets);
}
