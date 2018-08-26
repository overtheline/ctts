import * as React from 'react';

import { IGraph } from '../../types/graphTypes';
import { forceGraph } from './forceGraph/forceGraph';
import './styles.css';

interface IState {
	nodeCount: number;
}

const GRAPH_ELEMENT_ID = 'graph-0';

export default class GraphsApp extends React.Component<any, IState> {
	constructor(props: any) {
		super(props);

		this.state = {
			nodeCount: 20,
		};
	}

	public componentDidMount() {
		this.fetchRandomGraph();
	}

	public render() {
		return (
			<div>
				<h1>Graphs</h1>
				<div id="graphs" />
				<div>
					<label>{`node count: ${this.state.nodeCount}`}</label>
					<input
						type="range"
						id="node-count"
						name="node-count"
						min={10}
						max={100}
						value={this.state.nodeCount}
						step={1}
						onChange={this.nodeCountChangeHandler}
					/>
				</div>
				<div>
					<input
						onClick={this.generateRandomGraphHandler}
						type="button"
						value="Generate New Graph"
					/>
				</div>
				<div id={GRAPH_ELEMENT_ID} />
			</div>
		);
	}

	private fetchRandomGraph = () => {
		fetch(`/graphs/randomGraph?size=${this.state.nodeCount}`).then(
			(res) => res.json(),
			(err) => { console.log(err); }
		).then(
			(graph: IGraph) => {
				forceGraph({
					elementId: GRAPH_ELEMENT_ID,
					graph,
					height: 900,
					width: 900,
				});
			}
		);
	}

	private generateRandomGraphHandler = () => {
		this.fetchRandomGraph();
	}

	private nodeCountChangeHandler = (event: any) => {
		this.setState({ nodeCount: event.target.value });
	}
}
