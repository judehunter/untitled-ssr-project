import {Suspense} from 'react'
import ReactDOMServer from 'react-dom/server'
import {renderToStringAsync} from 'react-async-ssr';
import { StaticRouter } from 'react-router-dom'
import { App } from './App'
import {RouterProvider} from './router'
import {loadFirstPageModule} from './utils/pages';

export async function render(path, context) {
  const pageModule = await loadFirstPageModule(path)();
  const html = ReactDOMServer.renderToString(
    <RouterProvider initPath={path} context={context}>
      <App pageModule={pageModule}/>
    </RouterProvider>
  );
  return html
}
