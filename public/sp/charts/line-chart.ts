import * as d3 from 'd3';
import {
	map,
	sortBy,
} from 'lodash';

import { ISPDatum } from '../app';
import './line-chart-styles.css';

export interface ILineGraphConfig {
	elementId: string;
	data: ISPDatum[];
	height?: number;
	width?: number;
}

export function lineChart(config: ILineGraphConfig) {
	const {
		elementId,
		data,
		height = 500,
		width = 800,
	} = config;

	d3.select('.line-chart-svg').remove();
	const svg = d3.select(`#${elementId}`).append('svg');
	svg.attr('width', width);
	svg.attr('height', height);
	svg.classed('line-chart-svg', true);

	const margin = {
		bottom: 30,
		left: 50,
		right: 20,
		top: 20,
	};
	const chartWidth = width - margin.left - margin.right;
	const chartHeight = height - margin.top - margin.bottom;

	const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

	const parseTime = d3.timeParse('%a %b %d %Y');

	const xScale = d3.scaleTime()
			.rangeRound([0, chartWidth]);

	const yScale = d3.scaleLinear()
			.rangeRound([chartHeight, 0]);

	const line = d3.line<ISPDatum>()
			.x((d: any) => xScale(parseTime(d.date) || 0))
			.y((d: any) => yScale(d.close));

	const [xMin = 0, xMax = 1] = d3.extent(data, (d) => parseTime(d.date));
	xScale.domain([xMin, xMax]);

	const [yMin = 0, yMax = 1] = d3.extent(data, (d) => d.close);
	yScale.domain([yMin, yMax]);

	g.append('g')
		.attr('transform', `translate(0,${chartHeight})`)
		.call(d3.axisBottom(xScale))
	.select('.domain')
		.remove();

	g.append('g')
		.call(d3.axisLeft(yScale))
	.append('text')
		.attr('fill', '#000')
		.attr('transform', 'rotate(-90)')
		.attr('y', 6)
		.attr('dy', '0.71em')
		.attr('text-anchor', 'end')
		.text('Price ($)');

	g.append('path')
		.datum(data)
		.attr('fill', 'none')
		.attr('stroke', 'steelblue')
		.attr('stroke-linejoin', 'round')
		.attr('stroke-linecap', 'round')
		.attr('stroke-width', 1.5)
		.attr('d', line);
}
