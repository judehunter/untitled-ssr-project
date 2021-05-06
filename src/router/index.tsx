import {ReactNode, useContext, useEffect, useMemo, useState} from 'react';

export const RouterCtx = React.createContext(null);

export const useRouter = () => useContext(RouterCtx);

const useLocationListener = (cb) => {
  useEffect(() => {
    window.addEventListener('popstate', cb);
    return () => window.removeEventListener('popstate', cb);
  })
}

export const RouterProvider = ({children, initPath, context}: {children: ReactNode, initPath?: string, context?: Record<string, any>}) => {
  const [path, setPath] = useState(
    initPath || (typeof window !== 'undefined' && window.location.pathname)
  );
  const navigate = (url) => {
    setPath(url);
    window.history.pushState({}, undefined, url)
  }
  useLocationListener(() => {
    setPath(window.location.pathname);
  })
  return (
    <RouterCtx.Provider value={{
      path,
      navigate
    }}>{children}</RouterCtx.Provider>
  )
}

export const useMatchRoute = (firstPage, routes) => {
  const {path} = useRouter();

  const [matched, setMatched] = useState(firstPage)

  useEffect(() => {
    (async () => {
      setMatched(
        await (
          routes.find(r => {
            if (r.path === path) return true;
            else return false;
          })?.module?.() || routes.find(r => r.path === '/404')?.module?.()
        )
      )
    })()
  }, [path]);

  return matched;
}

export const Link = ({to, children}) => {
  const {navigate} = useRouter();
  return (
    <div onClick={() => navigate(to)}>
      {children}
    </div>
  )
}