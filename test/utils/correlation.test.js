var assert = require('assert');

var generateArray = require('../../dist/utils/generate-array').generateArray;
var getCorrelation = require('../../dist/utils/correlation.js').getCorrelation;

describe('getCorrelation', function() {
	it('should return NaN for datasets not of the same length', function() {
		assert.equal(isNaN(getCorrelation([1, 2, 3], [9, 8, 7, 6])), true);
	});

	it('should return 1 for total positive linear correlation', () => {
		const X = generateArray(100);
		const Y = X.map((d) => d * 3);

		assert.equal(getCorrelation(X, Y), 1);
	});

	it('should return -1 for total negative linear correlation', () => {
		const X = generateArray(100);
		const Y = X.map((d) => d * -3);

		assert.equal(getCorrelation(X, Y), -1);
	});
});
