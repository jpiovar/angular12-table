import { Action } from '@ngrx/store';

export const TABLES_STATUS = '[Tables] status set';

export class TablesStatus implements Action {
  readonly type = TABLES_STATUS;
  constructor(public payload: any) {
    debugger;
  }
}

export type Actions = TablesStatus;
