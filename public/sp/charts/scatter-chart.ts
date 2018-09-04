import * as d3 from 'd3';
import {
	round,
} from 'mathjs';
import SimpleLinearRegression from 'ml-regression-simple-linear';

import { timeOptionFilter } from '../utils';

export interface IScatterChartConfig {
	elementId: string;
	height: number;
	timeIndex: number;
	timeRangeOption: string;
	valueIndex: number;
	width: number;
	xData: string[][];
	xLabel: string;
	yData: string[][];
	yLabel: string;
}

export function scatterChart(config: IScatterChartConfig) {
	const {
		elementId,
		height = 500,
		timeIndex,
		timeRangeOption,
		valueIndex,
		width = 800,
		xData,
		xLabel,
		yData,
		yLabel,
	} = config;

	const parsedXData = timeOptionFilter(timeRangeOption, xData, timeIndex).map((row) => Number(row[valueIndex]));
	const parsedYData = yData.map((row) => Number(row[valueIndex]));
	const parsedData = d3.zip(parsedXData, parsedYData);

	d3.select(`#${elementId} svg`).remove();
	const svg = d3.select(`#${elementId}`).append('svg');
	svg.attr('width', width);
	svg.attr('height', height);
	svg.classed('scatter-chart-svg', true);

	const margin = {
		bottom: 100,
		left: 40,
		right: 20,
		top: 20,
	};
	const chartWidth = width - margin.left - margin.right;
	const chartHeight = height - margin.top - margin.bottom;

	const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

	const xScale = d3.scaleLinear()
		.range([0, chartWidth]);

	const yScale = d3.scaleLinear()
		.range([chartHeight, 0]);

	const [xMin = 0, xMax = 1] = d3.extent(parsedData, (d) => d[0]);
	xScale.domain([xMin, xMax]);

	const [yMin = 0, yMax = 1] = d3.extent(parsedData, (d) => d[1]);
	yScale.domain([yMin, yMax]);

	// get flat data: X, Y
	const X = parsedData.map((d) => Number(d[0]));
	const Y = parsedData.map((d) => Number(d[1]));

	// compute Pearson correlation
	const XY = X.map((x, i) =>  x * Y[i]);
	const muX2 = d3.mean(X.map((x) => x * x)) || 0;
	const muY2 = d3.mean(Y.map((y) => y * y)) || 0;
	const muX = d3.mean(X) || 0;
	const muY = d3.mean(Y) || 0;
	const muXY = d3.mean(XY) || 0;
	const rho = (muXY - (muX * muY)) / (Math.sqrt(muX2 - (muX * muX)) * Math.sqrt(muY2 - (muY * muY)));

	// compute linear regression
	const regression = new SimpleLinearRegression(
		parsedData.map((d) => d[0]),
		parsedData.map((d) => d[1])
	);
	const x0 = xMin;
	const x1 = xMax;
	const y0 = regression.predict(x0);
	const y1 = regression.predict(x1);

	const line = d3.line()
	.x((d: any) => xScale(d[0]))
	.y((d: any) => yScale(d[1]));

	const xAxis = g.append('g')
		.attr('class', 'x axis')
		.attr('transform', 'translate(0,' + chartHeight + ')')
		.call(d3.axisBottom(xScale));

	xAxis.append('text')
		.attr('class', 'label')
		.attr('x', chartWidth)
		.attr('y', -6)
		.style('text-anchor', 'end')
		.style('fill', 'black')
		.text(`${xLabel}`);

	xAxis.append('text')
		.attr('class', 'stats')
		.attr('x', 0)
		.attr('y', 30)
		.style('text-anchor', 'start')
		.style('fill', 'black')
		.text(`Pearson Correlation: ${round(rho, 4)}`);

	xAxis.append('text')
		.attr('class', 'stats')
		.attr('x', 0)
		.attr('y', 50)
		.style('text-anchor', 'start')
		.style('fill', 'black')
		.text(`Regression: ${round(regression.slope, 4)}`);

	g.append('g')
			.attr('class', 'y axis')
			.call(d3.axisLeft(yScale))
		.append('text')
			.attr('class', 'label')
			.attr('transform', 'rotate(-90)')
			.attr('y', 6)
			.attr('dy', '.71em')
			.style('text-anchor', 'end')
			.style('fill', 'black')
			.text(`${yLabel}`);

	g.selectAll('.dot')
			.data(parsedData)
		.enter().append('circle')
			.attr('class', 'dot')
			.attr('r', 1.5)
			.attr('cx', (d) => xScale(Number(d[0])))
			.attr('cy', (d) => yScale(Number(d[1])))
			.style('fill', 'steelblue');

	g.append('path')
			.datum([[x0, y0], [x1, y1]])
			.attr('fill', 'none')
			.attr('stroke', 'red')
			.attr('stroke-linecap', 'round')
			.attr('stroke-width', 1.5)
			.attr('d', line);
}
