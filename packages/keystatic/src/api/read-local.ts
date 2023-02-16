import fs from 'fs/promises';
import path from 'path';
import {
  getCollectionItemPath,
  getCollectionPath,
  getSingletonPath,
} from '../../app/path-utils';
import { updateTreeWithChanges, blobSha } from './trees-server-side';
import { Config } from '../../config';

async function readDirEntries(dir: string) {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch (err) {
    if ((err as any).code === 'ENOENT') {
      return [];
    }
    throw err;
  }
  return entries;
}

async function collectEntriesInDir(
  baseDir: string,
  currentRelativeDir: string
): Promise<
  {
    path: string;
    contents: {
      byteLength: number;
      sha: string;
    };
  }[]
> {
  const entries = await readDirEntries(path.join(baseDir, currentRelativeDir));
  return (
    await Promise.all(
      entries
        .filter(entry => entry.isDirectory() || entry.isFile())
        .map(async entry => {
          const innerPath = `${currentRelativeDir}/${entry.name}`;
          if (entry.isDirectory()) {
            return collectEntriesInDir(baseDir, innerPath);
          } else {
            const contents = await fs.readFile(path.join(baseDir, innerPath));
            return {
              path: innerPath,
              contents: {
                byteLength: contents.byteLength,
                sha: await blobSha(contents),
              },
            };
          }
        })
    )
  ).flat();
}

export async function readToDirEntries(baseDir: string, config: Config) {
  const additions: {
    path: string;
    contents: {
      byteLength: number;
      sha: string;
    };
  }[] = [];
  await Promise.all([
    ...Object.keys(config.collections ?? {}).map(async collection => {
      const collectionPath = getCollectionPath(config, collection);
      const dirEntries = await readDirEntries(
        path.join(baseDir, collectionPath)
      );
      await Promise.all(
        dirEntries.map(async entry => {
          if (entry.isDirectory()) {
            const innerPath = getCollectionItemPath(
              config,
              collection,
              entry.name
            );
            additions.push(...(await collectEntriesInDir(baseDir, innerPath)));
          }
        })
      );
    }),
    ...Object.keys(config.singletons ?? {}).map(async singleton => {
      const singletonPath = getSingletonPath(config, singleton);
      additions.push(...(await collectEntriesInDir(baseDir, singletonPath)));
    }),
  ]);
  const { entries } = await updateTreeWithChanges(new Map(), {
    additions: additions,
    deletions: [],
  });
  return entries;
}
