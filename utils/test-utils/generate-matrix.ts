export function generateRandomMatrix(r: number, c: number): number[][] {
	const arrR = [];
	for (let i = 0; i < r; i++) {
		const arrC = [];
		for (let j = 0; j < c; j++) {
			arrC.push(Math.random());
		}
		arrR.push(arrC);
	}

	return arrR;
}
