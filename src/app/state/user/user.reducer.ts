import { UserState } from './user.models';
import * as UserActions from './user.actions';

export const initialState: UserState | any = null;

export function reducer(state = initialState, action: UserActions.Actions): UserState {
  switch (action.type) {
    case UserActions.USER_STORE_DATA: {
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
