import * as _ from 'lodash';

import { parseDateTime } from '../../../utils/index';
import {
	IStockDataStore,
} from '../app';

export async function fetchStockData(names: string[]): Promise<{
	stockColumnHeaders: string[];
	stockDataStore: IStockDataStore;
}> {
	return await fetch(`/sp/data?names=${names.join(',')}`).then(
		(res) => res.json(),
		(err) => { console.log(err); }
	).then(
		({
			columnHeaders: stockColumnHeaders,
			rows,
		}: {
			columnHeaders: string[],
			rows: string[][],
		}) => {
			const nameIndex = stockColumnHeaders.findIndex((col) => col === 'Name');
			const dateIndex = stockColumnHeaders.findIndex((col) => col === 'date');
			const stockDataStore = names.reduce(
				(acc: {[key: string]: string[][]}, name) => {
					acc[name] = rows
						.filter((row) => row[nameIndex] === name)
						.sort((a, b) => parseDateTime(b[dateIndex]) - parseDateTime(a[dateIndex]));
					return acc;
				},
				{}
			);

			return {
				stockColumnHeaders,
				stockDataStore,
			};
		}
	);
}
