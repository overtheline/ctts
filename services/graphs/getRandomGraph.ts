import { Request, Response } from 'express';
import { generateRandomGraph } from './generators/generateRandomGraph';

export default async function getRandomGraph(req: Request, res: Response): Promise<void> {
	const size: number = req.query.size;
	const graph = generateRandomGraph(size);

	res.json(graph);
}
