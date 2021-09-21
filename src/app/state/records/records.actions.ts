import { Action } from '@ngrx/store';
import { RecordsState } from './records.models';

export const RECORDS_LOAD = '[Records] Load data';
export const RECORDS_LOAD_SUCCESS = '[Records] Load data success';
export const RECORDS_LOAD_FAIL = '[Records] Load data fail';
export const RECORD_LOAD_DETAIL = '[Records] Load data detail';
export const RECORD_LOAD_DETAIL_SUCCESS = '[Records] Load data detail success';
export const RECORD_LOAD_DETAIL_FAIL = '[Records] Load data detail fail';
export const RECORD_SAVE = '[Records] Save record';
export const RECORD_SAVE_SUCCESS = '[Records] Save record success';
export const RECORD_SAVE_FAIL = '[Records] Save record fail';

export class RecordsLoad implements Action {
  readonly type = RECORDS_LOAD;
  constructor(public payload: string) {
    // debugger;
  }
}

export class RecordsLoadSuccess implements Action {
  readonly type = RECORDS_LOAD_SUCCESS;
  constructor(public payload: RecordsState) {}
}

export class RecordsLoadFail implements Action {
  readonly type = RECORDS_LOAD_FAIL;
  constructor(public payload: any) {}
}

export class RecordLoadDetail implements Action {
  readonly type = RECORD_LOAD_DETAIL;
  constructor(public payload: { id: string, detail: any, storeMode?: boolean}) {
    // debugger;
  }
}

export class RecordLoadDetailSuccess implements Action {
  readonly type = RECORD_LOAD_DETAIL_SUCCESS;
  constructor(public payload: { id: string, detail: any }) {
    // debugger;
  }
}

export class RecordLoadDetailFail implements Action {
  readonly type = RECORD_LOAD_DETAIL_FAIL;
  constructor(public payload: any) {
    // debugger;
  }
}

export class RecordSave implements Action {
  readonly type = RECORD_SAVE;
  constructor(public payload: { endPoint: string, record: any, actionType?: string }) {
    // debugger;
  }
}

export class RecordSaveSuccess implements Action {
  readonly type = RECORD_SAVE_SUCCESS;
  constructor(public payload: { recordRow: any, actionType?: string }) {
    // debugger;
  }
}

export class RecordSaveFail implements Action {
  readonly type = RECORD_SAVE_FAIL;
  constructor(public payload: any) {
    // debugger;
  }
}

export type Actions = RecordsLoad | RecordsLoadSuccess | RecordsLoadFail |
                      RecordLoadDetail | RecordLoadDetailSuccess | RecordLoadDetailFail |
                      RecordSave | RecordSaveSuccess | RecordSaveFail;
