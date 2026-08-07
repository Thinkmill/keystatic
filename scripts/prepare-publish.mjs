import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const packageJsonPath = resolve(repoRoot, 'packages/keystatic/package.json');
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
const dependencyName = '@keystar/ui';

if (packageJson.dependencies?.[dependencyName] !== 'workspace:*') {
  throw new Error(
    `Expected ${dependencyName} to be an exact workspace dependency in ${packageJsonPath}`
  );
}

if (packageJson.peerDependencies?.[dependencyName] !== '*') {
  throw new Error(
    `Expected ${dependencyName} to be a wildcard peer dependency in ${packageJsonPath}`
  );
}

packageJson.peerDependencies[dependencyName] = 'workspace:*';
writeFileSync(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`);
