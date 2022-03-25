import { Injectable } from '@angular/core';
import { Actions, createEffect, Effect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError, flatMap, mergeMap, delay, withLatestFrom } from 'rxjs/operators';
import { forkJoin, Observable, Observer, of, throwError, zip, from } from 'rxjs';

import {
  RECORDS_BASE_LOAD,
  RecordsBaseLoad,
  RecordsBaseLoadSuccess,
  RecordsBaseLoadFail
} from './records-base.actions';

import { RecordsBaseState } from './records-base.models';
import { HttpBaseService } from '../../core/services/http.base.service';
import { environment } from '../../../environments/environment';
import { ajax } from 'rxjs/ajax';
import { Store } from '@ngrx/store';
import { AppState } from '..';
import { StartToastr } from '../toastr/toastr.actions';
import { getItemBasedId } from 'src/app/shared/utils/helper';
import { LogsSave } from '../logs/logs.actions';

@Injectable()
export class RecordsBaseEffects {
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
  recordsBaseLoad$ = createEffect(() => this.actions$.pipe(
    ofType(RECORDS_BASE_LOAD),
    switchMap(
      (action: RecordsBaseLoad) => {
        // debugger;
        const urlRecordsBase: any = action.payload;
        return this.httpBase.getCommon(`${urlRecordsBase}`).pipe(
          map((res: any) => {
            // debugger;
            let resExt = res;
            if (!res?.data && !res?.totalRecords) {
              resExt = {
                data: res,
                totalRecords: 360
              };
            }
            return new RecordsBaseLoadSuccess(resExt);
          }),
          catchError(error => {
            // debugger;
            return of(new RecordsBaseLoadFail(error));
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
