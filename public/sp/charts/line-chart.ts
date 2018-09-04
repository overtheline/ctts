import * as d3 from 'd3';

import { parseDateString, timeOptionFilter } from '../utils';
import './line-chart-styles.css';

export interface ILineChartConfig {
	elementId: string;
	data: string[][];
	height?: number;
	timeIndex: number;
	timeRangeOption: string;
	valueIndex: number;
	width?: number;
}

export function lineChart(config: ILineChartConfig) {
	const {
		elementId,
		data,
		height = 500,
		timeIndex,
		timeRangeOption,
		valueIndex,
		width = 800,
	} = config;

	const parsedData = timeOptionFilter(timeRangeOption, data, timeIndex).map((row) => ({
		date: parseDateString(row[timeIndex]),
		value: Number(row[valueIndex]),
	}));

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

	const [xMin = 0, xMax = 1] = d3.extent(parsedData, (d) => parseTime(d.date));
	xScale.domain([xMin, xMax]);

	const [yMin = 0, yMax = 1] = d3.extent(parsedData, (d) => Number(d.value));
	yScale.domain([yMin, yMax]);

	g.append('g')
			.attr('transform', `translate(0,${chartHeight})`)
			.call(d3.axisBottom(xScale).ticks(6))
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
			.datum(parsedData.map((d) => [parseTime(d.date), Number(d.value)]))
			.attr('fill', 'none')
			.attr('stroke', 'steelblue')
			.attr('stroke-linejoin', 'round')
			.attr('stroke-linecap', 'round')
			.attr('stroke-width', 1.5)
			.attr('d', line);
}
