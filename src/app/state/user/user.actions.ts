import { Action } from '@ngrx/store';
import { UserState } from './user.models';

export const USER_STORE_DATA = '[User] Store data';

export class UserStoreData implements Action {
  readonly type = USER_STORE_DATA;
  constructor(public payload: UserState) {
    // debugger;
  }
}

export type Actions = UserStoreData;
