import {
	Schema,
} from 'mongoose';

export const irisRowSchema = new Schema({
	petalLength: Number,
	petalWidth: Number,
	sepalLength: Number,
	sepalWidth: Number,
	type: String,
});
