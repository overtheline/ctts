import { Request, Response } from 'express';
import { Db } from 'mongodb';

import getDbConnection from './getDbConnection';

export default async function getQuotes(req: Request, res: Response): Promise<void> {
	const db: Db = await getDbConnection();

	db.collection('quotes').find().toArray((err, result) => {
		if (err) {
			console.log('get quotes error.', err);
			res.send(err);
		}

		res.send(result);
	});
}
