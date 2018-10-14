import { omit } from 'lodash';
import {
	connect,
	connection,
	Document,
	Model,
} from 'mongoose';

export async function mongooseFind<T extends Document>(model: Model<T>, conditions: any = {}): Promise<T[]> {
	connect('mongodb://localhost:27017/test');
	const mongoosedb = connection;
	mongoosedb.on('error', console.error.bind(console, 'connection error:'));
	mongoosedb.once('open', () => {
		console.log('connected');
	});

	return await model.find(conditions, '-_id -__v', () => {
		mongoosedb.close(() => {
			console.log('connection closed');
		});
	});
}
