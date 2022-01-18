import { TablesState } from './tables.models';
import * as TablesActions from './tables.actions';

export const initialState: TablesState = {
  tableExtended: 'init'
};

export function reducer(state = initialState, action: TablesActions.Actions): TablesState {
  switch (action.type) {
    case TablesActions.TABLES_STATUS: {
      debugger;
      const newState = action.payload;
      return {
        ...state, ...newState
      };
    }

    default:
      return state;
  }
}
