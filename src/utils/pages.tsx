import {joinCwd} from './pathUtils';

export const pagesToRoutes = (pages) => {
  return Object.keys(pages).map((_path) => {
    const name = _path.match(/\/src\/pages\/(.*)\.jsx$/)[1];
    const path = '/' + name;
    const isIndex = path.split('/').reverse()[0] === 'index';
    const indexPath = path.split('/').slice(0, -1).join('/')
    const handleIndex = isIndex ? (indexPath.startsWith('/') ? indexPath : `/${indexPath}`)  : path;
    return {
      name,
      path: handleIndex,
      module: pages[_path]
    }
  })
}

export const importPagesGlob = () => {
  return (import.meta as any).glob('/src/pages/**/*.jsx')
}

export const loadFirstPageModule = (path: string) => {
  const pages = importPagesGlob();
  return Object.values(pagesToRoutes(pages)).find(route => route.path === path).module;
}