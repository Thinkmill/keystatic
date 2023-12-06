import { getAllowedDirectories } from '@keystatic/core/api/utils';
import path from 'path';
import fs from 'fs/promises';
import { createHash } from 'crypto';

async function getDirKeyComponents(dirpath) {
  return Promise.all((await fs.readdir(dirpath, {
    withFileTypes: true
  })).map(async entry => {
    const joined = path.join(dirpath, entry.name);
    if (entry.isFile()) {
      const stat = await fs.stat(joined);
      return [entry.name, stat.mtimeMs];
    }
    if (entry.isDirectory() && entry.name !== 'node_modules') {
      return [entry.name, await getDirKeyComponents(joined)];
    }
    return null;
  }));
}
function getResolvedDirectories(config, repoPath) {
  const directories = getAllowedDirectories(config);
  const resolvedRepoPath = path.resolve(repoPath);
  return directories.map(dir => path.join(resolvedRepoPath, dir));
}
async function getReaderKey(directories) {
  const data = JSON.stringify(await Promise.all(directories.map(async dir => {
    return [dir, await getDirKeyComponents(dir)];
  })));
  return createHash('sha1').update(data).digest('hex');
}

export { getReaderKey as a, getResolvedDirectories as g };
