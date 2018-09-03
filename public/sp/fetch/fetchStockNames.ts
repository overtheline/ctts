import * as _ from 'lodash';

import { ISelectOption } from '../app';

export async function fetchStockNames(): Promise<ISelectOption[]> {
	return await fetch('/sp/names').then(
		(res) => res.json(),
		(err) => { console.log(err); }
	).then(
		(names: string[]) => names.map(
			(name) => ({
				label: name,
				value: name,
			})
		)
	);
}
