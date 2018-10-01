import * as d3 from 'd3';
import * as _ from 'lodash';
import { fetchSPData } from '../services/db/getSPData';
import { fetchSPNames } from '../services/db/getSPNames';
import { generateRandomMatrix } from './test-utils/generate-matrix';

function square(x: number): number {
	return x * x;
}

function squareArr(X: number[]): number[] {
	return X.map(square);
}

const sqrt = Math.sqrt;

export function getCorrelation(X: number[], Y: number[]): number {
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

// export function computeCorrelationMatrix(data: number[][]): number[][] {
// 	return data.map((X, xIdx) => {
// 		return data.map((Y, yIdx) => {
// 			return computeCorrelation(X, Y);
// 		});
// 	});
// }

// async function main() {
// 	const t0 = Date.now();
// 	const stockNames = await fetchSPNames();
// 	const stockData = await fetchSPData(stockNames.slice(0, 10));

// 	const m = generateRandomMatrix(500, 500);
// 	computeCorrelationMatrix(m);
// 	const t1 = Date.now();
// 	console.log(t1 - t0);
// }
