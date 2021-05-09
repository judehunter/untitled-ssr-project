import {ReactNode} from 'react';
import {joinCwd} from './pathUtils';

export type PageModule = {
  default: () => ReactNode,
  getLayout: () => () => ReactNode
}
export type PageModuleGetter = () => Promise<PageModule>;
export type PageModulesDict = Record<string, PageModuleGetter>

export type RouteMeta = {
  path: string,
  // formalParams: string[],
  // actualParams?: Record<string, string>,
  // parameterizedPath: string[],
  pathParts: PathPart[],
  getPageModule: () => Promise<PageModule>
}

export type RouteMetaList = RouteMeta[];

type PathPart = {
  value: string,
  matcher: any
}

const PathPartMatchers = {
  param: (paramName: string) => (given: string) => given ? {[paramName]: given} : false,
  exact: (expected: string) => (given: string) => expected === given
}

const getRouteMeta = ([origPath, pageModuleGetter]: [string, PageModuleGetter]): RouteMeta => {
  let path = '/' + origPath.match(/\/src\/pages\/(.+)\.tsx$/)[1];
  path = path.replace(/^\/((.+)\/)?index$/, '\/$2'); //strip index

  const pathParts = path.split('/').filter(x => x.length).map(pathPart => {
    let matcher = undefined;

    const paramMatch = pathPart.match(/^\[(.+)\]$/)?.[1]
    if (paramMatch) {
      matcher = PathPartMatchers.param(paramMatch)
    }
    else {
      matcher = PathPartMatchers.exact(pathPart);
    }
    return {
      value: pathPart,
      matcher
    }
  });

  return {
    path,
    pathParts,
    getPageModule: pageModuleGetter
  }
}

export const getRouteMetaList = (pageModules: PageModulesDict): RouteMetaList => {
  return Object.entries(pageModules).map(getRouteMeta);
}

export const importAllPageModules = (): PageModulesDict => {
  return (import.meta as any).glob('/src/pages/**/*.tsx')
}

export const loadFirstRoute = (path: string): Promise<AwaitedFoundRoute> => {
  const pageModules = importAllPageModules();
  return awaitedFindRoute(path, getRouteMetaList(pageModules));
}

export type FoundRoute = {
  getPageModule: PageModuleGetter,
  params: Record<string, string>
};

export type AwaitedFoundRoute = {
  pageModule: PageModule,
  params: Record<string, string>
};

export const findRoute = (curPath: string, routeMetaList: RouteMetaList) => {
  const curPathParts = curPath.split('/').filter(x => x.length);
  console.log(curPath, curPathParts);

  let ret: FoundRoute = null;

  for (const routeMeta of routeMetaList) {
    if (curPathParts.length !== routeMeta.pathParts.length) continue;

    const params = curPathParts.map((curPathPart, i) => {
      return routeMeta.pathParts[i].matcher(curPathPart);
    }).reduce((acc, cur) => {
      if (acc === false || cur === false) return false;
      if (cur instanceof Object) return {...acc, ...cur};
      else return acc;
    }, {});

    if (params) {
      ret = {
        getPageModule: routeMeta.getPageModule,
        params
      }
    }
  }

  if (!ret) throw new Error('Not found');

  return ret
}

export const awaitedFindRoute = async (...args: Parameters<typeof findRoute>): Promise<AwaitedFoundRoute> => {
  const foundRoute = findRoute(...args);
  return {params: foundRoute.params, pageModule: await foundRoute.getPageModule()}
}