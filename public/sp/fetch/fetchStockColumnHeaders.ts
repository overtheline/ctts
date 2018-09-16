export async function fetchStockColumnHeaders(): Promise<string[]> {
	return await fetch('/sp/columnHeaders').then(
		(res) => res.json(),
		(err) => { console.log(err); }
	);
}
