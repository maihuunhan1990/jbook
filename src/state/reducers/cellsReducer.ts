import produce from 'immer';
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

//produce is from immer
const reducer = produce(
  (state: CellsState = initialState, action: Action): CellsState => {
    switch (action.type) {
      case ActionType.UPDATE_CELL:
        const { id, content } = action.payload;
        //immer will return the state object for us
        //so no need for us to return like the code snip below
        //only returning because of typescript
        state.data[id].content = content;
        return state;
      //would need to do this if we didn't use immer
      // return {
      //   //create new object that has all existing property of state
      //   ...state,
      //   //redefine the data property
      //   data: {
      //     //has all existing sate data property
      //     ...state.data,
      //     //overwrite whatever is at action.payload.id
      //     [id]: {
      //       ...state.data[id],
      //       content,
      //     },
      //   },
      // };
      case ActionType.DELETE_CELL:
        delete state.data[action.payload];
        state.order = state.order.filter((id) => id !== action.payload);
        return state;

      case ActionType.MOVE_CELL:
        const { direction } = action.payload;
        const index = state.order.findIndex((id) => id === action.payload.id);
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex > state.order.length - 1) {
          return state;
        }
        state.order[index] = state.order[targetIndex];
        state.order[targetIndex] = action.payload.id;
        return state;
      case ActionType.INSERT_CELL_BEFORE:
        const cell: Cell = {
          content: '',
          type: action.payload.type,
          id: randomId(),
        };

        state.data[cell.id] = cell;
        const foundIndex = state.order.findIndex(
          (id) => id === action.payload.id
        );
        if (foundIndex < 0) {
          //push the cell to the push because no id was specified
          state.order.push(cell.id);
        } else {
          //doc on npmjs immer doc
          state.order.splice(foundIndex, 0, cell.id);
        }

        return state;
      default:
        return state;
    }
  }
);

const randomId = () => {
  //using base 36, string will use strings and number
  return Math.random().toString(36).substring(2, 5);
};
export default reducer;
