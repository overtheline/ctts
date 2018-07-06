import * as express from 'express';

import {
	Db,
	MongoClient,
} from 'mongodb';

const dbServer = 'localhost:27017';
const dbName = 'test';

let db: Db;

export function connectToDb() {
	return new Promise(async (resolve, reject) => {
		try {
			console.log('try connecting to db');

			await MongoClient.connect(`mongodb://${dbServer}/${dbName}`, { useNewUrlParser: true }, (err, client) => {
				if (err) {
					console.log('connect error', err);
					throw err;
				}

				db = client.db(dbName);
				resolve('done');
			});
		} catch (err) {
			console.log('connecting to db catch', err);

			reject(err);
		}
	});
}

export function getQuotes(req: express.Request, res: express.Response) {
	db.collection('quotes').find().toArray((err, result) => {
		if (err) {
			console.log(err);
			throw err;
		}

		console.log(result);

		res.send(result);
	});
}

export function getAllIrisData() {
	return new Promise(async (resolve, reject) => {
		db.collection('iris').find().toArray((err, items) => {
			if (err) {
				reject(err);
			} else {
				resolve(items);
			}
		});
	});

}
