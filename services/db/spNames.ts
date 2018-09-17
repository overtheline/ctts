import { Request, Response } from 'express';
import { Db } from 'mongodb';

import getDbConnection from './getDbConnection';

export async function requestSPNames(req: Request, res: Response): Promise<void> {
	res.send(await fetchSPNames());
}

export async function fetchSPNames(): Promise<string[]> {
	const db: Db = await getDbConnection();

	return await db.collection('sp').distinct('Name', {});
}
