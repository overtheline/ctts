import * as _ from 'lodash';
import { IAppState, IMetadata, IStockDataStore } from '../app';
import {
	fetchStockColumnHeaders,
	fetchStockData,
	fetchStockNames,
} from '../fetch';

export function getNextSubstate<T>(substate: T, partialSubstate: Partial<T>): T {
	return _.assign<T, Partial<T>>(substate, partialSubstate);
}

export function getNextAppState(appState: IAppState, partialState: Partial<IAppState>): IAppState {
	return _.assign<IAppState, Partial<IAppState>>(appState, partialState);
}

export async function computeAppStateWithMetadata(appState: IAppState): Promise<IAppState> {
	const stockColumnHeaders = await fetchStockColumnHeaders();
	const stockNames = await fetchStockNames();
	const metadata = getNextSubstate<IMetadata>(appState.metadata, { stockColumnHeaders, stockNames });

	return getNextAppState(appState, { metadata });
}

export async function computeAppStateWithStockData(appState: IAppState): Promise<IAppState> {
	const {
		moduleSettings: {
			twoStockCompareSettings: {
				selectedStockNames,
			},
		},
	} = appState;

	const stockData = await fetchStockData(selectedStockNames);
	const stockDataStore = getNextSubstate<IStockDataStore>(appState.stockDataStore, stockData);

	return getNextAppState(appState, { stockDataStore });
}
