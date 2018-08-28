import * as d3 from 'd3';
import {
	map,
	zip,
} from 'lodash';
import SimpleLinearRegression from 'ml-regression-simple-linear';

import { ISPDatum } from '../app';

export interface IScatterChartConfig {
	elementId: string;
	data: [ISPDatum[], ISPDatum[]];
	height?: number;
	width?: number;
}

export function scatterChart(config: IScatterChartConfig) {
	const {
		elementId,
		data,
		height = 500,
		width = 800,
	} = config;

	d3.select(`#${elementId} svg`).remove();
	const svg = d3.select(`#${elementId}`).append('svg');
	svg.attr('width', width);
	svg.attr('height', height);
	svg.classed('line-chart-svg', true);

	const margin = {
		bottom: 30,
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

	const [xMin = 0, xMax = 1] = d3.extent(data[0], (d) => d.close);
	xScale.domain([xMin, xMax]);

	const [yMin = 0, yMax = 1] = d3.extent(data[1], (d) => d.close);
	yScale.domain([yMin, yMax]);

	const regression = new SimpleLinearRegression(
		map(data[0], (d) => d.close),
		map(data[1], (d) => d.close)
	);
	const x0 = xMin;
	const x1 = xMax;
	const y0 = regression.predict(x0);
	const y1 = regression.predict(x1);

	const line = d3.line()
	.x((d: any) => xScale(d[0]))
	.y((d: any) => yScale(d[1]));

	const scatterData = map(
		zip(data[0], data[1]),
		([d0, d1]) => {
			if (d0 && d1) {
				return [d0.close, d1.close];
			}
			return [];
		}
	);

	g.append('g')
		.attr('class', 'x axis')
		.attr('transform', 'translate(0,' + chartHeight + ')')
		.call(d3.axisBottom(xScale))
	.append('text')
		.attr('class', 'label')
		.attr('x', chartWidth)
		.attr('y', -6)
		.style('text-anchor', 'end')
		.style('fill', 'black')
		.text(`${data[0][0].Name}`);

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
			.text(`${data[1][0].Name}`);

	g.selectAll('.dot')
			.data(scatterData)
		.enter().append('circle')
			.attr('class', 'dot')
			.attr('r', 3.5)
			.attr('cx', (d) => xScale(d[0]))
			.attr('cy', (d) => yScale(d[1]))
			.style('fill', 'steelblue');

	g.append('path')
			.datum([[x0, y0], [x1, y1]])
			.attr('fill', 'none')
			.attr('stroke', 'red')
			.attr('stroke-linecap', 'round')
			.attr('stroke-width', 1.5)
			.attr('d', line);
}
