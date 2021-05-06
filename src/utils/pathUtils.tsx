import * as path from 'path';

export const cwd = process.cwd();

export const joinCwd = (...args: string[]) => {
  return path.join(cwd, ...args);
}

export const relPathFromCwd = (p: string) => {
  return path.relative(cwd, p);
}