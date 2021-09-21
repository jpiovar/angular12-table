// In a custom serializer ts file
import { Params, RouterStateSnapshot, Data, ActivatedRouteSnapshot } from '@angular/router';
import { RouterStateSerializer } from '@ngrx/router-store';
import { RouterReducerState } from '@ngrx/router-store';

export interface RouterStateUrl {
  url: string;
  params: Params;
  queryParams: Params;
}

export interface MergedRoute {
  fragment: string;
  url: string;
  queryParams: Params;
  params: Params;
  data: Data;
}

export type MergedRouteReducerState = RouterReducerState<MergedRoute>;

export class CustomSerializer implements RouterStateSerializer<RouterStateUrl> {
  serialize(routerState: RouterStateSnapshot): RouterStateUrl {
    let route = routerState.root;
    while (route.firstChild) {
      route = route.firstChild;
    }

    const {
      url,
      root: { queryParams },
    } = routerState;
    const { params } = route;

    // Only return an object including the URL, params and query params
    // instead of the entire snapshot
    return { url, params, queryParams };
  }
}

export class MergedRouterStateSerializer implements RouterStateSerializer<MergedRoute> {
  serialize(routerState: RouterStateSnapshot): MergedRoute {
    return {
      url: routerState.url,
      fragment: mergeRouteFragment(routerState.root),
      params: mergeRouteParams(routerState.root, r => r.params),
      queryParams: mergeRouteParams(routerState.root, r => r.queryParams),
      data: mergeRouteData(routerState.root)
    };
  }
}

function mergeRouteParams(route: ActivatedRouteSnapshot, getter: (r: ActivatedRouteSnapshot) => Params): Params {
  if (!route) {
    return {};
  }
  const currentParams = getter(route);
  const primaryChild = route.children.find(c => c.outlet === 'primary') || route.firstChild;
  return { ...currentParams, ...mergeRouteParams(primaryChild, getter) };
}

function mergeRouteData(route: ActivatedRouteSnapshot): Data {
  if (!route) {
    return {};
  }
  const currentData = route.data;
  const primaryChild = route.children.find(c => c.outlet === 'primary') || route.firstChild;
  return { ...currentData, ...mergeRouteData(primaryChild) };
}

function mergeRouteFragment(route: ActivatedRouteSnapshot): string {
  if (!route) {
    return '';
  }
  return route.fragment;
}
