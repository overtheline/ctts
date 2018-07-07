import * as d3 from 'd3';
import * as React from 'react';

import {
	IIrisDatum,
	IRawIrisDatum
} from '../../../../types';

const margin = {
	bottom: 20,
	left: 40,
	right: 20,
	top: 20,
};

const CHART_WIDTH = 700;

const width = CHART_WIDTH - margin.left - margin.right;
const height = CHART_WIDTH * (5 / 8) - margin.top - margin.bottom;

const xScale = d3.scaleLinear().range([0, width]);
const yScale = d3.scaleLinear().range([height, 0]);

const color = d3.schemeCategory10;

const types = ['Iris-setosa', 'Iris-versicolor', 'Iris-virginica'];

function getTypeIndex(type: string) {
	return types.indexOf(type);
}

const xAxis = d3.axisBottom(xScale);
const yAxis = d3.axisLeft(yScale);

let svg;

export function createChart(ref: React.RefObject<any>, id: string, json: IRawIrisDatum[]) {
	svg = d3.select(id).append('svg')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
		.append('g')
			.attr('transform', `translate(${margin.left}, ${margin.top})`);

	const data: IIrisDatum[] = json.map(({
		petalLength,
		petalWidth,
		sepalLength,
		sepalWidth,
		type,
	}) => ({
		petalLength: Number(petalLength),
		petalWidth: Number(petalWidth),
		sepalLength: Number(sepalLength),
		sepalWidth: Number(sepalWidth),
		type,
	}));

	const sepalWidthsExtent = d3.extent(data, (d) => d.sepalWidth) as [number, number];
	const sepalLengthsExtent = d3.extent(data, (d) => d.sepalLength) as [number, number];

	xScale.domain(sepalWidthsExtent).nice();
	yScale.domain(sepalLengthsExtent).nice();

	svg.append('g')
			.attr('class', 'x axis')
			.attr('transform', `translate(0, ${height})`)
			.call(xAxis)
		.append('text')
			.attr('class', 'label')
			.attr('x', width)
			.attr('y', -6)
			.style('text-anchor', 'end')
			.text('Sepal Width (cm)');

	svg.append('g')
			.attr('class', 'y axis')
			.call(yAxis)
		.append('text')
			.attr('class', 'label')
			.attr('transform', 'rotate(-90)')
			.attr('y', 6)
			.attr('dy', '.71em')
			.style('text-anchor', 'end')
			.text('Sepal Length (cm)');

	svg.selectAll('.dot')
			.data(data)
		.enter().append('circle')
			.attr('class', 'dot')
			.attr('r', 3.5)
			.attr('cx', (d) => xScale(d.sepalWidth))
			.attr('cy', (d) => yScale(d.sepalLength))
			.style('fill', (d) => color[getTypeIndex(d.type)]);

	const legend = svg.selectAll('.legend')
			.data(types)
		.enter().append('g')
			.attr('class', 'legend')
			.attr('transform', (d, i) => 'translate(0,' + i * 20 + ')');

	legend.append('rect')
			.attr('x', width - 18)
			.attr('width', 18)
			.attr('height', 18)
			.style('fill', (d) => color[getTypeIndex(d)]);

	legend.append('text')
			.attr('x', width - 24)
			.attr('y', 9)
			.attr('dy', '.35em')
			.style('text-anchor', 'end')
			.text((d) => d);
}
