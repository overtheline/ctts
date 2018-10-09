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

stockRowSchema.query.byName = function(name: string) {
	return this.where({ name: new RegExp(name, 'i')});
};
