import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Params } from '@angular/router';
import { AppState } from 'src/app/state';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class HttpBaseService {

  private httpOptions: any;
  private headers = new HttpHeaders();

  spaloggerEndPoint: string;

  issueParams: any = null;

  accessToken: string = '';

  idToken: string = '';

  constructor(private httpClient: HttpClient, private store: Store<AppState>) {

    this.headers = this.headers.set('Content-Type', 'application/json');
    this.headers = this.headers.set('Accept', 'application/json');

    this.httpOptions = {
      headers: this.headers,
      withCredentials: false
    };

    this.store.select('user').subscribe((res: any) => {
      // debugger;
      if (res?.accessToken) {
        this.accessToken = res.accessToken;
        this.idToken = res.idToken;
        this.headers = this.headers.set('Authorization', `Bearer ${res.idToken}`);
        this.httpOptions = {
          headers: this.headers,
          withCredentials: false
        };
      }
    });

  }


  getCommon(url: string, params?: Params, issueParams?: any, httpOptions?: any): Observable<any> {
    let localHttpOptions = {...this.httpOptions};
    if (httpOptions) {
      localHttpOptions = httpOptions;
    }
    // debugger;
    localHttpOptions.params = params; // in case params did not set, then undefined
    this.issueParams = issueParams || null;
    this.spaloggerEndPoint = this.issueParams && this.issueParams.links && this.issueParams.links[0].href;
    return this.httpClient.get<any>(url, localHttpOptions)
      .pipe(
        catchError(
          err => {
            this.errorHandler.bind(this);
            throw err;
          }
        )
      );
  }

  postCommon(url: string, body: any | null, issueParams?: any, httpOptions?: any) {
    let localHttpOptions = {...this.httpOptions};
    if (httpOptions) {
      localHttpOptions = httpOptions;
    }
    this.issueParams = issueParams || null;
    this.spaloggerEndPoint = this.issueParams && this.issueParams.links && this.issueParams.links[0].href;
    return this.httpClient.post<any>(url, body, localHttpOptions)
      .pipe(
        catchError(
          err => {
            this.errorHandler.bind(this);
            throw err;
          }
        )
      );
  }

  putCommon(url: string, data: any | null, issueParams?: any, httpOptions?: any) {
    let localHttpOptions = {...this.httpOptions};
    if (httpOptions) {
      localHttpOptions = httpOptions;
    }
    this.issueParams = issueParams || null;
    this.spaloggerEndPoint = this.issueParams && this.issueParams.links && this.issueParams.links[0].href;
    return this.httpClient.put<any>(url, data, localHttpOptions)
      .pipe(
        // retry(3),
        catchError(
          err => {
            this.errorHandler.bind(this);
            throw err;
          }
        )
      );
  }

  deleteCommon(url: string, issueParams?: any, httpOptions?: any) {
    let localHttpOptions = {...this.httpOptions};
    if (httpOptions) {
      localHttpOptions = httpOptions;
    }
    this.issueParams = issueParams || null;
    this.spaloggerEndPoint = this.issueParams && this.issueParams.links && this.issueParams.links[0].href;
    return this.httpClient.delete<any>(url, localHttpOptions)
      .pipe(
        // retry(3),
        catchError(
          err => {
            this.errorHandler.bind(this);
            throw err;
          }
        )
      );
  }


  // Error handling
  errorHandler(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    this.errorHandlerSend(this.spaloggerEndPoint, 'ERROR', errorMessage, error);
    return throwError(error);
  }

  errorHandlerSend(endPoint: string, sev: string, msg: string, err: any) {

    const paramObj = {};

    for (let i = 0; i < this.issueParams.data.length; i++) {
      paramObj[this.issueParams.data[i].name] = this.issueParams.data[i].value;
      if (this.issueParams.data[i].name.indexOf('severity') > -1 && this.issueParams.data[i].value === '') {
        paramObj[this.issueParams.data[i].name] = sev;
      }
      else if (this.issueParams.data[i].name.indexOf('message') > -1 && this.issueParams.data[i].value === '') {
        paramObj[this.issueParams.data[i].name] = msg;
      }
      else if (this.issueParams.data[i].name.indexOf('details') > -1 && this.issueParams.data[i].value === '') {
        paramObj[this.issueParams.data[i].name] = err;
      }
    }

    if (this.issueParams.method.toLowerCase() === 'post') {
      this.httpClient.post(endPoint, paramObj).subscribe(
        (res: any) => {
          console.log(`${endPoint} :: HTTP response, ${res}`);
        },
        (error: any) => {
          console.log(`${endPoint} :: HTTP Error, ${error}`);
        },
        () => {
          console.log(`${endPoint} :: HTTP request completed`);
        }
      );
    }
    else if (this.issueParams.method.toLowerCase() === 'get') {
      console.log('method get');
    }

  }

}
