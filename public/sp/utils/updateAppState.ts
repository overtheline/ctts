import * as _ from 'lodash';
import {
	IAppControlSettings,
	IAppState,
	ICorrelationTableSettings,
	IMetadata,
	IModuleSettings,
	ITwoStockCompareSettings,
} from '../app';
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

export function computeAppStateWithTimeRange(appState: IAppState, selectedTimeRangeOption: string): IAppState {
	const appControlSettings = getNextSubstate<IAppControlSettings>(
		appState.appControlSettings,
		{ selectedTimeRangeOption }
	);

	return getNextAppState(appState, { appControlSettings });
}

export async function computeAppStateWithCompareSettings(
	appState: IAppState,
	selectedStockNames: string[]
): Promise<IAppState> {
	const stockData = await fetchStockData(selectedStockNames);

	const twoStockCompareSettings = getNextSubstate<ITwoStockCompareSettings>(
		appState.moduleSettings.twoStockCompareSettings,
		{ selectedStockNames, stockData }
	);
	const moduleSettings = getNextSubstate<IModuleSettings>(appState.moduleSettings, { twoStockCompareSettings });

	return getNextAppState(appState, { moduleSettings });
}

export function computeAppStateWithCorrelationNames(appState: IAppState, selectedStockNames: string[]): IAppState {
	const correlationTableSettings = getNextSubstate<ICorrelationTableSettings>(
		appState.moduleSettings.correlationTableSettings,
		{ selectedStockNames }
	);
	const moduleSettings = getNextSubstate<IModuleSettings>(appState.moduleSettings, { correlationTableSettings });

	return getNextAppState(appState, { moduleSettings });
}
