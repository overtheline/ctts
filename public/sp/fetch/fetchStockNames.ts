export async function fetchStockNames(): Promise<string[]> {
	return await fetch('/sp/names').then(
		(res) => res.json(),
		(err) => { console.log(err); }
	);
}
