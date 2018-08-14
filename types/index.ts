export interface IRawIrisDatum {
	petalLength: string;
	petalWidth: string;
	sepalLength: string;
	sepalWidth: string;
	type: string;
}

export interface IIrisDatum {
	petalLength: number;
	petalWidth: number;
	sepalLength: number;
	sepalWidth: number;
	type: string;
}

export interface ITestIrisDatum {
	petalLength: number;
	petalWidth: number;
	sepalLength: number;
	sepalWidth: number;
}

export interface ID3Node {
	id: string;
	group: number;
}

export interface ID3Link {
	source: string;
	target: string;
	value: number;
}

export interface ID3Graph {
	links: ID3Link[];
	nodes: ID3Node[];
}
