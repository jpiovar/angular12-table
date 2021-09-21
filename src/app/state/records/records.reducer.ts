import { RecordsState } from './records.models';
import * as RecordsActions from './records.actions';
import { getIndexBasedId } from 'src/app/shared/utils/helper';

export const initialState: RecordsState = {
  data: null,
  pages: 0,
  loading: false,
  error: null
};

export function reducer(state = initialState, action: RecordsActions.Actions): RecordsState {
  switch (action.type) {
    case RecordsActions.RECORDS_LOAD: {
      return {
        ...state,
        loading: true,
        error: false
      };
    }

    case RecordsActions.RECORDS_LOAD_SUCCESS: {
      return {
        ...state,
        loading: false,
        data: action.payload,
        error: null
      };
    }

    case RecordsActions.RECORDS_LOAD_FAIL: {
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    }

    case RecordsActions.RECORD_LOAD_DETAIL: {
      return {
        ...state,
        loading: true,
        error: false
      };
    }

    case RecordsActions.RECORD_LOAD_DETAIL_SUCCESS: {
      // debugger;
      const rowId = action.payload.id;
      const detailData = action.payload.detail;
      const newState = JSON.parse(JSON.stringify(state?.data));
      const index = getIndexBasedId(newState, rowId);
      newState[index]['data'] = detailData;
      return {
        ...state,
        loading: false,
        error: null,
        data: newState
      };
    }

    case RecordsActions.RECORD_LOAD_DETAIL_FAIL: {
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    }

    case RecordsActions.RECORD_SAVE: {
      return {
        ...state,
        loading: true,
        error: false
      };
    }

    case RecordsActions.RECORD_SAVE_SUCCESS: {
      // debugger;
      const actionType = action.payload.actionType || 'new';
      const recordRow = action.payload.recordRow;
      const rowId = recordRow.id;
      const newState = JSON.parse(JSON.stringify(state?.data));
      const index = getIndexBasedId(newState, rowId);
      if (actionType === 'new') {
        newState.unshift(recordRow);
      } else if (actionType === 'update') {
        newState[index]['data'] = recordRow;
      }
      return {
        ...state,
        loading: false,
        error: null,
        data: newState
      };
    }

    case RecordsActions.RECORD_SAVE_FAIL: {
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
