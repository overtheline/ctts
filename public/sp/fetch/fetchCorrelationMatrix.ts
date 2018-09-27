export async function fetchCorrelationMatrix(names: string[], dataColumn: string): Promise<number[][]> {
	return await fetch(`/sp/stock?names=${names.join(',')}&dataColumn=${dataColumn}`).then(
		(res) => res.json(),
		(err) => { console.log(err); }
	);
}
