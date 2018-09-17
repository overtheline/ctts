import { Request, Response } from 'express';

import { arrayValueIndex } from '../../utils/array-value-index-map';
import { computeCorrelationMatrix } from '../../utils/correlation';
import { columnHeaders } from '../db/spColumnHeaders';
import { fetchSPData } from '../db/spData';

export async function requestSPCorrelationMatrix(req: Request, res: Response): Promise<void> {
	const names: string[] = req.query.names.split(',');
	const dataColumn: string = req.query.dataColumn;

	const spData = await fetchSPData(names);
	const nameIdx = arrayValueIndex(columnHeaders, 'Name');
	const columnIdx = arrayValueIndex(columnHeaders, dataColumn);

	if (columnIdx === -1) {
		res.send(new Error('select a column header'));
	}

	const dataGroupedByName = names.map((name) => spData.filter((datum) => datum[nameIdx] === name));
	const preparedData = dataGroupedByName.map((dataGroup) => dataGroup.map((datum) => Number(datum[columnIdx])));

	res.send(computeCorrelationMatrix(preparedData));
}
