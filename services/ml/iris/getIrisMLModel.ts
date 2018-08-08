import {
	map,
	mapValues,
	pick,
} from 'lodash';

import { fetchAllIrisData } from '../../db/getAllIrisData';
import getIrisKnn, { IKNN } from './getIrisKnn';

export interface IFeatures {
	[key: string]: number;
}

export interface IDatum {
	features: IFeatures;
	classification: string;
}

export const IRIS_FEATURES = [
	'sepalLength',
	'sepalWidth',
	'petalLength',
	'petalWidth',
];

export default function getIrisMLModel(): Promise<IKNN> {
	return new Promise(async (resolve) => {
		const data = await fetchAllIrisData();

		const irisData: IDatum[] = map(data, (datum) => {
			const features = mapValues(pick(datum, IRIS_FEATURES), (val) => Number(val));
			const classification = datum.type;

			return ({
				classification,
				features,
			});
		});

		const knn: IKNN = getIrisKnn(irisData, IRIS_FEATURES);

		resolve(knn);
	});
}
