import {joinCwd, relPathFromCwd} from './utils/pathUtils';

export const html = () => `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Vite App</title>
    </head>
    <body>
      <div id="app"><!--app-html--></div>
      <script type="module" src="/${relPathFromCwd('./src/entry-client.tsx')}"></script>
    </body>
  </html>
`