import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import { ActionType } from './action-types';
import reducers from './reducers';

// {} empty object for intial state
export const store = createStore(reducers, {}, applyMiddleware(thunk));

store.dispatch({
  type: ActionType.INSERT_CELL_BEFORE,
  payload: {
    id: null,
    type: 'code',
  },
});

store.dispatch({
  type: ActionType.INSERT_CELL_BEFORE,
  payload: {
    id: null,
    type: 'text',
  },
});

console.log(store.getState());
