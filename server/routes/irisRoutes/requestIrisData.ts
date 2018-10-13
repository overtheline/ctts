import { Request, Response } from 'express';
import { queryIrisData } from '../../../services/db/iris/queryIrisData';

export async function requestIrisData(req: Request, res: Response): Promise<void> {
	res.send(await queryIrisData());
}
