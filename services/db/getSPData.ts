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
	const names: string[] = req.query.names.split(',');

	res.send(await fetchSPData(names));
}

export async function fetchSPData(names: string[]): Promise<{columnHeaders: string[], rows: string[][]}> {
	const db: Db = await getDbConnection();

	db.collection('sp')
	.aggregate([{ $sort: {date: -1}}]);

	return await db.collection('sp')
	.find({ Name: { $in: names } })
	.toArray()
	.then(
		(result) => {
			const rows: string[][] = result.map(
				(datum) => columnHeaders.map(
					(col) => String(datum[col])
				)
			);

			return {
				columnHeaders,
				rows,
			};
		},
		(err) => {
			console.log('get sp data error.', err);
			return err;
		}
	);
}
