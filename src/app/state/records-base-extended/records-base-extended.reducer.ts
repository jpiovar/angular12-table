import { RecordsBaseExtendedState } from './records-base-extended.models';
import * as RecordsBaseExtendedActions from './records-base-extended.actions';
import { getIndexBasedId } from 'src/app/shared/utils/helper';

export const initialState: RecordsBaseExtendedState = {
  data: null,
  totalRecords: -1,
  loading: false,
  error: null
};

export function reducer(state = initialState, action: RecordsBaseExtendedActions.Actions): RecordsBaseExtendedState {
  switch (action.type) {
    case RecordsBaseExtendedActions.RECORDS_BASE_EXTENDED_LOAD: {
      return {
        ...state,
        loading: true,
        error: false
      };
    }

    case RecordsBaseExtendedActions.RECORDS_BASE_EXTENDED_LOAD_SUCCESS: {
      // debugger;
      return {
        ...state,
        loading: false,
        data: action.payload.data,
        totalRecords: action.payload.totalRecords,
        error: null
      };
    }

    case RecordsBaseExtendedActions.RECORDS_BASE_EXTENDED_LOAD_FAIL: {
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    }

    default:
      return state;
  }
}
