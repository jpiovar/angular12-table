import { Action } from '@ngrx/store';
import { RecordsBaseExtendedState } from './records-base-extended.models';

export const RECORDS_BASE_EXTENDED_LOAD = '[RecordsBaseExtended] Load data';
export const RECORDS_BASE_EXTENDED_LOAD_SUCCESS = '[RecordsBaseExtended] Load data success';
export const RECORDS_BASE_EXTENDED_LOAD_FAIL = '[RecordsBaseExtended] Load data fail';

export class RecordsBaseExtendedLoad implements Action {
  readonly type = RECORDS_BASE_EXTENDED_LOAD;
  constructor(public payload: string) {
    // debugger;
  }
}

export class RecordsBaseExtendedLoadSuccess implements Action {
  readonly type = RECORDS_BASE_EXTENDED_LOAD_SUCCESS;
  constructor(public payload: RecordsBaseExtendedState) {
    debugger;
  }
}

export class RecordsBaseExtendedLoadFail implements Action {
  readonly type = RECORDS_BASE_EXTENDED_LOAD_FAIL;
  constructor(public payload: any) {}
}

export type Actions = RecordsBaseExtendedLoad | RecordsBaseExtendedLoadSuccess | RecordsBaseExtendedLoadFail;
