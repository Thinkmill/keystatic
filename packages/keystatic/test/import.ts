import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const pkgDir = path.dirname(
  path.dirname(fileURLToPath(import.meta.url))
);
