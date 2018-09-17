import { Request, Response } from 'express';
import { Db } from 'mongodb';

import getDbConnection from './getDbConnection';
import { columnHeaders } from './spColumnHeaders';

export async function requestSPData(req: Request, res: Response): Promise<void> {
	const names: string[] = req.query.names.split(',');

	res.send(await fetchSPData(names));
}

/**
 * Use in conjunction with the Column Headers API.
 * @param names An array of stock names(symbols).
 *
 * returns an array of rows of data indexed by column header index.
 * [
 * 	[...values],
 * 	[...values],
 * 	...
 * ]
 */
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
