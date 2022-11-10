import { RolesState } from './roles.models';
import * as LogsActions from './roles.actions';
import { getIndexBasedId } from 'src/app/shared/utils/helper';

export const initialState: RolesState = {
  data: null,
  loading: false,
  error: null
};

export function reducer(state = initialState, action: LogsActions.Actions): RolesState {
  switch (action.type) {
    case LogsActions.ROLES_LOAD: {
      // // debugger;
      return {
        ...state,
        loading: true,
        error: false
      };
    }

    case LogsActions.ROLES_LOAD_SUCCESS: {
      debugger;
      return {
        ...state,
        loading: false,
        data: action.payload,
        error: null
      };
    }

    case LogsActions.ROLES_LOAD_FAIL: {
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
