import { Action } from '@ngrx/store';
import { RolesState } from './roles.models';

export const ROLES_LOAD = '[Roles] Load data';
export const ROLES_LOAD_SUCCESS = '[Roles] Load data success';
export const ROLES_LOAD_FAIL = '[Roles] Load data fail';


export class RolesLoad implements Action {
  readonly type = ROLES_LOAD;
  constructor(public payload: any) {
    // debugger;
  }
}

export class RolesLoadSuccess implements Action {
  readonly type = ROLES_LOAD_SUCCESS;
  constructor(public payload: any) {
    // debugger;
  }
}

export class RolesLoadFail implements Action {
  readonly type = ROLES_LOAD_FAIL;
  constructor(public payload: any) {}
}

export type Actions = RolesLoad | RolesLoadSuccess | RolesLoadFail;
