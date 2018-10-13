import * as FNN from 'ml-fnn';

import { shuffleArray } from '../../../utils/shuffle-array';
import { buildRegressionFeatures } from '../models/regression/regression';

buildRegressionFeatures('AAPL').then((r) => {
	const threshold = 0;

	const features = r.map((f) => [
		f.t1Close, // f.t1High, f.t1Low, f.t1Open,
		f.t2Close, // f.t2High, f.t2Low, f.t2Open,
		f.t3Close, // f.t3High, f.t3Low, f.t3Open,
		f.t4Close, // f.t4High, f.t4Low, f.t4Open,
	]);
	const labels = r.map(({label}) => label > threshold);

	const indexSet = shuffleArray(labels.map((d, i) => i));
	const trainingSize = Math.floor(0.7 * indexSet.length);

	const preparedSets = indexSet.reduce<{
		testingFeatures: number[][];
		testingLabels: boolean[];
		trainingFeatures: number[][];
		trainingLabels: boolean[];
	}>(
		(acc, rIndex, i) => {
			if (i < trainingSize) {
				acc.trainingFeatures.push(features[rIndex]);
				acc.trainingLabels.push(labels[rIndex]);
			} else {
				acc.testingFeatures.push(features[rIndex]);
				acc.testingLabels.push(labels[rIndex]);
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

	const defaultFnnParameters = {
		activation: 'tanh',
		activationParam: 1,
		hiddenLayers: [100],
		iterations: 100000,
		learningRate: 0.001,
		regularization: 0.01,
	};

	const fnn = new FNN(defaultFnnParameters);
	console.log(`training on ${preparedSets.trainingFeatures.length} features`);
	const t0 = Date.now();
	fnn.train(preparedSets.trainingFeatures, preparedSets.trainingLabels);
	const t1 = Date.now();
	console.log(`time: ${(t1 - t0) / 1000} seconds`);

	console.log(`predicting on ${preparedSets.testingLabels.length} features`);
	const predictionLabels: boolean[] = fnn.predict(preparedSets.testingFeatures);

	const a = predictionLabels.reduce<{
		tt: number;
		ft: number;
		ff: number;
		tf: number;
	}>(
		(acc, prediction, i) => {
			const testLabel = preparedSets.testingLabels[i];

			if (prediction && testLabel) {
				acc.tt += 1;
			} else if (prediction && !testLabel) {
				acc.tf += 1;
			} else if (!prediction && !testLabel) {
				acc.ff += 1;
			} else if (!prediction && testLabel) {
				acc.ft += 1;
			}

			return acc;
		},
		{
			ff: 0,
			ft: 0,
			tf: 0,
			tt: 0,
		}
	);

	const percent = predictionLabels.reduce(
		(acc, p, i) => p === preparedSets.testingLabels[i] ? acc + 1 : acc,
		0
	) / predictionLabels.length;

	console.log('Result:');
	console.log(`tt: ${a.tt}, ff: ${a.ff}, tf: ${a.tf}, ft: ${a.ft}, percent -- ${percent}`);
});
