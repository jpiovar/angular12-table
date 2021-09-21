import { ToastrState } from './toastr.models';
import * as ToastrActions from './toastr.actions';

export const initialState: ToastrState = {
  isOn: false,
  duration: 0,
  text: '',
  type: ''
};

export function reducer(state = initialState, action: ToastrActions.Actions): ToastrState {
  switch (action.type) {
    case ToastrActions.TOASTR_START: {
      const newState = action.payload;
      return {
        ...state, ...newState
      };
    }

    case ToastrActions.TOASTR_STOP: {
      const newState = action.payload;
      return {
        ...state, ...newState
      };
    }

    default:
      return state;
  }
}
