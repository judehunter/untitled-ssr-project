// @ts-check
const fs = require('fs')
const path = require('path')
const express = require('express')
const reactRefresh = require('@vitejs/plugin-react-refresh')

async function createServer(
  root = process.cwd(),
  isProd = process.env.NODE_ENV === 'production'
) {
  const resolve = (p) => path.resolve(__dirname, p)

  const app = express()

  app.use(express.static('public'))

  /**
   * @type {import('vite').ViteDevServer}
   */
  let vite
  vite = await require('vite').createServer({
    root,
    plugins: [
      reactRefresh.default(),
    ],
    esbuild: {
      jsxInject: `import React from 'react';`
    },
    build: {
      minify: false
    },
    server: {
      middlewareMode: true,
      watch: {
        // During tests we edit the files too fast and sometimes chokidar
        // misses change events, so enforce polling for consistency
        usePolling: true,
        interval: 100
      }
    }
  })
  // use vite's connect instance as middleware
  app.use(vite.middlewares)

  app.use('*', async (req, res) => {
    try {
      const url = req.originalUrl

      let template, render
        // always read fresh template in dev
      template = (await vite.ssrLoadModule('./src/htmlTemplate.tsx')).html();
      template = await vite.transformIndexHtml(url, template)
      render = (await vite.ssrLoadModule('./src/entry-server.tsx')).render

      const context = {}
      const appHtml = await render(url, context)

      if (context.url) {
        // Somewhere a `<Redirect>` was rendered
        return res.redirect(301, context.url)
      }

      const html = template.replace(`<!--app-html-->`, appHtml)

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } catch (e) {
      !isProd && vite.ssrFixStacktrace(e)
      console.log(e.stack)
      res.status(500).end(e.stack)
    }
  })

  return { app, vite }
}

createServer().then(({ app }) =>
  app.listen(3000, () => {
    console.log('http://localhost:3000')
  })
)
