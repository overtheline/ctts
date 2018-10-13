import {
	connect,
	connection,
} from 'mongoose';

import { fetchSPNames } from '../../spNames';
import { StockName } from '../../stocks/model';

connect('mongodb://localhost:27017/test');

const mongoosedb = connection;

mongoosedb.on('error', console.error.bind(console, 'connection error:'));

mongoosedb.once('open', () => {
	console.log('connected');

});

fetchSPNames().then(async (names) => {
	console.log('received names');
	for (const name of names) {
		console.log(name);
		const nameRow = new StockName({
			name,
		});

		await nameRow.save();
	}
	console.log('save complete');
});
