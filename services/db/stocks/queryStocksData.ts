import { IStockRow } from '../../../types/stockTypes';
import { mongooseFind } from '../../../utils/mongoose-basic-find';
import { StockRow } from './model';

export async function queryStocksData(names: string[]): Promise<IStockRow[]> {
	return await mongooseFind(StockRow, { name: { $in: names }});
}
