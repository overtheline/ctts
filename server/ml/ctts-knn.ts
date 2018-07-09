import {
	indexOf,
	map,
	reduce,
	uniq,
} from 'lodash';
import * as KNN from 'ml-knn';

import { shuffleArray } from '../../utils/shuffle-array';

export interface IFeatures {
	[key: string]: number;
}
export interface IDatum {
	features: IFeatures;
	classification: string;
}

interface IProps {
	data: IDatum[];
	featureKeys: string[];
}

export class CTTSKNN {
	private data: IDatum[];
	private featureKeys: string[];
	private types: string[];
	private trainingSetSize: number;
	private testSetSize: number;
	private trainingSetX: number[][] = [];
	private trainingSetY: number[] = [];
	private testSetX: number[][] = [];
	private testSetY: number[] = [];
	private knn: any;

	constructor(props: IProps) {
		this.init(props);
	}

	public predict(datum: IFeatures): IDatum {
		if (!this.knn) {
			console.error(`Cannot predict. There is no trained model, knn = ${this.knn}`);
		}

		const row = map(this.featureKeys, (key) => Number(datum[key]));
		const prediction = this.knn.predict(row);

		return ({
			classification: this.types[prediction],
			features: datum,
		});
	}

	private init(props: IProps) {
		this.data = shuffleArray(props.data);
		this.featureKeys = props.featureKeys;
		this.trainingSetSize = Math.floor(0.7 * this.data.length);
		this.testSetSize = this.data.length - this.trainingSetSize;

		this.dressData();
	}

	private dressData() {
		this.types = uniq(map(this.data, (datum) => datum.classification));

		for (let i = 0; i < this.data.length; i++) {
			const {
				features,
				classification,
			} = this.data[i];

			const xRow = map(this.featureKeys, (key) => Number(features[key]));
			const yRow = indexOf(this.types, classification);

			if (i < this.trainingSetSize) {
				this.trainingSetX.push(xRow);
				this.trainingSetY.push(yRow);
			} else {
				this.testSetX.push(xRow);
				this.testSetY.push(yRow);
			}
		}

		this.train();
	}

	private train() {
		this.knn = new KNN(this.trainingSetX, this.trainingSetY, { k: 5 });

		this.test();
	}

	private test() {
		if (!this.knn) {
			console.error(`Cannot test. There is no trained model, knn = ${this.knn}`);
		}

		const result = this.knn.predict(this.testSetX);
		const predictionError = this.error(result, this.testSetY);

		console.log(`Test Set Size = ${this.testSetX.length} and nummber of Misclassifications = ${predictionError}`);
	}

	private error(predicted: number[], expected: number[]): number {
		return reduce(predicted, (acc, value, index) => {
			if (value !== expected[index]) {
				acc++;
			}

			return acc;
		}, 0);
	}
}
