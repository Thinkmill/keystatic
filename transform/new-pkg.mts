import { getPackages } from '@manypkg/get-packages';
import { mkdir, readFile, rm, writeFile, copyFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { globby } from 'globby';
import { dirname, join } from 'path';
import { replaceImports, sortObjByKeys } from './utils.mjs';

const cwd = dirname(dirname(fileURLToPath(import.meta.url)));

const newPkgDir = `${cwd}/design-system/pkg`;

await rm(newPkgDir, { recursive: true, force: true });

const project = await getPackages(cwd);

const voussoirPackages = project.packages.filter(
  pkg =>
    pkg.packageJson.name.startsWith('@voussoir/') && !pkg.packageJson.private
);

const newPkg = {
  name: '@keystar/ui',
  version: '0.0.0',
  license: 'MIT',
  main: '',
  module: '',
  exports: {},
  dependencies: {} satisfies Record<string, string>,
  devDependencies: {
    '@keystar/ui-storybook': '^0.0.1',
  } satisfies Record<string, string>,
  peerDependencies: {} satisfies Record<string, string>,
  preconstruct: {
    entrypoints: [
      '*/index.{ts,tsx}',
      'utils/ts/index.ts',
      'icon/all.ts',
      'icon/icons/*.tsx',
    ],
  },
};

function addDeps<Val>(a: Record<string, Val>, b: Record<string, Val>) {
  for (const [key, value] of Object.entries(b)) {
    if (key.startsWith('@voussoir/')) continue;
    if (a[key] !== undefined && a[key] !== value) {
      throw new Error(`trying to set ${key} twice, ${a[key]} and ${value}`);
    }
    a[key as keyof typeof b] = value;
  }
  const cloned = { ...a };
  for (const key of Object.keys(cloned)) {
    delete a[key];
  }
  Object.assign(a, sortObjByKeys(cloned));
}

async function outputFile(filename: string, content: string) {
  try {
    await writeFile(filename, content);
  } catch (err) {
    if ((err as any).code !== 'ENOENT') {
      throw err;
    }
    await mkdir(dirname(filename), { recursive: true });
    await writeFile(filename, content);
  }
}

for (const pkg of voussoirPackages) {
  addDeps(newPkg.dependencies, pkg.packageJson.dependencies ?? {});
  addDeps(newPkg.devDependencies, pkg.packageJson.devDependencies ?? {});
  addDeps(newPkg.peerDependencies, pkg.packageJson.peerDependencies ?? {});
  const entrypoints = (pkg.packageJson as any).preconstruct?.entrypoints;
  if (entrypoints) {
    console.log(pkg.packageJson.name, entrypoints);
  }
  const newDir = `${newPkgDir}/src/${pkg.packageJson.name.replace(
    '@voussoir/',
    ''
  )}`;
  const sourceFiles = await globby('**/*', { cwd: join(pkg.dir, 'src') });
  for (const file of sourceFiles) {
    const content = await readFile(`${pkg.dir}/src/${file}`, 'utf8');
    await outputFile(
      `${newDir}/${file}`,
      replaceImports(content).replaceAll('../l10n.json', './l10n.json')
    );
  }
  try {
    await copyFile(`${pkg.dir}/l10n.json`, `${newDir}/l10n.json`);
  } catch (err) {
    if ((err as any).code !== 'ENOENT') {
      throw err;
    }
  }
  for (const a of ['docs', 'stories', 'test']) {
    const files = await globby('**/*', { cwd: join(pkg.dir, a) });
    for (const file of files) {
      const content = await readFile(`${pkg.dir}/${a}/${file}`, 'utf8');
      let replaced = replaceImports(content);
      if (a !== 'docs') {
        replaced = replaced.replace(/\.\.\/src/g, '..');
      }
      await outputFile(`${newDir}/${a}/${file}`, replaced);
    }
  }
}

await writeFile(
  `${newPkgDir}/package.json`,
  JSON.stringify(newPkg, null, 2) + '\n'
);
