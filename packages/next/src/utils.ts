import { Config } from '@keystatic/core';
import { getAllowedDirectories } from '@keystatic/core/api/utils';
import path from 'path';
import fs from 'fs/promises';
import { createHash } from 'crypto';

type DirKeyComponent = null | [string, DirKeyComponent[] | number];

async function getDirKeyComponents(dirpath: string) {
  return Promise.all(
    (await fs.readdir(dirpath, { withFileTypes: true })).map(
      async (entry): Promise<DirKeyComponent> => {
        const joined = path.join(dirpath, entry.name);
        if (entry.isFile()) {
          const stat = await fs.stat(joined);
          return [entry.name, stat.mtimeMs];
        }
        if (entry.isDirectory() && entry.name !== 'node_modules') {
          return [entry.name, await getDirKeyComponents(joined)];
        }
        return null;
      }
    )
  );
}

export function getResolvedDirectories(config: Config, repoPath: string) {
  const directories = getAllowedDirectories(config);
  const resolvedRepoPath = path.resolve(repoPath);
  return directories.map(dir => path.join(resolvedRepoPath, dir));
}

export async function getReaderKey(directories: string[]) {
  const data = JSON.stringify(
    await Promise.all(
      directories.map(async dir => {
        return [dir, await getDirKeyComponents(dir)];
      })
    )
  );
  return createHash('sha1').update(data).digest('hex');
}
