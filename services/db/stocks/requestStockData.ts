import { Request, Response } from 'express';
import {
	connect,
	connection,
} from 'mongoose';

import { IStockRow } from '../../../types/stockTypes';
import { StockRow } from './model';

export async function requestStockData(req: Request, res: Response): Promise<void> {
	const names: string[] = req.query.names.split(',');

	res.send(await fetchStockData(names));
}

export async function fetchStockData(names: string[]): Promise<IStockRow[]> {
	connect('mongodb://localhost:27017/test');
	const mongoosedb = connection;

	mongoosedb.on('error', console.error.bind(console, 'connection error:'));

	mongoosedb.once('open', () => {
		console.log('connected');
	});

	const data = await StockRow.find({ name: { $in: names }});

	mongoosedb.close();

	return data;
}
