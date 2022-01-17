import { Action } from '@ngrx/store';
import { RecordsState } from './records.models';

export const RECORDS_LOAD = '[Records] Load data';
export const RECORDS_LOAD_SUCCESS = '[Records] Load data success';
export const RECORDS_LOAD_FAIL = '[Records] Load data fail';

export const RECORDS_SAVE = '[Records] Save data';
export const RECORDS_SAVE_SUCCESS = '[Records] Save data success';
export const RECORDS_SAVE_FAIL = '[Records] Save data fail';

export const RECORDS_DELETE = '[Records] Delete data';
export const RECORDS_DELETE_SUCCESS = '[Records] Delete data success';
export const RECORDS_DELETE_FAIL = '[Records] Delete data fail';

export const RECORDS_ADD_NEW = '[Records] Add new data';
export const RECORDS_ADD_NEW_SUCCESS = '[Records] Add new data success';
export const RECORDS_ADD_NEW_FAIL = '[Records] Add new data fail';

// export const META_LOAD = '[Meta] Load meta';
// export const META_LOAD_SUCCESS = '[Meta] Load meta success';
// export const META_LOAD_FAIL = '[Meta] Load meta fail';

// export const META_LOCAL_SAVE = '[Meta] Local meta save';


// export const RECORD_SAVE = '[Records] Save record';
// export const RECORD_SAVE_SUCCESS = '[Records] Save record success';
// export const RECORD_SAVE_FAIL = '[Records] Save record fail';

export class RecordsLoad implements Action {
  readonly type = RECORDS_LOAD;
  constructor(public payload: string) {
    // debugger;
  }
}

export class RecordsLoadSuccess implements Action {
  readonly type = RECORDS_LOAD_SUCCESS;
  constructor(public payload: RecordsState) {
    // // debugger;
  }
}

export class RecordsLoadFail implements Action {
  readonly type = RECORDS_LOAD_FAIL;
  constructor(public payload: any) {}
}

export class RecordsSave implements Action {
  readonly type = RECORDS_SAVE;
  constructor(public payload: { endPoint: string, records: any, modified: any, currentUrl: string }) {
    // debugger;
  }
}

export class RecordsSaveSuccess implements Action {
  readonly type = RECORDS_SAVE_SUCCESS;
  constructor(public payload: RecordsState) {
    // debugger;
  }
}

export class RecordsSaveFail implements Action {
  readonly type = RECORDS_SAVE_FAIL;
  constructor(public payload: any) {
    // debugger;
  }
}

export class RecordsDelete implements Action {
  readonly type = RECORDS_DELETE;
  constructor(public payload: { endPoint: string, records: any, deleted: any }) {
    // debugger;
  }
}

export class RecordsDeleteSuccess implements Action {
  readonly type = RECORDS_DELETE_SUCCESS;
  constructor(public payload: RecordsState) {
    // debugger;
  }
}

export class RecordsDeleteFail implements Action {
  readonly type = RECORDS_DELETE_FAIL;
  constructor(public payload: any) {
    // debugger;
  }
}

export class RecordsAddNew implements Action {
  readonly type = RECORDS_ADD_NEW;
  constructor(public payload: { endPoint: string, records: any}) {
    debugger;
  }
}

export class RecordsAddNewSuccess implements Action {
  readonly type = RECORDS_ADD_NEW_SUCCESS;
  constructor() {
    debugger;
  }
}

export class RecordsAddNewFail implements Action {
  readonly type = RECORDS_ADD_NEW_FAIL;
  constructor(public payload: any) {
    debugger;
  }
}

// export class ChangeLogLoad implements Action {
//   readonly type = CHANGE_LOG_LOAD;
//   constructor(public payload: { url: string; recordId: string }) {
//     debugger;
//   }
// }

// export class ChangeLogLoadSuccess implements Action {
//   readonly type = CHANGE_LOG_LOAD_SUCCESS;
//   constructor(public payload: any) {
//     debugger;
//   }
// }

// export class ChangeLogLoadFail implements Action {
//   readonly type = CHANGE_LOG_LOAD_FAIL;
//   constructor(public payload: any) {
//     debugger;
//   }
// }


// export class MetaLoad implements Action {
//   readonly type = META_LOAD;
//   constructor(public payload: any) {
//     // debugger;
//   }
// }

// export class MetaLoadSuccess implements Action {
//   readonly type = META_LOAD_SUCCESS;
//   constructor(public payload: any) {
//     // debugger;
//   }
// }

// export class MetaLoadFail implements Action {
//   readonly type = META_LOAD_FAIL;
//   constructor(public payload: any) {
//     // debugger;
//   }
// }

// export class MetaLocalSave implements Action {
//   readonly type = META_LOCAL_SAVE;
//   constructor(public payload: any) {
//     debugger;
//   }
// }

// export class RecordSave implements Action {
//   readonly type = RECORD_SAVE;
//   constructor(public payload: { endPoint: string, record: any, actionType?: string }) {
//     // debugger;
//   }
// }

// export class RecordSaveSuccess implements Action {
//   readonly type = RECORD_SAVE_SUCCESS;
//   constructor(public payload: { recordRow: any, actionType?: string }) {
//     // debugger;
//   }
// }

// export class RecordSaveFail implements Action {
//   readonly type = RECORD_SAVE_FAIL;
//   constructor(public payload: any) {
//     // debugger;
//   }
// }

export type Actions = RecordsLoad | RecordsLoadSuccess | RecordsLoadFail |
                      RecordsSave | RecordsSaveSuccess | RecordsSaveFail |
                      RecordsDelete | RecordsDeleteSuccess | RecordsDeleteFail |
                      RecordsAddNew | RecordsAddNewSuccess | RecordsAddNewFail;
                      // MetaLoad | MetaLoadSuccess | MetaLoadFail |
                      // MetaLocalSave|
                      // ChangeLogLoad | ChangeLogLoadSuccess | ChangeLogLoadFail |
                      // RecordSave | RecordSaveSuccess | RecordSaveFail;
