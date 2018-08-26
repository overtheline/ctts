import * as d3 from 'd3';

export default async function getMiserablesGraph() {
	const svg = d3.select('#graphs').append('svg');
	const width = 800;
	const height = 500;
	svg.attr('width', 800);
	svg.attr('height', 500);

	const color = d3.scaleOrdinal(d3.schemeCategory10);

	const simulation: any = d3.forceSimulation()
			.force('link', d3.forceLink().id((d: any) => d.id))
			.force('charge', d3.forceManyBody())
			.force('center', d3.forceCenter(width / 2, height / 2));

	await fetch('/graphs/miserables').then(
		(res) => res.json(),
		(err) => { console.log(err); }
	)
	.then(
		(graph) => {
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
					.attr('fill', (d: any) => color(d.group))
					.call(d3.drag()
							.on('start', dragstarted)
							.on('drag', dragged)
							.on('end', dragended));

			node.append('title')
					.text((d: any) => d.id);

			simulation
					.nodes(graph.nodes)
					.on('tick', ticked);

			simulation.force('link')
					.links(graph.links);

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
		},
		(err) => { console.log(err); }
	);

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
}
