import { Document } from 'mongoose';

export interface IStockRow extends Document {
	close: number;
	date: string;
	high: number;
	low: number;
	name: string;
	open: number;
	volume: number;
}
