import * as d3 from 'd3';
import {
	reduce,
} from 'lodash';

import { IIrisDatum } from '../../../../types';

interface IColorMap {
	[type: string]: string;
}

export function createChart(elementId: string, json: IIrisDatum[]): (nextJson: IIrisDatum[]) => void {
	const colors = d3.schemeCategory10;
	const types = ['Iris-setosa', 'Iris-versicolor', 'Iris-virginica'];
	const colorMap = reduce<string, IColorMap>(types, (acc, type, index) => {
		acc[type] = colors[index];
		return acc;
	}, {});

	const data: IIrisDatum[] = json;
	const id: string = elementId;

	const margin = {
		bottom: 100,
		left: 100,
		right: 20,
		top: 20,
	};

	const CHART_WIDTH = 700;

	const width = CHART_WIDTH - margin.left - margin.right;
	const height = CHART_WIDTH * (5 / 8) - margin.top - margin.bottom;

	const xScale = d3.scaleLinear().range([0, width]);
	const yScale = d3.scaleLinear().range([height, 0]);

	const xAxis = d3.axisBottom(xScale);
	const yAxis = d3.axisLeft(yScale);

	const svg = d3.select(id).append('svg')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom);

	const g = svg.append('g')
			.attr('transform', `translate(${margin.left}, ${margin.top})`);

	function updateChart(nextJson: IIrisDatum[]) {
		nextJson.forEach((datum) => data.push(datum));

		const sepalWidthsExtent = d3.extent(data, (d) => d.sepalWidth) as [number, number];
		const sepalLengthsExtent = d3.extent(data, (d) => d.sepalLength) as [number, number];

		xScale.domain(sepalWidthsExtent).nice();
		yScale.domain(sepalLengthsExtent).nice();

		g.append('g')
				.attr('class', 'x axis')
				.attr('transform', `translate(0, ${height})`)
				.call(xAxis)
			.append('text')
				.attr('class', 'label')
				.attr('x', width)
				.attr('y', -6)
				.style('text-anchor', 'end')
				.style('fill', 'black')
				.text('Sepal Width (cm)');

		g.append('g')
				.attr('class', 'y axis')
				.call(yAxis)
			.append('text')
				.attr('class', 'label')
				.attr('transform', 'rotate(-90)')
				.attr('y', 6)
				.attr('dy', '.71em')
				.style('text-anchor', 'end')
				.style('fill', 'black')
				.text('Sepal Length (cm)');

		const t = d3.transition()
				.duration(750);

		// JOIN
		const dots = g.selectAll('.dot')
			.data(data);

		// EXIT
		dots.exit()
				.attr('class', 'exit dot')
			.transition(t)
				.style('fill-opacity', 0.01)
				.remove();

		// UPDATE
		dots.attr('class', 'update dot')
				.style('fill-opacity', 1);

		// ENTER
		dots.enter().append('circle')
				.attr('class', 'enter dot')
				.attr('r', 3.5)
				.attr('cx', () => width / 2)
				.attr('cy', () => height / 2)
				.style('fill', (d: IIrisDatum) => colorMap[d.type])
				.style('fill-opacity', 0.01)
			.transition(t)
				.attr('cx', (d: IIrisDatum) => xScale(d.sepalWidth))
				.attr('cy', (d: IIrisDatum) => yScale(d.sepalLength))
				.style('fill-opacity', 1);
	}

	updateChart([]);

	return updateChart;
}
