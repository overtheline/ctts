import { Request, Response } from 'express';

export const columnHeaders = [
	'Name',
	'date',
	'open',
	'close',
	'high',
	'low',
	'volume',
];

export async function requestSPColumnHeaders(req: Request, res: Response): Promise<void> {
	res.send(columnHeaders);
}
