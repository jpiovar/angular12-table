import { Injectable } from '@angular/core';
import { Actions, createEffect, Effect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError, flatMap, mergeMap, delay, withLatestFrom } from 'rxjs/operators';
import { forkJoin, Observable, Observer, of, throwError, zip, from } from 'rxjs';

import { RolesLoad, RolesLoadFail, RolesLoadSuccess, ROLES_LOAD } from './roles.actions';

import { RolesState } from './roles.models';
import { HttpBaseService } from '../../core/services/http.base.service';
import { environment } from '../../../environments/environment';
import { Store } from '@ngrx/store';
import { AppState } from '..';

@Injectable()
export class RolesEffects {

  constructor(
    private actions$: Actions<any>,
    private httpBase: HttpBaseService,
    private store: Store<AppState>
  ) {
    this.origin = environment.beOrigin;
  }
  origin: string;


  rolesLoad$ = createEffect(() => this.actions$.pipe(
    ofType(ROLES_LOAD),
    switchMap(
      (action: RolesLoad) => {
        debugger;
        const url: any = action.payload;
        const item = null;
        return this.httpBase.getCommon(`${url}`).pipe(
          map((res: any) => {
            // // debugger;
            return new RolesLoadSuccess(res);
          }),
          catchError(error => {
            // // // debugger;
            return of(new RolesLoadFail(error));
          })
        );
      }
    )
  )
  );


}
