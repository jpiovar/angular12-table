import { Action } from '@ngrx/store';
import { RecordsState } from './records.models';

export const RECORDS_LOAD = '[Records] Load data';
export const RECORDS_LOAD_SUCCESS = '[Records] Load data success';
export const RECORDS_LOAD_FAIL = '[Records] Load data fail';

export const RECORDS_SAVE = '[Records] Save data';
export const RECORDS_SAVE_SUCCESS = '[Records] Save data success';
export const RECORDS_SAVE_FAIL = '[Records] Save data fail';

export const META_LOAD = '[Meta] Load meta';
export const META_LOAD_SUCCESS = '[Meta] Load meta success';
export const META_LOAD_FAIL = '[Meta] Load meta fail';

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

export class RecordsSave implements Action {
  readonly type = RECORDS_SAVE;
  constructor(public payload: { endPoint: string, records: any }) {
    debugger;
  }
}

export class RecordsSaveSuccess implements Action {
  readonly type = RECORDS_SAVE_SUCCESS;
  constructor(public payload: RecordsState) {
    debugger;
  }
}

export class RecordsSaveFail implements Action {
  readonly type = RECORDS_SAVE_FAIL;
  constructor(public payload: any) {
    debugger;
  }
}

export class MetaLoad implements Action {
  readonly type = META_LOAD;
  constructor(public payload: any) {
    // debugger;
  }
}

export class MetaLoadSuccess implements Action {
  readonly type = META_LOAD_SUCCESS;
  constructor(public payload: any) {
    // debugger;
  }
}

export class MetaLoadFail implements Action {
  readonly type = META_LOAD_FAIL;
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
                      RecordsSave | RecordsSaveSuccess | RecordsSaveFail |
                      MetaLoad | MetaLoadSuccess | MetaLoadFail |
                      RecordSave | RecordSaveSuccess | RecordSaveFail;
