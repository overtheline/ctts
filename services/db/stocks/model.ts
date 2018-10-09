import {
	model,
} from 'mongoose';

import { IStockRow } from '../../../types/stockTypes';
import {
	stockNameSchema,
	stockRowSchema,
} from './schema';

export const StockRow = model<IStockRow>('Stock', stockRowSchema);
export const StockName = model('StockName', stockNameSchema);
