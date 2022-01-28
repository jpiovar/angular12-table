import { Injectable } from '@angular/core';
import { Actions, createEffect, Effect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError, flatMap, mergeMap, delay, withLatestFrom } from 'rxjs/operators';
import { forkJoin, Observable, Observer, of, throwError, zip, from } from 'rxjs';

import { LogsLoad, LogsLoadFail, LogsLoadSuccess, LogsSave, LogsSaveFail, LogsSaveSuccess, LOGS_LOAD, LOGS_SAVE } from './logs.actions';

import { LogsState } from './logs.models';
import { HttpBaseService } from '../../core/services/http.base.service';
import { environment } from '../../../environments/environment';
import { ajax } from 'rxjs/ajax';
import { Store } from '@ngrx/store';
import { AppState } from '..';
import { StartToastr } from '../toastr/toastr.actions';
import { getIndexBasedId, getItemBasedId } from 'src/app/shared/utils/helper';

@Injectable()
export class LogsEffects {

  constructor(
    private actions$: Actions<any>,
    private httpBase: HttpBaseService,
    private store: Store<AppState>
  ) {
    this.origin = environment.beOrigin;
  }
  origin: string;


  logsLoad$ = createEffect(() => this.actions$.pipe(
    ofType(LOGS_LOAD),
    switchMap(
      (action: LogsLoad) => {
        debugger;
        const urlLogs: any = action.payload.url;
        const recordId = action.payload.recordId;
        const item = null;
        return this.httpBase.getCommon(`${urlLogs}`).pipe(
          map((res: any) => {
            debugger;
            return new LogsLoadSuccess({ recordId, logs: res });
          }),
          catchError(error => {
            // debugger;
            return of(new LogsLoadFail(error));
          })
        );
      }
    )
  )
  );



  // logsSave$ = createEffect(() => this.actions$.pipe(
  //   ofType(LOGS_SAVE),
  //   mergeMap(
  //     (action: LogsSave) => {
  //       debugger;
  //       const endPoint: any = action?.payload?.endPoint;
  //       const originalRecords: any = action?.payload?.originalRecords;
  //       const records: any = action?.payload?.records;
  //       const modifiedIds: any = action?.payload?.modifiedIds;

  //       const arrObs = [];
  //       // for (const key in logs) {
  //       const httpBody = {
  //         // id: "id2",
  //         recordId: 'id2',
  //         userId: 'id1',
  //         name: 'jozko',
  //         dateTime: '2011-10-16'
  //       };
  //       // arrObs.push(this.httpBase.postCommon(`${endPoint}`, httpBody));
  //       // }

  //       // return {
  //       //   endPoint, logs, arrObs
  //       // };


  //       return this.httpBase.postCommon(`${endPoint}`, httpBody).pipe(
  //         map(
  //           (response: any) => {
  //             debugger;
  //             return new LogsSaveSuccess(response);
  //           }
  //         ),
  //         catchError(error => {
  //           debugger;
  //           return of(new LogsSaveFail(error));
  //         })
  //       );


  //     }
  //   )
  //   // mergeMap(
  //   //   (res: any) => {
  //   //     return new Observable((observer: Observer<any>) => {
  //   //       zip(...res.arrObs).subscribe(
  //   //         (subres: any) => {
  //   //           debugger;
  //   //           return observer.next({
  //   //             arrObsRes: subres,
  //   //             endPoint: res.endPoint,
  //   //             records: res.records,
  //   //             modified: res.modified
  //   //           });
  //   //         },
  //   //         error => throwError(error),
  //   //         () => observer.complete()
  //   //       );
  //   //     })
  //   //   }
  //   // ),


  //   // map(
  //   //   res => {
  //   //     debugger;
  //   //     const logs = JSON.parse(JSON.stringify(res));

  //   //     // for (const key in res?.modified) {
  //   //     //   this.store.dispatch(new StartToastr({ text: `log ${key} updated`, type: 'success', duration: 5000 }));
  //   //     // }
  //   //     return new LogsSaveSuccess(res);
  //   //   }
  //   // ),
  //   // catchError(error => {
  //   //   debugger;
  //   //   return of(new LogsSaveFail(error));
  //   // })
  // )
  // );



  logsSave$ = createEffect(() => this.actions$.pipe(
    ofType(LOGS_SAVE),
    map(
      (action: LogsSave) => {
        debugger;
        const endPoint: any = action?.payload?.endPoint;
        const records: any = action?.payload?.records;
        const previousStateRecords: any = action?.payload?.previousStateRecords;

        const arrObs = [];
        for (let i = 0; i < previousStateRecords.length; i++) {

          const httpBody = JSON.parse(JSON.stringify(previousStateRecords[i]));
          httpBody['recordIdExtended'] = httpBody['id'];
          delete httpBody['id'];
          arrObs.push(this.httpBase.postCommon(`${endPoint}`, httpBody));
        }

        return {
          endPoint, previousStateRecords, records, arrObs
        };
      }
    ),
    mergeMap(
      (res: any) => {
        return new Observable((observer: Observer<any>) => {
          zip(...res.arrObs).subscribe(
            (subres: any) => {
              debugger;
              return observer.next({
                arrObsRes: subres,
                endPoint: res.endPoint,
                records: res.records,
                previousStateRecords: res.previousStateRecords
              });
            },
            error => throwError(error),
            () => observer.complete()
          );
        });
      }
    ),
    map(
      res => {
        debugger;
        const previousStateRecords = JSON.parse(JSON.stringify(res?.previousStateRecords));
        return new LogsSaveSuccess(previousStateRecords);
      }
    ),
    catchError(error => {
      debugger;
      return of(new LogsSaveFail(error));
    })
  )
  );



  randomProcessState(item: any): string {
    const index = Number(item?.fileNumber[item?.fileNumber.length - 1]) || 0;
    const resArr = ['', 'success', 'warning', 'error'];
    return resArr[index % 4];
  }

}
