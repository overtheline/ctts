import { Request, Response } from 'express';
import {
	map,
	values,
} from 'lodash';
import { Db } from 'mongodb';

import getDbConnection from './getDbConnection';

export default async function getSPData(req: Request, res: Response): Promise<void> {
	const db: Db = await getDbConnection();

	const names: [string, string] = req.query.names.split(',');

	db.collection('sp').find({ Name: { $in: names } }).toArray((err, result) => {
		if (err) {
			console.log('get sp data error.', err);
			res.send(err);
		}

		result.sort((a, b) => parseDateTime(a.date) - parseDateTime(b.date));

		const parsedResult = map(
			result,
			(datum) => ({
				Name: datum.Name,
				close: Number(datum.close),
				date: parseDateString(datum.date),
				high: Number(datum.high),
				low: Number(datum.low),
				open: Number(datum.open),
				volume: Number(datum.volume),
			})
		);

		res.send(parsedResult);
	});
}

function parseDateString(dateString: string) {
	const [year, month, day]: number[] = map(dateString.split('-'), (d) => Number(d));

	const dateObj = new Date(year, month - 1, day);

	return dateObj.toDateString();
}

function parseDateTime(dateString: string) {
	const [year, month, day]: number[] = map(dateString.split('-'), (d) => Number(d));
	const dateObj = new Date(year, month - 1, day);

	return dateObj.getTime();
}
