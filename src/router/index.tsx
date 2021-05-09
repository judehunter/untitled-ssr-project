import {ReactElement, ReactNode, useContext, useEffect, useMemo, useState} from 'react';
import {findRoute, importAllPageModules, getRouteMetaList, AwaitedFoundRoute} from '../utils/pages';

export const RouterCtx = React.createContext<{
  path: string,
  navigate: (...args) => any,
  params: Record<string, string>,
  pageModule: any
}>(null);

export const useRouter = () => useContext(RouterCtx);

const useLocationListener = (cb) => {
  useEffect(() => {
    window.addEventListener('popstate', cb);
    return () => window.removeEventListener('popstate', cb);
  })
}

export const RouterProvider = ({children, initPath, context, firstRoute}: {children: ReactElement, initPath?: string, context?: Record<string, any>, firstRoute: AwaitedFoundRoute}) => {
  const [path, setPath] = useState(
    initPath || (typeof window !== 'undefined' && window.location.pathname)
  );

  const [pageModule, setPageModule] = useState(firstRoute.pageModule);
  const [params, setParams] = useState(firstRoute.params);
  // const [state, setState] = useState({
  //   pageModule: firstRoute.pageModule
  // });

  const routeMetaList = useMemo(() => {
    return getRouteMetaList(importAllPageModules());
  }, []);

  useEffect(() => {
    (async () => {
      const foundRoute = findRoute(path, routeMetaList);
      setPageModule(await foundRoute.getPageModule());
      setParams(foundRoute.params);
    })()
  }, [path]);
  
  useLocationListener(() => {
    setPath(window.location.pathname);
  })

  const navigate = (url) => {
    setPath(url);
    window.history.pushState({}, undefined, url)
  }

  return (
    <RouterCtx.Provider value={{
      path,
      navigate,
      params,
      pageModule
    }}>
      {children}
    </RouterCtx.Provider>
  )
}

// export const useMatchRoute = (firstPage) => {
//   const {path} = useRouter();

//   return matched;
// }

export const Link = ({to, children}) => {
  const {navigate} = useRouter();
  return (
    <div onClick={() => navigate(to)}>
      {children}
    </div>
  )
}