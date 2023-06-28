import { getPackages } from '@manypkg/get-packages';
import { readFile, writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { globby } from 'globby';
import { dirname } from 'path';
import { replaceImports, sortObjByKeys } from './utils.mjs';

const cwd = dirname(dirname(fileURLToPath(import.meta.url)));

const project = await getPackages(cwd);

const packagesToReplaceIn = new Set([
  '@voussoir/docs',
  '@keystatic/docs',
  '@keystatic/core',
  '@keystatic/test-next-app',
  'keystatic-docs',
]);

project.packages.find(pkg => pkg.packageJson.name === '@voussoir/storybook');

for (const pkg of project.packages) {
  if (!packagesToReplaceIn.has(pkg.packageJson.name)) {
    continue;
  }
  const clonedPkgJson = structuredClone(pkg.packageJson);
  for (const key of Object.keys(clonedPkgJson.dependencies!)) {
    if (key.startsWith('@voussoir/')) {
      delete clonedPkgJson.dependencies![key];
    }
  }
  clonedPkgJson.dependencies!['@keystar/ui'] = '^0.0.0';
  clonedPkgJson.dependencies = sortObjByKeys(clonedPkgJson.dependencies!);
  await writeFile(
    `${pkg.dir}/package.json`,
    JSON.stringify(clonedPkgJson, null, 2)
  );
  console.log('before getting files');
  const files = await globby('**/*.{ts,tsx,js}', {
    cwd: pkg.dir,
    gitignore: false,
    ignore: ['**/node_modules/**', '**/.next/**'],
    dot: true,
  });
  for (const file of files) {
    const content = await readFile(`${pkg.dir}/${file}`, 'utf8');
    await writeFile(`${pkg.dir}/${file}`, replaceImports(content));
  }
}
