import {
	model,
} from 'mongoose';

import {
	stockNameSchema,
	stockRowSchema,
} from './schema';

export const StockRow = model('Stock', stockRowSchema);
export const StockName = model('StockName', stockNameSchema);
