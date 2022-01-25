import { Injectable } from '@angular/core';
import { Actions, createEffect, Effect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError, flatMap, mergeMap, delay, withLatestFrom } from 'rxjs/operators';
import { forkJoin, Observable, Observer, of, throwError, zip, from } from 'rxjs';

import {
  RECORDS_BASE_EXTENDED_LOAD,
  RecordsBaseExtendedLoad,
  RecordsBaseExtendedLoadSuccess,
  RecordsBaseExtendedLoadFail
} from './records-base-extended.actions';

import { RecordsBaseExtendedState } from './records-base-extended.models';
import { HttpBaseService } from '../../core/services/http.base.service';
import { environment } from '../../../environments/environment';
import { ajax } from 'rxjs/ajax';
import { Store } from '@ngrx/store';
import { AppState } from '..';
import { StartToastr } from '../toastr/toastr.actions';
import { getItemBasedId } from 'src/app/shared/utils/helper';
import { LogsSave } from '../logs/logs.actions';

@Injectable()
export class RecordsBaseExtendedEffects {
  origin: string;
  tableLogs: string;
  tableDataBaseEndPoint: string;


  constructor(
    private actions$: Actions<any>,
    private httpBase: HttpBaseService,
    private store: Store<AppState>
  ) {
    this.origin = environment.beOrigin;
    this.tableLogs = environment.beTableChangeLogs;
    this.tableDataBaseEndPoint = environment.beTableDataBaseEndPoint;
  }


  // @Effect()
  // recordsLoad$ = this.actions$.pipe(
  recordsBaseExtendedLoad$ = createEffect(() => this.actions$.pipe(
    ofType(RECORDS_BASE_EXTENDED_LOAD),
    switchMap(
      (action: RecordsBaseExtendedLoad) => {
        debugger;
        const urlRecordsBaseExtended: any = action.payload;
        return this.httpBase.getCommon(`${urlRecordsBaseExtended}`).pipe(
          map((res: any) => {
            // debugger;
            let resExt = res;
            if (!res?.data && !res?.totalRecords) {
              resExt = {
                data: res,
                totalRecords: 12
              };
            }
            return new RecordsBaseExtendedLoadSuccess(resExt);
          }),
          catchError(error => {
            // debugger;
            return of(new RecordsBaseExtendedLoadFail(error));
          })
        );
      }
    )
  )
  );


  randomProcessState(item: any): string {
    const index = Number(item?.fileNumber[item?.fileNumber.length - 1]) || 0;
    const resArr = ['', 'success', 'warning', 'error'];
    return resArr[index % 4];
  }

}
