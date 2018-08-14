import { Request, Response } from 'express';
import { generateRandomGraph } from './generators/generateRandomGraphMatrix';

export default async function getRandomGraph(req: Request, res: Response): Promise<void> {
	const size: number = req.query.size;
	const type: 'directed' | 'undirected' = req.query.type;
	const graph = generateRandomGraph(size, type);

	res.json(graph);
}
