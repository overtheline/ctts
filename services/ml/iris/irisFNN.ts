// Trying out Feedforward neural network

import * as FNN from 'ml-fnn';

import { IRawIrisDatum } from '../../../types/irisTypes';
import { shuffleArray } from '../../../utils/shuffle-array';
import { fetchAllIrisData } from '../../db/getAllIrisData';

interface IProcessedData {
	testingFeatures: number[][];
	testingLabels: string[];
	trainingFeatures: number[][];
	trainingLabels: string[];
}

interface IFnnOptions {
	activation: string;
	activationParam: number;
	hiddenLayers: number[];
	iterations: number;
	learningRate: number;
	regularization: number;
}

function processDatum(d: IRawIrisDatum): number[] {
	return [
		Number(d.sepalLength),
		Number(d.sepalWidth),
		Number(d.petalLength),
		Number(d.petalWidth),
		Number(d.sepalLength) * Number(d.petalLength),
		Number(d.sepalWidth) * Number(d.petalWidth),
		Number(d.sepalLength) * Number(d.petalWidth),
		Number(d.sepalWidth) * Number(d.petalLength),
	];
}

function logResult(results: boolean[]) {
	const correctPredictions = results.reduce((acc, d, i) => d ? acc + 1 : acc, 0);
	const percentage = `${Math.floor(Math.round(correctPredictions / results.length * 100000)) / 1000}%`;

	console.log(`
		ratio: ${correctPredictions} : ${results.length - correctPredictions}

		percentage: ${percentage}
	`);
}

async function runPrediction(fnnOptions: IFnnOptions, preData: IRawIrisDatum[]) {
	const trainingDataCount = Math.floor(preData.length * 0.7);

	const processedData: IProcessedData = shuffleArray(preData).reduce<IProcessedData>(
		(acc, d, i) => {
			if (i < trainingDataCount) {
				acc.trainingFeatures.push(processDatum(d));
				acc.trainingLabels.push(d.type);
			} else {
				acc.testingFeatures.push(processDatum(d));
				acc.testingLabels.push(d.type);
			}

			return acc;
		},
		{
			testingFeatures: [],
			testingLabels: [],
			trainingFeatures: [],
			trainingLabels: [],
		}
	);

	const fnn = new FNN(fnnOptions);

	fnn.train(processedData.trainingFeatures, processedData.trainingLabels);

	const predictions: string[] = fnn.predict(processedData.testingFeatures);

	const results = predictions.map((d, i) => {
		return d === processedData.testingLabels[i];
	});

	logResult(results);

	return;
}

export function FNNIris(fnnOptions: IFnnOptions, preData: IRawIrisDatum[]) {
	console.log('FNN');
	return new Promise(async (resolve, reject) => {
		try {
			await runPrediction(fnnOptions, preData);
			resolve();
		} catch (err) {
			reject(err);
		}
	});
}

async function runExperiment() {
	const numberOfTrials = 5;
	const initialFnnOptions = {
		activation: 'tanh',
		activationParam: 1,
		hiddenLayers: [5],
		iterations: 30000,
		learningRate: 0.00005,
		regularization: 0.005,
	};

	const preData = await fetchAllIrisData();

	for (let i = 0; i < numberOfTrials; i++) {
		FNNIris(initialFnnOptions, preData);
	}
}

runExperiment();
