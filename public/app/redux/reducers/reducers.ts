import { combineReducers } from 'redux';

import {
	IReceivePosts,
	IRequestPosts,
	ISelectName,
} from '../actions/actionCreators';
import {
	ActionType,
} from '../actions/actionTypes';

export interface IQuote {
	name: string;
	text: string;
}

interface INameState {
	isFetching: boolean;
	items: IQuote[];
}

interface IQuotes {
	[name: string]: INameState;
}

interface IState {
	quotes: IQuotes;
	selectedName: string;
}

type Actions = IReceivePosts & IRequestPosts & ISelectName;

function selectedName(state: string, action: ISelectName): string {
	switch (action.type) {
		case ActionType.SELECT_NAME:
			return action.selectedName;
		default:
			return state;
	}
}

function quotes(state: IQuotes, action: Actions): IQuotes {
	switch (action.type) {
		case ActionType.RECEIVE_POSTS:
			return Object.assign(
				{},
				state,
				{
					[action.name]: Object.assign<{}, INameState, Partial<INameState>>({}, state[action.name], {
						isFetching: false,
						items: action.quotes,
					}),
				}
			);
		case ActionType.REQUEST_POSTS:
			return Object.assign(
				{},
				state,
				{
					[action.name]: Object.assign({}, state[action.name], {
						isFetching: true,
					}),
				}
			);
		default:
			return state;
	}
}

const rootReducer = combineReducers({
	quotes,
	selectedName,
});
