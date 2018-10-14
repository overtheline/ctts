import { Request, Response } from 'express';
import { queryStocksData } from '../../../services/db/stocks/queryStocksData';

export async function requestStocksData(req: Request, res: Response): Promise<void> {
	const names: string[] = req.query.names.split(',');

	res.send(await queryStocksData(names));
}
