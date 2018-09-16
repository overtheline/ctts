import { Request, Response } from 'express';
import { fetchSPData } from '../db/getSPData';
import { fetchSPNames } from '../db/getSPNames';

export interface IStockData {
	columnHeaders: string[];
	rows: string[][];
}

export default async function getCorrelations(req: Request, res: Response): Promise<void> {
	const stockNames = await fetchSPNames();

	// TODO: get a string[][] [name, close]. Do correlation on name value pairs.
	// const dataByName: Array<Promise<string[]>> = stockNames.map(async (name) => {
	// 	const data = await fetchSPData([name]).then(
	// 		({
	// 			columnHeaders: stockColumnHeaders,
	// 			rows,
	// 		}: IStockData) => {
	// 			const dateIndex = stockColumnHeaders.findIndex((col) => col === 'date');
	// 			const sortedRows = rows.sort((a, b) => parseDateTime(b[dateIndex]) - parseDateTime(a[dateIndex]));

	// 			return {
	// 				columnHeaders: stockColumnHeaders,
	// 				rows: sortedRows,
	// 			};
	// 		}
	// 	);

	// 	return [name, data];
	// });

}
