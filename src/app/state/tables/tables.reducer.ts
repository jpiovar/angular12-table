import { TablesState } from './tables.models';
import * as TablesActions from './tables.actions';

export const initialState: TablesState = {
  tableExtended: 'init',
  tableExtendedCurrentUrl: ''
};

export function reducer(state = initialState, action: TablesActions.Actions): TablesState {
  switch (action.type) {
    case TablesActions.TABLES_STATUS: {
      // debugger;
      const newStateStatus = action.payload;
      return {
        ...state,
        ...newStateStatus
      };
    }

    default:
      return state;
  }
}
