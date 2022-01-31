import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import reducers from './reducers';

// {} empty object for intial state
export const store = createStore(reducers, {}, applyMiddleware(thunk));
