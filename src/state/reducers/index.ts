import { combineReducers } from 'redux';
import cellsReducer from './cellsReducer';

const reducers = combineReducers({
  cells: cellsReducer,
});

export default reducers;

//apply types to react redux
export type RootState = ReturnType<typeof reducers>;
