import {
	Db,
	MongoClient,
	MongoError,
} from 'mongodb';

const dbServer = 'localhost:27017';
const dbName = 'test';

let db: Db;

export default function getDbConnection(): Promise<Db> {
	return new Promise(async (resolve, reject) => {
		if (db) {
			resolve(db);
		}

		console.log('connecting to db');
		await MongoClient.connect(
			`mongodb://${dbServer}/${dbName}`,
			{ useNewUrlParser: true },
			(err: MongoError, client: MongoClient) => {
				if (err) {
					console.log('MongoClient connection error', err);
					reject(err);
				}

				db = client.db(dbName);

				resolve(db);
			}
		);
	});
}
