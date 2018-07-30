import {
	map,
	pick,
} from 'lodash';

import {
	connectToDb,
	getAllIrisData,
} from './database';
import {
	CTTSKNN,
	IDatum,
} from './ml/ctts-knn';

export class IrisDataStore {
	private cttsknn: CTTSKNN;

	constructor() {
		this.loadData();
	}

	public async getIrisData() {
		return await getAllIrisData();
	}

	public async getPrediction(item: any) {
		return this.cttsknn.predict(item);
	}

	private loadData() {
		connectToDb().then(
			() => {
				getAllIrisData().then(
					(irisData: any[]) => { this.runCTTSKNN(irisData); },
					(err) => { console.log(err); }
				);
			},
			(err) => { console.log('connectToDb error', err); }
		);
	}

	private runCTTSKNN(irisData: any[]) {
		const irisFeatures = [
			'sepalLength',
			'sepalWidth',
			'petalLength',
			'petalWidth',
		];

		const preparedData: IDatum[] = map(irisData, (datum) => {
			const features = pick(datum, irisFeatures);
			const classification = datum.type;

			return ({
				classification,
				features,
			});
		});

		this.cttsknn = new CTTSKNN({
			data: preparedData,
			featureKeys: irisFeatures,
		});
	}
}
