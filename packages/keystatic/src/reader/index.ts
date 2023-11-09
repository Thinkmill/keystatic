import nodePath from 'node:path';
import nodeFs from 'node:fs/promises';
import { Collection, ComponentSchema, Config, Singleton } from '..';
import {
  BaseReader,
  MinimalFs,
  collectionReader,
  singletonReader,
} from './generic';

export type { Entry, EntryWithResolvedLinkedFiles } from './generic';

export type Reader<
  Collections extends {
    [key: string]: Collection<Record<string, ComponentSchema>, string>;
  },
  Singletons extends {
    [key: string]: Singleton<Record<string, ComponentSchema>>;
  },
> = BaseReader<Collections, Singletons> & {
  repoPath: string;
};

export function createReader<
  Collections extends {
    [key: string]: Collection<Record<string, ComponentSchema>, string>;
  },
  Singletons extends {
    [key: string]: Singleton<Record<string, ComponentSchema>>;
  },
>(
  repoPath: string,
  config: Config<Collections, Singletons>
): Reader<Collections, Singletons> {
  const fs: MinimalFs = {
    async fileExists(path) {
      try {
        await nodeFs.stat(nodePath.join(repoPath, path));
        return true;
      } catch (err) {
        if ((err as any).code === 'ENOENT') return false;
        throw err;
      }
    },
    async readdir(path) {
      try {
        const entries = await nodeFs.readdir(nodePath.join(repoPath, path), {
          withFileTypes: true,
        });
        const filtered: { name: string; kind: 'file' | 'directory' }[] = [];
        for (const entry of entries) {
          if (entry.isDirectory()) {
            filtered.push({ name: entry.name, kind: 'directory' });
          }
          if (entry.isFile()) {
            filtered.push({ name: entry.name, kind: 'file' });
          }
        }
        return filtered;
      } catch (err) {
        if ((err as any).code === 'ENOENT') return [];
        throw err;
      }
    },
    async readFile(path) {
      try {
        return await nodeFs.readFile(nodePath.join(repoPath, path));
      } catch (err) {
        if ((err as any).code === 'ENOENT') return null;
        throw err;
      }
    },
  };
  return {
    collections: Object.fromEntries(
      Object.keys(config.collections || {}).map(key => [
        key,
        collectionReader(key, config as Config, fs),
      ])
    ) as any,
    singletons: Object.fromEntries(
      Object.keys(config.singletons || {}).map(key => [
        key,
        singletonReader(key, config as Config, fs),
      ])
    ) as any,
    repoPath,
    config,
  };
}
