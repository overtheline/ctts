import * as d3 from 'd3';

import { IGraph } from '../../../types/graphTypes';
import './styles.css';

export interface IForceGraphConfig {
	elementId: string;
	graph: IGraph;
	height?: number;
	width?: number;
}

export function forceGraph(config: IForceGraphConfig) {
	const {
		elementId,
		graph,
		height = 500,
		width = 800,
	} = config;

	function ticked() {
		link
				.attr('x1', (d: any) => d.source.x)
				.attr('y1', (d: any) => d.source.y)
				.attr('x2', (d: any) => d.target.x)
				.attr('y2', (d: any) => d.target.y);

		node
				.attr('cx', (d: any) => d.x)
				.attr('cy', (d: any) => d.y);
	}

	function dragstarted(d: any) {
		if (!d3.event.active) { simulation.alphaTarget(0.3).restart(); }
		d.fx = d.x;
		d.fy = d.y;
	}

	function dragged(d: any) {
		d.fx = d3.event.x;
		d.fy = d3.event.y;
	}

	function dragended(d: any) {
		if (!d3.event.active) { simulation.alphaTarget(0); }
		d.fx = null;
		d.fy = null;
	}

	d3.select('.graph-svg').remove();
	const svg = d3.select(`#${elementId}`).append('svg');
	svg.attr('width', width);
	svg.attr('height', height);
	svg.classed('graph-svg', true);

	const color = d3.scaleOrdinal(d3.schemeCategory10);

	const simulation: any = d3.forceSimulation()
			.force('link', d3.forceLink().id((d: any) => d.id))
			.force('charge', d3.forceManyBody())
			.force('center', d3.forceCenter(width / 2, height / 2));

	const link = svg.append('g')
			.attr('class', 'links')
		.selectAll('line')
		.data(graph.links)
		.enter().append('line')
			.attr('stroke-width', (d: any) => Math.sqrt(d.value));

	const node = svg.append('g')
			.attr('class', 'nodes')
		.selectAll('circle')
		.data(graph.nodes)
		.enter().append('circle')
			.attr('r', 5)
			.attr('fill', (d: any) => color(String(d.group % d3.schemeCategory10.length)))
			.call(d3.drag<any, any>()
					.on('start', dragstarted)
					.on('drag', dragged)
					.on('end', dragended));

	node.append('title')
			.text((d: any) => `${d.id}:${d.group}`);

	simulation
			.nodes(graph.nodes)
			.on('tick', ticked);

	simulation.force('link')
			.links(graph.links);
}
