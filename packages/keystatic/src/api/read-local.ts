import fs from 'fs/promises';
import path from 'path';
import {
  getCollectionPath,
  getSingletonFormat,
  getSingletonPath,
} from '../app/path-utils';
import { updateTreeWithChanges, blobSha } from '../app/trees';
import { Config } from '../config';
import { getDirectoriesForTreeKey } from '../app/tree-key';
import { fields } from '../form/api';
import ignore from 'ignore';

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
  ancestors: {
    gitignoreFilterForDescendents: (relativePath: string) => boolean;
    segment: string;
  }[]
): Promise<{ path: string; contents: { byteLength: number; sha: string } }[]> {
  const currentRelativeDir = ancestors.map(p => p.segment).join('/');
  const entries = await readDirEntries(path.join(baseDir, currentRelativeDir));
  const gitignore = entries.find(
    entry => entry.isFile() && entry.name === '.gitignore'
  );

  const gitignoreFilterForDescendents = gitignore
    ? ignore()
        .add(
          await fs.readFile(
            path.join(baseDir, currentRelativeDir, gitignore.name),
            'utf8'
          )
        )
        .createFilter()
    : () => true;
  const pathSegments = ancestors.map(x => x.segment);
  return (
    await Promise.all(
      entries
        .filter(entry => {
          if (
            (!entry.isDirectory() && !entry.isFile()) ||
            entry.name === '.git' ||
            entry.name === 'node_modules' ||
            entry.name === '.next'
          ) {
            return false;
          }
          const innerPath = `${pathSegments.concat(entry.name).join('/')}${
            entry.isDirectory() ? '/' : ''
          }`;
          if (!gitignoreFilterForDescendents(innerPath)) {
            return false;
          }
          let currentPath = entry.name;
          for (let i = ancestors.length - 1; i >= 0; i--) {
            const ancestor = ancestors[i];
            currentPath = `${ancestor.segment}/${currentPath}`;
            if (!ancestor.gitignoreFilterForDescendents(currentPath)) {
              return false;
            }
          }
          return true;
        })
        .map(async entry => {
          if (entry.isDirectory()) {
            return collectEntriesInDir(baseDir, [
              ...ancestors,
              { gitignoreFilterForDescendents, segment: entry.name },
            ]);
          } else {
            const innerPath = pathSegments.concat(entry.name).join('/');
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

export async function readToDirEntries(baseDir: string) {
  const additions = await collectEntriesInDir(baseDir, []);
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
    if (collectionConfig.template) {
      allowedDirectories.push(collectionConfig.template);
    }
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
  return [...new Set(allowedDirectories)];
}
