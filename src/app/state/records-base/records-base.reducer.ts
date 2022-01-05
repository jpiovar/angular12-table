import { RecordsBaseState } from './records-base.models';
import * as RecordsBaseActions from './records-base.actions';
import { getIndexBasedId } from 'src/app/shared/utils/helper';

export const initialState: RecordsBaseState = {
  data: null,
  totalRecords: -1,
  loading: false,
  error: null
};

export function reducer(state = initialState, action: RecordsBaseActions.Actions): RecordsBaseState {
  switch (action.type) {
    case RecordsBaseActions.RECORDS_BASE_LOAD: {
      return {
        ...state,
        loading: true,
        error: false
      };
    }

    case RecordsBaseActions.RECORDS_BASE_LOAD_SUCCESS: {
      return {
        ...state,
        loading: false,
        data: action.payload.data,
        totalRecords: action.payload.totalRecords,
        error: null
      };
    }

    case RecordsBaseActions.RECORDS_BASE_LOAD_FAIL: {
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
