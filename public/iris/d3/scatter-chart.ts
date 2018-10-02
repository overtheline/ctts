import * as d3 from 'd3';

interface INumberValued {
	[key: string]: number;
}

export interface IDatum {
	correct: boolean;
	datasetType: 'training' | 'prediction';
	features: [number, number];
	label: string;
}

export interface IScatterChartConfig {
	data: IDatum[];
	elementId: string;
	height: number;
	width: number;
	xLabel: string;
	yLabel: string;
}

export function scatterChart(config: IScatterChartConfig): void {
	const colorScale = d3.scaleOrdinal(d3.schemeCategory10).domain(['Iris-setosa', 'Iris-versicolor', 'Iris-virginica']);
	const margin: INumberValued = {
		bottom: 100,
		left: 100,
		right: 20,
		top: 20,
	};
	const innerWidth = config.width - margin.left - margin.right;
	const innerHeight = config.height - margin.top - margin.bottom;
	const xExtent = d3.extent(config.data, (d) => d.features[0]) as [number, number];
	const yExtent = d3.extent(config.data, (d) => d.features[1]) as [number, number];
	const xScale = d3.scaleLinear()
			.range([0, innerWidth])
			.domain(xExtent).nice();
	const yScale = d3.scaleLinear()
			.range([innerHeight, 0])
			.domain(yExtent).nice();
	const xAxis = d3.axisBottom(xScale);
	const yAxis = d3.axisLeft(yScale);

	const svg = d3.select(`#${config.elementId}`).append('svg')
			.attr('width', config.width)
			.attr('height', config.height);

	const g = svg.append('g')
			.attr('transform', `translate(${margin.left}, ${margin.top})`);

	g.append('g')
			.attr('class', 'x axis')
			.attr('transform', `translate(0, ${innerHeight})`)
			.call(xAxis)
		.append('text')
			.attr('class', 'label')
			.attr('x', innerWidth)
			.attr('y', -6)
			.style('text-anchor', 'end')
			.style('fill', 'black')
			.text(config.xLabel);

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
			.text(config.yLabel);

	const dataPoints = g.selectAll('.data-point')
			.data(config.data);

	// ENTER
	dataPoints.enter().append('circle')
			.attr('class', 'dot')
			.attr('r', 3.5)
			.attr('cx', (d) => xScale(d.features[0]))
			.attr('cy', (d) => yScale(d.features[1]))
			.style('fill', (d) => colorScale(d.label))
			.style('fill-opacity', (d) => d.datasetType === 'training' ? 0.2 : 1)
			.style('stroke', (d) => d.correct ? colorScale(d.label) : 'black')
			.style('stroke-width', (d) => d.correct ? '0px' : '2px' );
}
