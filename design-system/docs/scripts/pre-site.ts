import { isDefined } from 'emery/guards';
import fs from 'node:fs/promises';
import path from 'node:path';

const pkgSrcDir = path.resolve(process.cwd(), '../pkg/src');

async function getComponentReexports() {
  let pkgSrcDirEntries;
  try {
    pkgSrcDirEntries = await fs.readdir(pkgSrcDir, { withFileTypes: true });
  } catch (err) {
    throw new Error(`Failed to read directory at ${pkgSrcDir}: ${err}`);
  }
  const packages = (
    await Promise.all(
      pkgSrcDirEntries.map(async entry => {
        if (!entry.isDirectory()) return;
        const innerEntries = await fs.readdir(
          path.join(pkgSrcDir, entry.name),
          { withFileTypes: true }
        );
        for (const innerEntry of innerEntries) {
          if (
            innerEntry.isFile() &&
            (innerEntry.name === 'index.ts' || innerEntry.name === 'index.tsx')
          ) {
            return entry.name;
          }
        }
      })
    )
  ).filter(isDefined);

  return packages
    .sort()
    .filter(x => x !== 'types' && x !== 'test-utils')
    .map(pkg => `export * from '@keystar/ui/${pkg}';`)
    .join('\n');
}

export const GENERATED_DIR = 'generated';

export async function writeComponentReexports() {
  const components = await getComponentReexports();
  await fs.writeFile(`${GENERATED_DIR}/components.ts`, components);
}

(async () => {
  try {
    await writeComponentReexports();
  } catch (err) {
    if ((err as any).code === 'ENOENT') {
      // we're not creating this first because we're optimising
      // for the case where the cache directory exists
      await fs.mkdir(GENERATED_DIR, { recursive: true });
      await writeComponentReexports();
    } else {
      throw err;
    }
  }
})();
