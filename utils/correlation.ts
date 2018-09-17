import * as d3 from 'd3';
import * as _ from 'lodash';
import { fetchSPData } from '../services/db/spData';
import { fetchSPNames } from '../services/db/spNames';
import { generateRandomMatrix } from './test-utils/generate-matrix';

function square(x: number): number {
	return x * x;
}

function squareArr(X: number[]): number[] {
	return X.map(square);
}

const sqrt = Math.sqrt;

export function computeCorrelation(X: number[], Y: number[]): number {
	// check data sizes.
	if (X.length !== Y.length || X.length === 0) {
		return NaN;
	}

	const XY = _.zipWith(X, Y, (x, y) => x * y);
	const EXY = d3.mean(XY) || NaN;
	const EX = d3.mean(X) || NaN;
	const EX2 = d3.mean(squareArr(X)) || NaN;
	const EY = d3.mean(Y) || NaN;
	const EY2 = d3.mean(squareArr(Y)) || NaN;
	const rho = (EXY - (EX * EY)) / (sqrt(EX2 - square(EX)) * sqrt(EY2 - square(EY)));

	return rho;
}

export function computeCorrelationMatrix(data: number[][]): number[][] {
	return data.map((X) => {
		return data.map((Y) => {
			return computeCorrelation(X, Y);
		});
	});
}
