import {Suspense} from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { App } from './App'
import {RouterProvider} from './router'
import {loadFirstRoute} from './utils/pages'

(async () => {
  const firstRoute = await loadFirstRoute(window.location.pathname);
  ReactDOM.hydrate(
    <React.StrictMode>
      <RouterProvider firstRoute={firstRoute}>
        <App/>
      </RouterProvider>
    </React.StrictMode>,
    document.getElementById('app')
  )  
})()
