import {
	createStore,
} from 'redux';

import todoApp from '../reducers/reducers';

const store = createStore(todoApp);

export default store;
