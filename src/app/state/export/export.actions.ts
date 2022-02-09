import { Action } from '@ngrx/store';

export const EXPORT_STATUS = '[Export] status set';

export class ExportStatus implements Action {
  readonly type = EXPORT_STATUS;
  constructor(public payload: any) {
    // debugger;
  }
}

export type Actions = ExportStatus;
