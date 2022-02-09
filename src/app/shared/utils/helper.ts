import { NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import moment from 'moment';
import * as _ from 'lodash';
import { CoreModule } from 'src/app/core/core.module';

export function isExplorer() {
  return window.navigator.userAgent.indexOf('MSIE ') > -1 || !!window.navigator.userAgent.match(/Trident.*rv\:11\./);
}

export function getItemBasedId(arr: Array<any>, id: string) {
  return arr.filter((item: any) => item.id === id)[0];
}

export function getIndexBasedId(arr: Array<any>, id: string) {
  // debugger;
  return arr.findIndex(item => item.id === id);
}

export function compareValues(key: any, order = 'asc') {
  return function innerSort(a: any, b: any) {
    if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
      return 0;
    }

    const varA = (typeof a[key] === 'string')
      ? a[key].toUpperCase() : a[key];
    const varB = (typeof b[key] === 'string')
      ? b[key].toUpperCase() : b[key];

    let comparison = 0;
    if (varA > varB) {
      comparison = 1;
    } else if (varA < varB) {
      comparison = -1;
    }
    return (
      (order === 'desc') ? (comparison * -1) : comparison
    );
  };
}

export function isoStringtoNgbDateStruct(val: string): NgbDateStruct {
  // const date = new Date(val);
  const ddate = moment(val, 'YYYY-MM-DD[T]HH:mm:ss');
  return {
    // day: date.getDay(), month: date.getMonth() + 1, year: date.getFullYear()
    day: ddate.date(), month: ddate.month() + 1, year: ddate.year()
  };
}

export function ngbDateStructToIsoString(val: NgbDateStruct): string {
  // return new Date(val.year, val.month-1, val.day).toISOString();
  return moment([val.year, val.month - 1, val.day]).format('YYYY-MM-DD[T]HH:mm:ss');
}

export function differentValueProperties(obj1: any, obj2: any): any[] {
  debugger;
  const res = [];
  for (const [key, value] of Object.entries(obj1)) {
    const obj1Val = value;
    const obj2Val = obj2[key];
    if (!_.isEqual(obj1Val, obj2Val)) {
      res.push({
        propName: key,
        newValue: obj2Val
      });
    }
  }
  return res;
}

export function isLocalHost() {
  if (['localhost', '127.0.0.1', ''].includes(window.location.hostname)) {
    return true;
  }
  return false;
}
