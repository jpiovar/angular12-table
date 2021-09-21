import { Action } from '@ngrx/store';
import { ToastrState } from './toastr.models';

export const TOASTR_START = '[Toastr] Start Toastr';
export const TOASTR_STOP = '[Toastr] Stop Toastr';

export class StartToastr implements Action {
  readonly type = TOASTR_START;
  constructor(public payload: ToastrState = { duration: 0, title: 'some title', text: 'some text', type: 'info' }) {
    this.payload.isOn = true;
  }
}

export class StopToastr implements Action {
  readonly type = TOASTR_STOP;
  constructor(public payload: ToastrState = { isOn: false, duration: 0, title: '', text: '', type: '' }) {
    // debugger;
  }
}

export type Actions = StartToastr | StopToastr;
