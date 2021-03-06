import {
	Schema,
} from 'mongoose';

export const stockRowSchema = new Schema({
	close: Number,
	date: Date,
	high: Number,
	low: Number,
	name: String,
	open: Number,
	volume: Number,
});

export const stockNameSchema = new Schema({
	name: String,
});
