import { Action } from '@ngrx/store';
import { RecordsBaseState } from './records-base.models';

export const RECORDS_BASE_LOAD = '[RecordsBase] Load data';
export const RECORDS_BASE_LOAD_SUCCESS = '[RecordsBase] Load data success';
export const RECORDS_BASE_LOAD_FAIL = '[RecordsBase] Load data fail';

export class RecordsBaseLoad implements Action {
  readonly type = RECORDS_BASE_LOAD;
  constructor(public payload: string) {
    // debugger;
  }
}

export class RecordsBaseLoadSuccess implements Action {
  readonly type = RECORDS_BASE_LOAD_SUCCESS;
  constructor(public payload: RecordsBaseState) {
    // debugger;
  }
}

export class RecordsBaseLoadFail implements Action {
  readonly type = RECORDS_BASE_LOAD_FAIL;
  constructor(public payload: any) {}
}

export type Actions = RecordsBaseLoad | RecordsBaseLoadSuccess | RecordsBaseLoadFail;
