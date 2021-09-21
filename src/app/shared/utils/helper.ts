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

