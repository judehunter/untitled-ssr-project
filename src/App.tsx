// import React, {Suspense} from 'react';
// import { Link, Route, Switch } from 'react-router-dom'
import {Suspense, useEffect, useState} from 'react';
import loadable from '@loadable/component'
import {Link, useMatchRoute} from './router'
import {importPagesGlob, pagesToRoutes} from './utils/pages';

// Auto generates routes from files under ./pages
// https://vitejs.dev/guide/features.html#glob-import
const pages = importPagesGlob();

export function App({pageModule}) {

  // const routes = Object.keys(pages).map((_path) => {
  //   const name = _path.match(/\.\/pages\/(.*)\.jsx$/)[1];
  //   const path = '/' + name;
  //   const isManaged = path.split('/').reverse()[0].split('.').find(x => x === 'page');
  //   const strippedPath = path.slice(0, path.indexOf('.'));
  //   const isIndex = strippedPath.split('/').reverse()[0] === 'index';
  //   const indexPath = strippedPath.split('/').slice(0, -1).join('/')
  //   const handleIndex = isIndex ? (indexPath.startsWith('/') ? indexPath : `/${indexPath}`)  : strippedPath;
  //   const test = {
  //     name,
  //     path: isManaged ? handleIndex : undefined,
  //     exports: {
  //       default: pages[_path].default,
  //       getLayout: pages[_path].getLayout,
  //       route: isManaged ? undefined : pages[_path].route
  //     }
  //   }
  //   // console.log(test);
  //   return test;
  // })

  const matched = useMatchRoute(pageModule, pagesToRoutes(pages));
  const Page = matched.default;
  const Layout = (matched.getLayout || (() => ({children}) => <>{children}</>))();

  return (
    <>
      <nav>
        <ul>
          {['/', '/404', '/test'].map((path, i) => {
            return (
              <li key={path || i}>
                <Link to={path || '/'}>
                  {path}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
      <div>
        <Layout>
          <Page />
        </Layout>
      </div>
    </>
  )
}
