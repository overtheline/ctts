import { Request, Response } from 'express';
import { keys } from 'lodash';
import { Db, MongoError } from 'mongodb';

import {
	IRawIrisDatum,
} from '../../types';
import getDbConnection from './getDbConnection';

export default async function getAllIrisData(req: Request, res: Response): Promise<void> {
	const data = await fetchAllIrisData();

	res.json(data);
}

export function fetchAllIrisData(): Promise<IRawIrisDatum[]> {
	return new Promise(async (resolve, reject) => {
		const db: Db = await getDbConnection();

		db.collection('iris').find().toArray((error: MongoError, result: IRawIrisDatum[]) => {
			if (error) {
				console.log('fetchAllIrisData: error', error);
				reject(error);
			}

			resolve(result);
		});
	});
}
