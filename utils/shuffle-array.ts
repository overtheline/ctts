export function shuffleArray(array: any[]) {
	const stage = array.map((datum) => ({ datum, sortOrder: Math.random() }));
	stage.sort((a, b) => a.sortOrder - b.sortOrder);
	return stage.map((d) => d.datum);
}
