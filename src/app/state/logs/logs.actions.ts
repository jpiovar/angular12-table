import { Action } from '@ngrx/store';
import { LogsState } from './logs.models';

export const LOGS_LOAD = '[Logs] Load data';
export const LOGS_LOAD_SUCCESS = '[Logs] Load data success';
export const LOGS_LOAD_FAIL = '[Logs] Load data fail';

export const LOGS_SAVE = '[Logs] Save data';
export const LOGS_SAVE_SUCCESS = '[Logs] Save data success';
export const LOGS_SAVE_FAIL = '[Logs] Save data fail';


export class LogsLoad implements Action {
  readonly type = LOGS_LOAD;
  constructor(public payload: any) {
    // debugger;
  }
}

export class LogsLoadSuccess implements Action {
  readonly type = LOGS_LOAD_SUCCESS;
  constructor(public payload: any) {
    // debugger;
  }
}

export class LogsLoadFail implements Action {
  readonly type = LOGS_LOAD_FAIL;
  constructor(public payload: any) {}
}

export class LogsSave implements Action {
  readonly type = LOGS_SAVE;
  constructor(public payload: { endPoint: string, previousStateRecords: any }) {
    // debugger;
  }
}

export class LogsSaveSuccess implements Action {
  readonly type = LOGS_SAVE_SUCCESS;
  constructor(public payload: LogsState) {
    // debugger;
  }
}

export class LogsSaveFail implements Action {
  readonly type = LOGS_SAVE_FAIL;
  constructor(public payload: any) {
    // // debugger;
  }
}






export type Actions = LogsLoad | LogsLoadSuccess | LogsLoadFail |
                      LogsSave | LogsSaveSuccess | LogsSaveFail;
