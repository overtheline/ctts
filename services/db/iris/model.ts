import {
	model,
} from 'mongoose';

import { IIrisDatum } from '../../../types/irisTypes';
import {
 irisRowSchema,
} from './schema';

export const IrisRow = model<IIrisDatum>('Iris', irisRowSchema);
