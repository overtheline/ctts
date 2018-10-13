import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-node';

const model = tf.sequential();

model.add(tf.layers.dense({ units: 100, activation: 'relu', inputShape: [10] }));
model.add(tf.layers.dense({ units: 1, activation: 'linear' }));
model.compile({ optimizer: 'sgd', loss: 'meanSquaredError' });

const xs = tf.randomNormal([100, 10]);
const ys = tf.randomNormal([100, 1]);

model.fit(xs, ys, {
	callbacks: {
		onEpochEnd: async (epoch, log) => {
			if (log) {
				console.log(`Epoch ${epoch}: loss = ${log.loss}`);
			}
		},
	},
	epochs: 100,
});
