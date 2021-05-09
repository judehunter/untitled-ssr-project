import {Suspense} from 'react'
import ReactDOMServer from 'react-dom/server'
import {renderToStringAsync} from 'react-async-ssr';
import { StaticRouter } from 'react-router-dom'
import { App } from './App'
import {RouterProvider} from './router'
import {loadFirstRoute} from './utils/pages';

export async function render(path, context) {
  const firstRoute = await loadFirstRoute(path);
  const html = ReactDOMServer.renderToString(
    <RouterProvider initPath={path} context={context} firstRoute={firstRoute}>
      <App/>
    </RouterProvider>
  );
  return html
}
