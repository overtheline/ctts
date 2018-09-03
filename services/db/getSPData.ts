import { Request, Response } from 'express';
import { Db } from 'mongodb';

import getDbConnection from './getDbConnection';

const columnHeaders = [
	'close',
	'date',
	'high',
	'low',
	'Name',
	'open',
	'volume',
];

export default async function getSPData(req: Request, res: Response): Promise<void> {
	const db: Db = await getDbConnection();
	const names: string[] = req.query.names.split(',');

	db.collection('sp').find({ Name: { $in: names } }).toArray((err, result) => {
		if (err) {
			console.log('get sp data error.', err);
			res.send(err);
		}

		const rows: string[][] = result.map(
			(datum) => columnHeaders.map(
				(col) => String(datum[col])
			)
		);

		res.send({
			columnHeaders,
			rows,
		});
	});
}
