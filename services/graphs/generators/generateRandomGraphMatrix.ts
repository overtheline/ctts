import {
	castArray,
} from 'lodash';
import {
	Matrix,
	matrix,
	random,
} from 'mathjs';

import {
	ID3Graph,
	ID3Link,
	ID3Node,
} from '../../../types';

export function generateRandomDirectedGraphMatrix(n: number): Matrix {
	const adjacencyMatrixArray: number[][] = [];

	for (let rowIndex = 0; rowIndex < n; rowIndex++) {
		const row: number[] = [];

		for (let colIndex = 0; colIndex < n; colIndex++) {
			const entry = random() < 0.1 ? 1 : 0;

			row.push(entry);
		}

		adjacencyMatrixArray.push(row);
	}

	return matrix(adjacencyMatrixArray, 'sparse');
}

export function generateRandomUndirectedGraphMatrix(n: number): Matrix {
	const adjacencyMatrixArray: number[][] = [];

	for (let rowIndex = 0; rowIndex < n; rowIndex++) {
		adjacencyMatrixArray.push([]);
	}

	for (let rowIndex = 0; rowIndex < n; rowIndex++) {
		for (let colIndex = rowIndex; colIndex < n; colIndex++) {
			const entry = random() < 0.1 ? 1 : 0;

			adjacencyMatrixArray[rowIndex][colIndex] = entry;
			if (colIndex !== rowIndex) {
				adjacencyMatrixArray[colIndex][rowIndex] = entry;
			}
		}
	}

	return matrix(adjacencyMatrixArray, 'sparse');
}

export function generateRandomGraph(n: number, type: 'directed' | 'undirected'): ID3Graph {
	const nodes: ID3Node[] = [];
	const links: ID3Link[] = [];

	const graphMatrix: Matrix = type === 'directed'
		? generateRandomUndirectedGraphMatrix(n)
		: generateRandomDirectedGraphMatrix(n);

	for (let i = 0; i < n; i++) {
		nodes.push({
			group: 1,
			id: String(i),
		});
	}

	graphMatrix.forEach((value, index) => {
		const [source, target] = castArray(index).map((v) => String(v));

		if (value) {
			links.push({
				source,
				target,
				value: 1,
			});
		}
	});

	return { nodes, links };
}
