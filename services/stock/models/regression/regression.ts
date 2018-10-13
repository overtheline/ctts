import * as SimpleLinearRegression from 'ml-regression-simple-linear';

import { IStockRow } from '../../../../types/stockTypes';
import { fetchStockData } from '../../../db/stocks/requestStockData';

interface IDataD extends IStockRow {
	day: number;
	string: string;
	time: number;
}

interface IDataE {
	close: number[];
	closeSlope: number;
	endDate: string;
	endTime: number;
	high: number[];
	highSlope: number;
	low: number[];
	lowSlope: number;
	open: number[];
	openSlope: number;
	startDate: string;
	startTime: number;
}

interface IWeekUnitDataBlock {
	close: number[];
	endDate: string;
	endTime: number;
	high: number[];
	low: number[];
	open: number[];
	startDate: string;
	startTime: number;
}

interface IFeatureDataBlock {
	label: number;
	t1Close: number[];
	t1High: number[];
	t1Low: number[];
	t1Open: number[];
	t2Close: number[];
	t2High: number[];
	t2Low: number[];
	t2Open: number[];
	t3Close: number[];
	t3High: number[];
	t3Low: number[];
	t3Open: number[];
	t4Close: number[];
	t4High: number[];
	t4Low: number[];
	t4Open: number[];
}

export interface IRegressionFeature {
	label: number;
	t1Close: number;
	t1High: number;
	t1Low: number;
	t1Open: number;
	t2Close: number;
	t2High: number;
	t2Low: number;
	t2Open: number;
	t3Close: number;
	t3High: number;
	t3Low: number;
	t3Open: number;
	t4Close: number;
	t4High: number;
	t4Low: number;
	t4Open: number;
}

export async function buildRegressionFeatures(name: string) {
	// fetching plain data from db
	const dataA = await fetchStockData([name]);

	// add some metadata about dates
	const dataB = dataA.map((datum) => {
		return Object.assign(datum, {
			day: new Date(datum.date).getUTCDay(),
			string: new Date(datum.date).toUTCString(),
			time: new Date(datum.date).getTime(),
		});
	});

	// sort t_0 -> t_n
	const dataC = dataB.sort((a, b) => a.time - b.time);

	// group data by week
	const dataD: IDataD[][] = dataC.reduce<IDataD[][]>((acc, d, i, a) => {
		if (i === 0) {
			acc[0].push(d);
		} else {
			if (d.day < a[i - 1].day) {
				acc.push([]);
			}
			acc[acc.length - 1].push(d);
		}

		return acc;
	}, [[]]).filter((w) => w.length > 1);

	// compute week unit data blocks
	const weekUnitDataBlocks: IWeekUnitDataBlock[] = dataD.map<IWeekUnitDataBlock>((w) => ({
		close: w.map((d) => d.close),
		endDate: w[w.length - 1].date,
		endTime: w[w.length - 1].time,
		high: w.map((d) => d.high),
		low: w.map((d) => d.low),
		open: w.map((d) => d.open),
		startDate: w[0].date,
		startTime: w[0].time,
	}));

	// compute feature data blocks
	const featureDataBlocks: IFeatureDataBlock[] = weekUnitDataBlocks.map((w, i, a) => {
		if (!a[i + 4]) {
			return {
				label: 0,
				t1Close: [],
				t1High: [],
				t1Low: [],
				t1Open: [],
				t2Close: [],
				t2High: [],
				t2Low: [],
				t2Open: [],
				t3Close: [],
				t3High: [],
				t3Low: [],
				t3Open: [],
				t4Close: [],
				t4High: [],
				t4Low: [],
				t4Open: [],
			};
		}

		return {
			label: ((a[i + 4].close[a[i + 4].close.length - 1] - a[i + 4].close[0]) / a[i + 4].close[0]),
			t1Close: a[i + 3].close,
			t1High: a[i + 3].high,
			t1Low: a[i + 3].low,
			t1Open: a[i + 3].open,
			t2Close: [...a[i + 2].close, ...a[i + 3].close],
			t2High: [...a[i + 2].high, ...a[i + 3].high],
			t2Low: [...a[i + 2].low, ...a[i + 3].low],
			t2Open: [...a[i + 2].open, ...a[i + 3].open],
			t3Close: [...a[i + 1].close, ...a[i + 2].close, ...a[i + 3].close],
			t3High: [...a[i + 1].high, ...a[i + 2].high, ...a[i + 3].high],
			t3Low: [...a[i + 1].low, ...a[i + 2].low, ...a[i + 3].low],
			t3Open: [...a[i + 1].open, ...a[i + 2].open, ...a[i + 3].open],
			t4Close: [...w.close, ...a[i + 1].close, ...a[i + 2].close, ...a[i + 3].close],
			t4High: [...w.high, ...a[i + 1].high, ...a[i + 2].high, ...a[i + 3].high],
			t4Low: [...w.low, ...a[i + 1].low, ...a[i + 2].low, ...a[i + 3].low],
			t4Open: [...w.open, ...a[i + 1].open, ...a[i + 2].open, ...a[i + 3].open],
		};
	}).filter((f) => f.t1Close.length > 0);

	// compute regression features
	const regressionFeatures: IRegressionFeature[] = featureDataBlocks.map((f) => {
		const t1CloseRegression = new SimpleLinearRegression(f.t1Close.map((d, i) => i), f.t1Close);
		const t1HighRegression = new SimpleLinearRegression(f.t1High.map((d, i) => i), f.t1High);
		const t1LowRegression = new SimpleLinearRegression(f.t1Low.map((d, i) => i), f.t1Low);
		const t1OpenRegression = new SimpleLinearRegression(f.t1Open.map((d, i) => i), f.t1Open);
		const t2CloseRegression = new SimpleLinearRegression(f.t2Close.map((d, i) => i), f.t2Close);
		const t2HighRegression = new SimpleLinearRegression(f.t2High.map((d, i) => i), f.t2High);
		const t2LowRegression = new SimpleLinearRegression(f.t2Low.map((d, i) => i), f.t2Low);
		const t2OpenRegression = new SimpleLinearRegression(f.t2Open.map((d, i) => i), f.t2Open);
		const t3CloseRegression = new SimpleLinearRegression(f.t3Close.map((d, i) => i), f.t3Close);
		const t3HighRegression = new SimpleLinearRegression(f.t3High.map((d, i) => i), f.t3High);
		const t3LowRegression = new SimpleLinearRegression(f.t3Low.map((d, i) => i), f.t3Low);
		const t3OpenRegression = new SimpleLinearRegression(f.t3Open.map((d, i) => i), f.t3Open);
		const t4CloseRegression = new SimpleLinearRegression(f.t4Close.map((d, i) => i), f.t4Close);
		const t4HighRegression = new SimpleLinearRegression(f.t4High.map((d, i) => i), f.t4High);
		const t4LowRegression = new SimpleLinearRegression(f.t4Low.map((d, i) => i), f.t4Low);
		const t4OpenRegression = new SimpleLinearRegression(f.t4Open.map((d, i) => i), f.t4Open);

		return {
			label: f.label,
			t1Close: t1CloseRegression.slope,
			t1High: t1HighRegression.slope,
			t1Low: t1LowRegression.slope,
			t1Open: t1OpenRegression.slope,
			t2Close: t2CloseRegression.slope,
			t2High: t2HighRegression.slope,
			t2Low: t2LowRegression.slope,
			t2Open: t2OpenRegression.slope,
			t3Close: t3CloseRegression.slope,
			t3High: t3HighRegression.slope,
			t3Low: t3LowRegression.slope,
			t3Open: t3OpenRegression.slope,
			t4Close: t4CloseRegression.slope,
			t4High: t4HighRegression.slope,
			t4Low: t4LowRegression.slope,
			t4Open: t4OpenRegression.slope,
		};
	});

	return regressionFeatures;
}
