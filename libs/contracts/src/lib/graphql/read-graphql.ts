import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

export const readGraphQLFile = (moduleUrl: string, filename: string) =>
  readFileSync(join(dirname(fileURLToPath(moduleUrl)), filename), 'utf-8');
