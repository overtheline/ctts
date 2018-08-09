import {
	map,
	mapValues,
	pick,
} from 'lodash';

import { IRIS_FEATURES } from '../../../constants';
import { fetchAllIrisData } from '../../db/getAllIrisData';
import getIrisKnn, {
	IIrisKNN,
	IKNN,
} from './getIrisKnn';

export interface IFeatures {
	[key: string]: number;
}

export interface IDatum {
	features: IFeatures;
	classification: string;
}

let knn: IKNN;
let types: string[];

export default function getIrisMLModel(): Promise<IIrisKNN> {
	return new Promise(async (resolve) => {
		if (knn && types) {
			resolve({ knn, types });
			return;
		}

		const data = await fetchAllIrisData();

		const irisData: IDatum[] = map(data, (datum) => {
			const features = mapValues(pick(datum, IRIS_FEATURES), (val) => Number(val));
			const classification = datum.type;

			return ({
				classification,
				features,
			});
		});

		const irisKnn = getIrisKnn(irisData, IRIS_FEATURES);
		knn = irisKnn.knn;
		types = irisKnn.types;

		resolve({ knn, types });
	});
}
