import React from 'react';

// export declare var React: React;

declare global {
  var React: typeof React;
  namespace NodeJS {
    interface ProcessEnv {
      GITHUB_AUTH_TOKEN: string;
      NODE_ENV: 'development' | 'production';
      PORT?: string;
      PWD: string;
    }
  }
}


// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}