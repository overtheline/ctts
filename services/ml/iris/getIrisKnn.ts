import {
	indexOf,
	map,
	reduce,
	uniq,
} from 'lodash';
import * as KNN from 'ml-knn';

import { shuffleArray } from '../../../utils/shuffle-array';

export interface IFeatures {
	[key: string]: number;
}

export interface IDatum {
	features: IFeatures;
	classification: string;
}

export interface IKNN {
	predict: (features: IFeatures | IFeatures[]) => string;
}

export interface IDatasets {
	trainingSetX: number[][];
	trainingSetY: number[];
	testSetX: number[][];
	testSetY: number[];
}

export default function getIrisKnn(	preData: IDatum[], featureKeys: string[]): IKNN {
	const data: IDatum[] = shuffleArray(preData);
	const trainingSetSize = Math.floor(0.7 * data.length);

	const types = uniq(map(data, (datum) => datum.classification));

	const datasets: IDatasets = reduce(
		data,
		(acc, datum, index): IDatasets => {
			const {
				features,
				classification,
			} = datum;

			const {
				testSetX,
				testSetY,
				trainingSetX,
				trainingSetY,
			} = acc;

			const xRow: number[] = map(featureKeys, (key) => Number(features[key]));
			const yRow: number = indexOf(types, classification);

			if (index < trainingSetSize) {
				return {
					testSetX,
					testSetY,
					trainingSetX: [...trainingSetX, xRow],
					trainingSetY: [...trainingSetY, yRow],
				};
			} else {
				return {
					testSetX: [...testSetX, xRow],
					testSetY: [...testSetY, yRow],
					trainingSetX,
					trainingSetY,
				};
			}
		},
		{
			testSetX: [],
			testSetY: [],
			trainingSetX: [],
			trainingSetY: [],
		}
	);

	const knn = new KNN(datasets.trainingSetX, datasets.trainingSetY, { k: 5 });

	if (knn) {
		console.error(`Cannot test. There is no trained model, knn = ${knn}`);
	}

	const result = knn.predict(datasets.testSetX);
	const predictionError = error(result, datasets.testSetY);

	console.log(`Test Set Size = ${datasets.testSetX.length} and nummber of Misclassifications = ${predictionError}`);

	return knn;
}

function error(predicted: number[], expected: number[]): number {
	return reduce(predicted, (acc, value, index) => {
		if (value !== expected[index]) {
			acc++;
		}

		return acc;
	}, 0);
}
