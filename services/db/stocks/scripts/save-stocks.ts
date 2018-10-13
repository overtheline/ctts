import {
	Db,
	MongoClient,
} from 'mongodb';
import {
	connect,
	connection,
} from 'mongoose';

import { StockRow } from '../model';

let db: Db;

MongoClient.connect('mongodb://localhost:27017/test', { useNewUrlParser: true }, (err, client) => {
	db = client.db('test');
	console.log('connected');
	connect('mongodb://localhost:27017/test');

	const mongoosedb = connection;

	mongoosedb.on('error', console.error.bind(console, 'connection error:'));

	mongoosedb.once('open', () => {
		console.log('connected');

	});

	db.collection('sp').find().toArray().then(async (result) => {
		console.log('received data');
		let i = 0;
		for (const datum of result) {
			i++;
			if (i % 10000 === 0) {
				console.log(i);
			}
			const stockRow = new StockRow({
				close: Number(datum.close),
				date: new Date(datum.date),
				high: Number(datum.high),
				low: Number(datum.low),
				name: datum.Name,
				open: Number(datum.open),
				volume: Number(datum.volume),
			});

			await stockRow.save();
		}
		console.log('save complete');
	});
});
