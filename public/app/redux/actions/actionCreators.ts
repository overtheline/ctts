import {
	Dispatch,
} from 'redux';

import {
	IQuote,
} from '../reducers/reducers';
import {
	ActionType
} from './actionTypes';

export interface IAction {
	type: ActionType;
}

export interface ISelectName extends IAction {
	selectedName: string;
}

export function selectName(selectedName: string): ISelectName {
	return {
		selectedName,
		type: ActionType.SELECT_NAME,
	};
}

export interface IRequestPosts extends IAction {
	name: string;
}

export function requestPosts(name: string): IRequestPosts {
	return {
		name,
		type: ActionType.REQUEST_POSTS,
	};
}

export interface IReceivePosts extends IAction {
	name: string;
	quotes: IQuote[];
}

export function receivePosts(name: string, json: IQuote[]): IReceivePosts {
	return {
		name,
		quotes: json,
		type: ActionType.RECEIVE_POSTS,
	};
}

export function fetchPosts(name: string) {
	return (dispatch: Dispatch) => {
		dispatch(requestPosts(name));
		fetch(`/quotedata/getQuotes?name=${name}`)
			.then((response) => response.json())
			.then((json: IQuote[]) => dispatch(receivePosts(name, json)));
	};
}
