export function parseDateTime(dateString: string): number {
	const [year, month, day]: number[] = dateString.split('-').map((d) => Number(d));
	const dateObj = new Date(year, month - 1, day);

	return dateObj.getTime();
}
