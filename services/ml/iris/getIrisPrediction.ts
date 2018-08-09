import { Request, Response } from 'express';
import { castArray } from 'lodash';

import { IRIS_FEATURES } from '../../../constants';
import getIrisMLModel from './getIrisMLModel';

export default async function getIrisPrediction(req: Request, res: Response): Promise<void> {
	const irisItem = IRIS_FEATURES.map((feature: string) => Number(req.query[feature]));

	const [prediction] = await fetchPrediction(irisItem);

	const data: {	[key: string]: number | string;	} = IRIS_FEATURES.reduce((acc: any, feature: string, index) => {
		acc[feature] = irisItem[index];
		return acc;
	}, { type: prediction });

	res.send(data);
}

export function fetchPrediction(item: number[]): Promise<string[]> {
	return new Promise(async (resolve) => {
		const { knn, types } = await getIrisMLModel();
		const predictions = castArray(knn.predict(item));

		resolve(predictions.map((prediction) => types[prediction]));
	});
}
