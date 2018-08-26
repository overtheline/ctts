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

/**
 * Generates a random tree
 * @param n number of nodes
 */
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

			let sourceNode: IGraphNode;

			if (targetIndex === 1) {
				sourceNode = nodeList[0];
			} else {
				sourceNode = nodeList[randomInt(0, targetIndex)];
			}

			sourceNode.group++;
			targetNode.group++;

			return [
				...linkList,
				{
					id: `${sourceNode.id}:${targetNode.id}`,
					label: `link-${sourceNode.id}:${targetNode.id}`,
					source: sourceNode.id,
					target: targetNode.id,
					value: 1,
				},
			];
		},
		[]
	);

	return { nodes, links };
}

/**
 * Generates a sparse graph
 * @param n number of nodes
 */
export function generateRandomGraph(n: number): IGraph {
	const initialGraph = generateRandomTree(n);
	const maxLinksToAdd = Math.floor(Math.sqrt((n - 1) * (n - 2) / 2));
	const linksToAdd = randomInt(0, maxLinksToAdd);
	const allPossibleLinks: IGraphNode[][] = reduce(
		initialGraph.nodes,
		(linkList: IGraphNode[][], sourceNode: IGraphNode, sourceIndex: number, nodeList: IGraphNode[]): IGraphNode[][] => {
			if (sourceIndex === nodeList.length - 1) {
				return linkList;
			}

			const admissableLinks = map(
				slice(nodeList, sourceIndex + 1),
				(targetNode: IGraphNode) => [targetNode, sourceNode]
			);

			return [
				...linkList,
				...admissableLinks,
			];
		},
		[]
	);

	const linksToChoose = shuffleArray(filter(
		allPossibleLinks,
		(possibleLink: [IGraphNode, IGraphNode]) => !some(
			initialGraph.links,
			(existingLink: IGraphLink) => existingLink.source === possibleLink[0].id
				&& existingLink.target === possibleLink[1].id
		)
	));

	const chosenLinks = map(
		slice(linksToChoose, 0, linksToAdd),
		([sourceNode, targetNode]: [IGraphNode, IGraphNode]) => {
			sourceNode.group++;
			targetNode.group++;

			return {
				id: `${sourceNode.id}:${targetNode.id}`,
				label: `link-${sourceNode.id}:${targetNode.id}`,
				source: sourceNode.id,
				target: targetNode.id,
				value: 1,
			};
		}
	);

	const links = [
		...initialGraph.links,
		...chosenLinks,
	];

	const nodes = initialGraph.nodes;

	return { nodes, links };
}
