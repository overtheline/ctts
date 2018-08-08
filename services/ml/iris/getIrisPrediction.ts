import { Request, Response } from 'express';

import getIrisMLModel from './getIrisMLModel';

export default async function getIrisPrediction(req: Request, res: Response): Promise<void> {
	const irisItem = {
		petalLength: Number(req.query.petalLength),
		petalWidth: Number(req.query.petalWidth),
		sepalLength: Number(req.query.sepalLength),
		sepalWidth: Number(req.query.sepalWidth),
	};

	const prediction = fetchPrediction(irisItem);

	res.json(prediction);
}

export function fetchPrediction(item: { [key: string]: number }): Promise<string> {
	return new Promise(async (resolve) => {
		const irisMLModel = await getIrisMLModel();
		const prediction = irisMLModel.predict(item);

		resolve(prediction);
	});
}
