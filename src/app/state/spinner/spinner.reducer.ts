import { SpinnerState } from './spinner.models';
import * as SpinnerActions from './spinner.actions';

export const initialState: SpinnerState = {
  isOn: false
};

export function reducer(state = initialState, action: SpinnerActions.Actions): SpinnerState {
  switch (action.type) {
    case SpinnerActions.SPINNER_START: {
      const newState = action.payload;
      return {
        ...state, ...newState
      };
    }

    case SpinnerActions.SPINNER_STOP: {
      const newState = action.payload;
      return {
        ...state, ...newState
      };
    }

    default:
      return state;
  }
}
