export interface IGraphNode {
	group: number;
	id: string;
	label: string;
	value: number;
}

export interface IGraphLink {
	id: string;
	label: string;
	source: string;
	target: string;
	value: number;
}

export interface IGraph {
	links: IGraphLink[];
	nodes: IGraphNode[];
}
