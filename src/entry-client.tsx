import {Suspense} from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { App } from './App'
import {loadFirstPageModule} from './utils/pages'
import {RouterProvider} from './router'

(async () => {
  const pageModule = await loadFirstPageModule(window.location.pathname)();
  ReactDOM.hydrate(
    <React.StrictMode>
      <RouterProvider>
        <App pageModule={pageModule}/>
      </RouterProvider>
    </React.StrictMode>,
    document.getElementById('app')
  )  
})()
