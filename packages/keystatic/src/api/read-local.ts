import fs from 'fs/promises';
import path from 'path';
import {
  getCollectionPath,
  getSingletonFormat,
  getSingletonPath,
} from '../../app/path-utils';
import { updateTreeWithChanges, blobSha } from './trees-server-side';
import { Config } from '../../config';
import { getDirectoriesForTreeKey } from '../../app/tree-key';
import { fields } from '../../DocumentEditor/component-blocks/api';

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
  const rootDirs = getAllowedDirectories(config);
  await Promise.all(
    rootDirs.map(async dir => {
      additions.push(...(await collectEntriesInDir(baseDir, dir)));
    })
  );
  const { entries } = await updateTreeWithChanges(new Map(), {
    additions: additions,
    deletions: [],
  });
  return entries;
}

export function getAllowedDirectories(config: Config) {
  const allowedDirectories: string[] = [];
  for (const [collection, collectionConfig] of Object.entries(
    config.collections ?? {}
  )) {
    allowedDirectories.push(
      ...getDirectoriesForTreeKey(
        fields.object(collectionConfig.schema),
        getCollectionPath(config, collection),
        undefined,
        { data: 'yaml', contentField: undefined, dataLocation: 'index' }
      )
    );
  }
  for (const [singleton, singletonConfig] of Object.entries(
    config.singletons ?? {}
  )) {
    allowedDirectories.push(
      ...getDirectoriesForTreeKey(
        fields.object(singletonConfig.schema),
        getSingletonPath(config, singleton),
        undefined,
        getSingletonFormat(config, singleton)
      )
    );
  }
  return allowedDirectories;
}
