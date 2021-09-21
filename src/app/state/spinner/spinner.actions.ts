import { Action } from '@ngrx/store';
import { SpinnerState } from './spinner.models';

export const SPINNER_START = '[Spinner] Start Sprinner';
export const SPINNER_STOP = '[Spinner] Stop Spinner';

export class StartSpinner implements Action {
  readonly type = SPINNER_START;
  constructor(public payload: SpinnerState = { isOn: true }) {}
}

export class StopSpinner implements Action {
  readonly type = SPINNER_STOP;
  constructor(public payload: SpinnerState = { isOn: false }) {}
}

export type Actions = StopSpinner | StartSpinner;
