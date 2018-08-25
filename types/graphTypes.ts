export interface IGraphNode {
	group: number;
	id: string;
	label: string;
	value: number;
}

export interface IGraphLink {
	source: string;
	target: string;
	value: number;
	id: string;
	label: string;
}

export interface IGraph {
	links: IGraphLink[];
	nodes: IGraphNode[];
}
