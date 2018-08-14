import * as React from 'react';

import getMiserablesGraph, { forceGraph } from './forceGraph/forceGraph';

export default class GraphsApp extends React.Component<any, any> {
	constructor(props: any) {
		super(props);

		this.state = { graph: null };
	}
	public componentDidMount() {
		getMiserablesGraph();

		fetch('/graphs/randomGraph?size=40&type=directed').then(
			(res) => res.json(),
			(err) => { console.log(err); }
		).then(
			(graph) => {
				this.setState({ graph });
			}
		);
	}

	public componentDidUpdate() {
		const {
			graph,
		} = this.state;

		if (graph) {
			forceGraph(graph);
		}
	}

	public render() {
		return (
			<div>
				<h1>Graphs</h1>
				<div id="graphs" />
				<div id="graph-2" />
			</div>
		);
	}
}
