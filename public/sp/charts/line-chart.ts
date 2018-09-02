import * as d3 from 'd3';
import {
	findIndex,
	map,
} from 'lodash';

import { IRawStockData } from '../app';
import './line-chart-styles.css';

export interface ILineChartConfig {
	elementId: string;
	data: IRawStockData;
	height?: number;
	width?: number;
}

function parseDateString(dateString: string): string {
	const [year, month, day]: number[] = map(dateString.split('-'), (d) => Number(d));

	const dateObj = new Date(year, month - 1, day);

	return dateObj.toDateString();
}

function parseDateTime(dateString: string): number {
	const [year, month, day]: number[] = map(dateString.split('-'), (d) => Number(d));
	const dateObj = new Date(year, month - 1, day);

	return dateObj.getTime();
}

export function lineChart(config: ILineChartConfig) {
	const {
		elementId,
		data,
		height = 500,
		width = 800,
	} = config;

	const closeIndex = findIndex(data.columnHeaders, (d) => d === 'close');
	const dateIndex = findIndex(data.columnHeaders, (d) => d === 'date');
	const parsedData = map(
		data.rows.sort((a, b) => parseDateTime(a[dateIndex]) - parseDateTime(b[dateIndex])),
		(row) => [
			parseDateString(row[dateIndex]),
			row[closeIndex],
		]
	);

	d3.select(`#${elementId} svg`).remove();
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

	const line = d3.line()
			.x((d: any) => xScale(d[0]))
			.y((d: any) => yScale(d[1]));

	const [xMin = 0, xMax = 1] = d3.extent(parsedData, (d) => parseTime(d[0]));
	xScale.domain([xMin, xMax]);

	const [yMin = 0, yMax = 1] = d3.extent(parsedData, (d) => Number(d[1]));
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
			.datum(map(parsedData, (d) => [parseTime(d[0]), Number(d[1])]))
			.attr('fill', 'none')
			.attr('stroke', 'steelblue')
			.attr('stroke-linejoin', 'round')
			.attr('stroke-linecap', 'round')
			.attr('stroke-width', 1.5)
			.attr('d', line);
}
