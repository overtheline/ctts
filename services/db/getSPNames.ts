import { Request, Response } from 'express';
import { Db } from 'mongodb';

import getDbConnection from './getDbConnection';

export default async function getQuotes(req: Request, res: Response): Promise<void> {
	const db: Db = await getDbConnection();
	const names = await db.collection('sp').distinct('Name', {});

	res.send(names);
}
