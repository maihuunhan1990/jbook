import { ActionType } from '../action-types';
import { Action } from '../actions';
import { Cell } from '../cell';

interface CellsState {
  loading: boolean;
  error: string | null;
  order: string[];
  data: {
    [key: string]: Cell;
  };
}

const initialState: CellsState = {
  loading: false,
  error: null,
  order: [],
  data: {},
};

const reducer = (
  state: CellsState = initialState,
  action: Action
): CellsState => {
  switch (action.type) {
    case ActionType.UPDATE_CELL:
      const { id, content } = action.payload;
      return {
        //create new object that has all existing property of state
        ...state,
        //redefine the data property
        data: {
          //has all existing sate data property
          ...state.data,
          //overwrite whatever is at action.payload.id
          [id]: {
            ...state.data[id],
            content,
          },
        },
      };
    case ActionType.DELETE_CELL:
      return state;

    case ActionType.MOVE_CELL:
      return state;
    case ActionType.INSERT_CELL_BEFORE:
      return state;
    default:
      return state;
  }
};

export default reducer;
