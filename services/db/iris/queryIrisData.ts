import { Request, Response } from 'express';
import {
	connect,
	connection,
} from 'mongoose';

import { IIrisDatum } from '../../../types/irisTypes';
import { IrisRow } from './model';

export async function queryIrisData(): Promise<IIrisDatum[]> {
	connect('mongodb://localhost:27017/test');
	const mongoosedb = connection;
	mongoosedb.on('error', console.error.bind(console, 'connection error:'));
	mongoosedb.once('open', () => {
		console.log('queryIrisData: connected');
	});

	const data = await IrisRow.find();

	mongoosedb.close();

	return data;
}
