import * as React from 'react';

import { IGraph } from '../../types/graphTypes';
import getMiserablesGraph, { forceGraph } from './forceGraph/forceGraph';
import './styles.css';

interface IState {
	graphs: IGraph[];
}

export default class GraphsApp extends React.Component<any, IState> {
	constructor(props: any) {
		super(props);

		this.state = { graphs: [] };
	}
	public componentDidMount() {
		getMiserablesGraph();

		fetch('/graphs/randomGraph?size=10').then(
			(res) => res.json(),
			(err) => { console.log(err); }
		).then(
			(graph) => {
				this.setState({ graphs: [graph] });
			}
		);
	}

	public componentDidUpdate() {
		const {
			graphs,
		} = this.state;

		if (graphs.length) {
			forceGraph(graphs[0]);
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
