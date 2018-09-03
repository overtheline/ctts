import * as _ from 'lodash';

import {
	IStockDataStore,
} from '../app';
import {parseDateTime} from '../utils';

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
						.sort((a, b) => parseDateTime(a[dateIndex]) - parseDateTime(b[dateIndex]));
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
