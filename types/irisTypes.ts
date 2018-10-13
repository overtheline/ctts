import { Document } from 'mongoose';

export interface IRawIrisDatum {
	petalLength: string;
	petalWidth: string;
	sepalLength: string;
	sepalWidth: string;
	type: string;
}

export interface IIrisDatum extends Document {
	petalLength: number;
	petalWidth: number;
	sepalLength: number;
	sepalWidth: number;
	type: string;
}

export interface ITestIrisDatum {
	petalLength: number;
	petalWidth: number;
	sepalLength: number;
	sepalWidth: number;
}
