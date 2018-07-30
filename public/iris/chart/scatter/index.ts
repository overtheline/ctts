import * as d3 from 'd3';
import {
	Dictionary,
	reduce,
} from 'lodash';

import { IIrisDatum } from '../../../../types';

interface IColorMap {
	[type: string]: string;
}

export class IrisChart {
	private colors: ReadonlyArray<string> = d3.schemeCategory10;
	private types: ReadonlyArray<string> = ['Iris-setosa', 'Iris-versicolor', 'Iris-virginica'];
	private colorMap: Dictionary<string> = reduce<string, IColorMap>(this.types, (acc, type, index) => {
		acc[type] = this.colors[index];
		return acc;
	}, {});
	private margin: Dictionary<number> = {
		bottom: 100,
		left: 100,
		right: 20,
		top: 20,
	};
	private CHART_WIDTH: number = 700;
	private width: number = this.CHART_WIDTH - this.margin.left - this.margin.right;
	private height: number = this.CHART_WIDTH * (5 / 8) - this.margin.top - this.margin.bottom;
	private xScale = d3.scaleLinear().range([0, this.width]);
	private yScale = d3.scaleLinear().range([this.height, 0]);
	private xAxis = d3.axisBottom(this.xScale);
	private yAxis = d3.axisLeft(this.yScale);
	private id: string;
	private data: IIrisDatum[] = [];

	private svg: d3.Selection<any, any, any, any>;
	private g: d3.Selection<any, any, any, any>;

	constructor(elementId: string) {
		this.id = elementId;
	}

	public renderChart(nextJson: IIrisDatum[]): void {
		const {
			width,
			margin,
			height,
			id,
		} = this;

		this.svg = d3.select(id).append('svg')
				.attr('width', width + margin.left + margin.right)
				.attr('height', height + margin.top + margin.bottom);

		this.g = this.svg.append('g')
				.attr('transform', `translate(${margin.left}, ${margin.top})`);

		this.updateChart(nextJson);
	}

	public updateChart(nextJson: IIrisDatum[]) {
		const {
			data,
			xScale,
			xAxis,
			yScale,
			yAxis,
			g,
			width,
			height,
			colorMap,
		} = this;

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
}
