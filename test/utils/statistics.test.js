var assert = require('assert');

var average = require('../../dist/utils/statistics').average;
var cov = require('../../dist/utils/statistics').cov;
var stDev = require('../../dist/utils/statistics').stDev;
var correl = require('../../dist/utils/statistics').correl;

const X = [2.1, 2.5, 4.0, 3.6];
const Y = [8, 12, 14, 10];

describe('average', function() {
	it('should return the average of an array of numbers', function() {
		assert.equal(average(X), 3.05);
		assert.equal(average(Y), 11);
	});

	it('should return average with a function', function() {
		assert.equal(average(X, (x) => x + 2), 5.05);
	});

	it('should return NaN for an empty array', function() {
		assert.equal(isNaN(average([])), true);
	});
});

describe('cov', function() {
	it('should return the covariance of two arrays of numbers', function() {
		assert.equal(cov(X, Y), 1.15);
	});
});

describe('stDev', function() {
	it('should return the standard deviation of an array of numbers', function() {
		assert.equal(stDev(X), 0.7762087348130012);
		assert.equal(stDev(Y), 2.23606797749979);
	});
});

describe('correl', function() {
	it('should return the Pearsons correlation coefficient for two arrays of numbers', function() {
		assert.equal(correl(X, Y), 0.6625738822030288);
	});
});
