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

export async function getSPData(req: Request, res: Response): Promise<void> {
	const names: string[] = req.query.names.split(',');

	res.send(await fetchSPData(names));
}

export async function getColumnHeaders(req: Request, res: Response): Promise<void> {
	res.send(columnHeaders);
}

export async function fetchSPData(names: string[]): Promise<string[][]> {
	const db: Db = await getDbConnection();

	db.collection('sp').aggregate([{ $sort: {date: -1}}]);

	return await db.collection('sp')
	.find({ Name: { $in: names } })
	.toArray()
	.then(
		(result) => {
			return result.map(
				(datum) => columnHeaders.map(
					(col) => String(datum[col])
				)
			);
		},
		(err) => {
			console.log('get sp data error.', err);
			return err;
		}
	);
}
