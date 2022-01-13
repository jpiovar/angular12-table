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
import { getItemBasedId } from 'src/app/shared/utils/helper';

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
        // debugger;
        const urlLogs: any = action.payload.url;
        const recordId = action.payload.recordId;
        const item = null;
        return this.httpBase.getCommon(`${urlLogs}`).pipe(
          map((res: any) => {
            // debugger;
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



  logsSave$ = createEffect(() => this.actions$.pipe(
    ofType(LOGS_SAVE),
    mergeMap(
      (action: LogsSave) => {
        // debugger;
        const endPoint: any = action?.payload?.endPoint;
        const logs: any = action?.payload?.logs;
        // const modified: any = action?.payload?.modified;

        const arrObs = [];
        // for (const key in logs) {
        const httpBody = {
          // id: "id2",
          recordId: 'id2',
          userId: 'id1',
          name: 'jozko',
          dateTime: '2011-10-16'
        };
        // arrObs.push(this.httpBase.postCommon(`${endPoint}`, httpBody));
        // }

        // return {
        //   endPoint, logs, arrObs
        // };


        return this.httpBase.postCommon(`${endPoint}`, httpBody).pipe(
          map(
            (response: any) => {
              return new LogsSaveSuccess(response);
            }
          ),
          catchError(error => {
            // debugger;
            return of(new LogsSaveFail(error));
          })
        );


      }
    )
    // mergeMap(
    //   (res: any) => {
    //     return new Observable((observer: Observer<any>) => {
    //       zip(...res.arrObs).subscribe(
    //         (subres: any) => {
    //           debugger;
    //           return observer.next({
    //             arrObsRes: subres,
    //             endPoint: res.endPoint,
    //             records: res.records,
    //             modified: res.modified
    //           });
    //         },
    //         error => throwError(error),
    //         () => observer.complete()
    //       );
    //     })
    //   }
    // ),


    // map(
    //   res => {
    //     debugger;
    //     const logs = JSON.parse(JSON.stringify(res));

    //     // for (const key in res?.modified) {
    //     //   this.store.dispatch(new StartToastr({ text: `log ${key} updated`, type: 'success', duration: 5000 }));
    //     // }
    //     return new LogsSaveSuccess(res);
    //   }
    // ),
    // catchError(error => {
    //   debugger;
    //   return of(new LogsSaveFail(error));
    // })
  )
  );





  // recordsSave$ = createEffect(() => this.actions$.pipe(
  //   ofType(RECORDS_SAVE),
  //   map(
  //     (action: RecordsSave) => {
  //       debugger;
  //       const endPoint: any = action?.payload?.endPoint;
  //       const records: any = action?.payload?.records;
  //       const modified: any = action?.payload?.modified;

  //       // const record1 = { id: 'id1', firstname: 'jopo1', lastname: 'popo1', age: 10 };
  //       // const record2 = { id: 'id2', firstname: 'jopo2', lastname: 'popo2', age: 10 };
  //       const arrObs = [];
  //       for (const key in modified) {
  //         arrObs.push(this.httpBase.putCommon(`${endPoint}/${key}`, modified[key]));
  //       }
  //       // [
  //       //   this.httpBase.putCommon(`${endPoint}/id1`, record1),
  //       //   this.httpBase.putCommon(`${endPoint}/id2`, record2)
  //       // ];

  //       return {
  //         endPoint, records, arrObs, modified
  //       };
  //     }
  //   ),
  //   mergeMap(
  //     (res: any) => {
  //       return new Observable((observer: Observer<any>) => {
  //         zip(...res.arrObs).subscribe(
  //           (subres: any) => {
  //             debugger;
  //             return observer.next({
  //               arrObsRes: subres,
  //               endPoint: res.endPoint,
  //               records: res.records,
  //               modified: res.modified
  //             });
  //           },
  //           error => throwError(error),
  //           () => observer.complete()
  //         );
  //       })
  //     }
  //   ),
  //   map(
  //     res => {
  //       debugger;
  //       const records = JSON.parse(JSON.stringify(res?.records));
  //       // const itemId = item?.id;
  //       for (const key in res?.modified) {
  //         this.store.dispatch(new StartToastr({ text: `record ${key} updated`, type: 'success', duration: 5000 }));
  //       }
  //       return new RecordsSaveSuccess(records);
  //     }
  //   ),
  //   catchError(error => {
  //     debugger;
  //     // console.log(`${res.endPoint}`, error);
  //     // const recordId = record.id;
  //     // this.store.dispatch(new StartToastr({ text: `record ${recordId} did not update`, type: 'error', duration: 5000 }));
  //     return of(new RecordsSaveFail(error));
  //   })
  // )
  // );


  randomProcessState(item: any): string {
    const index = Number(item?.fileNumber[item?.fileNumber.length - 1]) || 0;
    const resArr = ['', 'success', 'warning', 'error'];
    return resArr[index % 4];
  }

}
