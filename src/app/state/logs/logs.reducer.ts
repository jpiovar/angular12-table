import { LogsState } from './logs.models';
import * as LogsActions from './logs.actions';
import { getIndexBasedId } from 'src/app/shared/utils/helper';

export const initialState: LogsState = {
  data: null,
  loading: false,
  error: null
};

export function reducer(state = initialState, action: LogsActions.Actions): LogsState {
  switch (action.type) {
    case LogsActions.LOGS_LOAD: {
      debugger;
      return {
        ...state,
        loading: true,
        error: false
      };
    }

    case LogsActions.LOGS_LOAD_SUCCESS: {
      debugger;
      let newStateData = JSON.parse(JSON.stringify(state.data));
      if (newStateData === null) {
        newStateData = {};
      }
      newStateData[action.payload.recordId] = action.payload.logs;
      return {
        ...state,
        loading: false,
        data: newStateData,
        error: null
      };
    }

    case LogsActions.LOGS_LOAD_FAIL: {
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    }

    case LogsActions.LOGS_SAVE: {
      // debugger;
      return {
        ...state,
        loading: true,
        error: false
      };
    }

    case LogsActions.LOGS_SAVE_SUCCESS: {
      debugger;
      const newState = JSON.parse(JSON.stringify(action.payload));
      return {
        ...state,
        loading: false,
        data: newState,
        error: null
      };
    }

    case LogsActions.LOGS_SAVE_FAIL: {
      // debugger;
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
