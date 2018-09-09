import { parseDateTime } from '../../../utils/index';

export function parseDateString(dateString: string): string {
	const [year, month, day]: number[] = dateString.split('-').map((d) => Number(d));
	const dateObj = new Date(year, month - 1, day);

	return dateObj.toDateString();
}

export function timeOptionFilter(timeOption: string, data: string[][], timeIndex: number): string[][] {
	const stage = data.map((datum) => ({ datum, t: parseDateTime(datum[timeIndex])})).sort((a, b) => b.t - a.t);
	const latestTime = stage[0].t;
	let delta: number = 0;

	switch (timeOption) {
		case '1mo':
			// 1000ms * 60s * 60m * 24h * 7d * 52w * 1/12y
			delta = 1000 * 60 * 60 * 24 * 7 * 52 / 12;
			break;
		case '6mo':
			// 1000ms * 60s * 60m * 24h * 7d * 52w * 6/12y
			delta = 1000 * 60 * 60 * 24 * 7 * 52 * 6 / 12;
			break;
		case '1yr':
			// 1000ms * 60s * 60m * 24h * 7d * 52w * 1y
			delta = 1000 * 60 * 60 * 24 * 7 * 52;
			break;
		default:
			delta = Infinity;
			break;
	}

	const cutoffTime = latestTime - delta;
	const filteredData = stage.filter((d) => d.t > cutoffTime);

	return filteredData.map((d) => d.datum);
}
