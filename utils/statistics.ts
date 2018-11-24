/**
 * A library of statistical functions.
 */

import * as math from 'mathjs';

/**
 * Get the simple expected value of an array of numbers.
 * @param X The set of numbers.
 * @param fn A transformation function.
 */
export function average(X: number[], fn: (x: number) => number = (x) => x): number {
	return (X.reduce((s, x) => s + fn(x), 0)) / X.length;
}

/**
 * Get the covariance of X and Y population values.
 * @param X
 * @param Y
 */
export function cov(X: number[], Y: number[]): number {
	if (X.length !== Y.length) {
		throw new Error(`Sets X and Y do not have the same length. X.length is ${X.length} and Y.length is ${Y.length}.`);
	}

	const mu_X = average(X);
	const mu_Y = average(Y);
	const preCov = X.map((x, i) => (x - mu_X) * (Y[i] - mu_Y));

	return average(preCov);
}

/**
 * Get the standard deviation for a population of values.
 * @param X The set of numbers.
 */
export function stDev(X: number[]): number {
	const mu_X = average(X);
	
	return Math.sqrt(average(X, (x) => Math.pow(x - mu_X, 2)));
}

/**
 * Get the Pearson's Correlation Coefficient from two arrays of numbers.
 * @param X 
 * @param Y 
 */
export function correl(X: number[], Y: number[]): number {
	return cov(X, Y) / (stDev(X) * stDev(Y));
}
