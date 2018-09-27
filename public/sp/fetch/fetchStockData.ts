import * as _ from 'lodash';

export async function fetchStockData(names: string[]): Promise<string[][]> {
	return await fetch(`/sp/data?names=${names.join(',')}`).then(
		(res) => res.json(),
		(err) => { console.log(err); }
	);
}
