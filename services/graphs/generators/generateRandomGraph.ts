import {
	castArray,
	fill,
	filter,
	map,
	reduce,
	slice,
	some,
} from 'lodash';
import {
	randomInt,
} from 'mathjs';

import {
	IGraph,
	IGraphLink,
	IGraphNode,
} from '../../../types/graphTypes';
import { generateArray } from '../../../utils/generate-array';
import { shuffleArray } from '../../../utils/shuffle-array';

export function generateRandomTree(n: number): IGraph {
	const nodes: IGraphNode[] = map(
		generateArray(n),
		(value: number, index: number): IGraphNode => ({
			group: 0,
			id: `id-${index}`,
			label: `id-${index}`,
			value: 1,
		})
	);

	const links: IGraphLink[] = reduce(
		nodes,
		(linkList: IGraphLink[], targetNode: IGraphNode, targetIndex: number, nodeList: IGraphNode[]) => {
			if (targetIndex === 0) {
				return linkList;
			}

			let sourceNodeId: string;

			if (targetIndex === 1) {
				sourceNodeId = nodeList[0].id;
			}

			sourceNodeId = nodeList[randomInt(0, targetIndex)].id;

			return [
				...linkList,
				{
					id: `${sourceNodeId}:${targetNode.id}`,
					label: `link-${sourceNodeId}:${targetNode.id}`,
					source: sourceNodeId,
					target: targetNode.id,
					value: 1,
				},
			];
		},
		[]
	);

	return { nodes, links };
}

export function generateRandomGraph(n: number): IGraph {
	const initialGraph = generateRandomTree(n);
	const maxLinksToAdd = (n - 1) * (n - 2) / 2;
	const linksToAdd = randomInt(0, maxLinksToAdd + 1);
	const allPossibleLinks: IGraphLink[] = reduce(
		initialGraph.nodes,
		(linkList: IGraphLink[], sourceNode: IGraphNode, sourceIndex: number, nodeList: IGraphNode[]): IGraphLink[] => {
			if (sourceIndex === nodeList.length - 1) {
				return linkList;
			}

			const admissableLinks = map(
				slice(nodeList, sourceIndex + 1),
				(targetNode: IGraphNode) => ({
					id: `${sourceNode.id}:${targetNode.id}`,
					label: `link-${sourceNode.id}:${targetNode.id}`,
					source: `${sourceNode.id}`,
					target: `${targetNode.id}`,
					value: 1,
				})
			);

			return [
				...linkList,
				...admissableLinks,
			];
		},
		[]
	);

	const linksToChoose: IGraphLink[] = shuffleArray(filter(
		allPossibleLinks,
		(possibleLink) => !some(initialGraph.links, (existingLink) => existingLink.id === possibleLink.id)
	));

	const links = [
		...initialGraph.links,
		...slice(linksToChoose, 0, linksToAdd),
	];

	const nodes = initialGraph.nodes;

	return { nodes, links };
}
