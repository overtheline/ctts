import { Request, Response } from 'express';
import { Db } from 'mongodb';

import getDbConnection from './getDbConnection';

export default async function addQuote(req: Request, res: Response): Promise<void> {
	const {
		query: {
			name,
			text,
		},
	} = req;

	const db: Db = await getDbConnection();

	db.collection('quotes').save({ name, text }, (err) => {
		if (err) {
			console.log(err);
			res.json(err);
		}

		console.log('saved to database');
		res.redirect('/');
	});
}
