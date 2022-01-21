import { ExportState } from './export.models';
import * as ExportActions from './export.actions';

export const initialState: ExportState = {
  status: 'inactive'
};

export function reducer(state = initialState, action: ExportActions.Actions): ExportState {
  switch (action.type) {
    case ExportActions.EXPORT_STATUS: {
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
