// import React, {Suspense} from 'react';
// import { Link, Route, Switch } from 'react-router-dom'
import {Suspense, useEffect, useState} from 'react';
import loadable from '@loadable/component'
import {Link, useRouter} from './router'
import {importAllPageModules, getRouteMetaList} from './utils/pages';

const pages = importAllPageModules();

export function App() {

  const {pageModule} = useRouter();
  const Page = pageModule.default;
  const Layout = (pageModule.getLayout || (() => ({children}) => <>{children}</>))();

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
