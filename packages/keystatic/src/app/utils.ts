import { base64UrlEncode } from '#base64';
import { isDefined } from 'emery';

import { Config, GitHubConfig, LocalConfig } from '../config';
import { CloudConfig, ComponentSchema } from '..';
import {
  getCollectionFormat,
  getCollectionItemPath,
  getCollectionItemSlugSuffix,
  getCollectionPath,
  getDataFileExtension,
  getSlugGlobForCollection,
} from './path-utils';
import { collectDirectoriesUsedInSchema, getTreeKey } from './tree-key';
import { getTreeNodeAtPath, TreeNode } from './trees';
import pkgJson from '../../package.json';
import { object } from '../form/fields/object';
import { useEffect } from 'react';
import { showDraftRestoredToast } from './persistence';
import { useEffectEvent } from '@react-aria/utils';

export * from './path-utils';

export function getCollection(config: Config, collection: string) {
  return config.collections![collection];
}

export function getBranchPrefix(config: Config) {
  return config.storage.kind !== 'local'
    ? config.storage.branchPrefix
    : undefined;
}

export function arrayOf<T>(arr: readonly (T | null)[]): T[] {
  return arr.filter(isDefined);
}
export function keyedEntries<T extends Record<string, any>>(
  obj: T
): ({ key: string } & T[keyof T])[] {
  return Object.entries(obj).map(([key, value]) => ({ key, ...value }));
}

export type MaybePromise<T> = T | Promise<T>;

export function isGitHubConfig(config: Config): config is GitHubConfig {
  return config.storage.kind === 'github';
}

export function isLocalConfig(config: Config): config is LocalConfig {
  return config.storage.kind === 'local';
}

export function isCloudConfig(config: Config): config is CloudConfig {
  if (config.storage.kind !== 'cloud') return false;
  if (!config.cloud?.project || !config.cloud.project.includes('/')) {
    throw new Error(
      `Keystatic is set to \`storage: { kind: 'cloud' }\` but \`cloud.project\` isn't set.
config({
  storage: { kind: 'cloud' },
  cloud: { project: 'team/project' },
})`
    );
  }
  return true;
}

export function getSplitCloudProject(config: Config) {
  if (!config.cloud?.project) return undefined;
  const [team, project] = config.cloud.project.split('/');
  return { team, project };
}

export function getRepoPath(config: { owner: string; name: string }) {
  return `${config.owner}/${config.name}`;
}
export function getRepoUrl(config: { owner: string; name: string }) {
  return `https://github.com/${getRepoPath(config)}`;
}

export function getSlugFromState(
  collectionConfig: {
    slugField: string;
    schema: Record<string, ComponentSchema>;
  },
  state: Record<string, unknown>
) {
  const value = state[collectionConfig.slugField];
  const field = collectionConfig.schema[collectionConfig.slugField];
  if (field.kind !== 'form' || field.formKind !== 'slug') {
    throw new Error(`slugField is not a slug field`);
  }
  return field.serializeWithSlug(value).slug;
}

export function getEntriesInCollectionWithTreeKey(
  config: Config,
  collection: string,
  rootTree: Map<string, TreeNode>
): { key: string; slug: string; sha: string }[] {
  const collectionConfig = config.collections![collection];
  const schema = object(collectionConfig.schema);
  const formatInfo = getCollectionFormat(config, collection);
  const extension = getDataFileExtension(formatInfo);
  const glob = getSlugGlobForCollection(config, collection);
  const collectionPath = getCollectionPath(config, collection);
  const directory: Map<string, TreeNode> =
    getTreeNodeAtPath(rootTree, collectionPath)?.children ?? new Map();
  const entries: { key: string; slug: string; sha: string }[] = [];
  const directoriesUsedInSchema = [...collectDirectoriesUsedInSchema(schema)];
  const suffix = getCollectionItemSlugSuffix(config, collection);
  const possibleEntries = new Map(directory);
  if (glob === '**') {
    const handleDirectory = (dir: Map<string, TreeNode>, prefix: string) => {
      for (const [key, entry] of dir) {
        if (entry.children) {
          possibleEntries.set(`${prefix}${key}`, entry);
          handleDirectory(entry.children, `${prefix}${key}/`);
        } else {
          possibleEntries.set(`${prefix}${key}`, entry);
        }
      }
    };
    handleDirectory(directory, '');
  }
  for (const [key, entry] of possibleEntries) {
    if (formatInfo.dataLocation === 'index') {
      const actualEntry = getTreeNodeAtPath(
        rootTree,
        getCollectionItemPath(config, collection, key)
      );
      if (!actualEntry?.children?.has('index' + extension)) continue;
      entries.push({
        key: getTreeKey(
          [
            actualEntry.entry.path,
            ...directoriesUsedInSchema.map(x => `${x}/${key}`),
          ],
          rootTree
        ),
        slug: key,
        sha: actualEntry.children.get('index' + extension)!.entry.sha,
      });
    } else {
      if (suffix) {
        const newEntry = getTreeNodeAtPath(
          rootTree,
          getCollectionItemPath(config, collection, key) + extension
        );
        if (!newEntry || newEntry.children) continue;
        entries.push({
          key: getTreeKey(
            [
              entry.entry.path,
              getCollectionItemPath(config, collection, key),
              ...directoriesUsedInSchema.map(x => `${x}/${key}`),
            ],
            rootTree
          ),
          slug: key,
          sha: newEntry.entry.sha,
        });
      }
      if (entry.children || !key.endsWith(extension)) continue;
      const slug = key.slice(0, -extension.length);
      entries.push({
        key: getTreeKey(
          [
            entry.entry.path,
            getCollectionItemPath(config, collection, slug),
            ...directoriesUsedInSchema.map(x => `${x}/${slug}`),
          ],
          rootTree
        ),
        slug,
        sha: entry.entry.sha,
      });
    }
  }
  return entries;
}

export const KEYSTATIC_CLOUD_API_URL = 'https://api.keystatic.cloud';

export const PKG_VERSION = pkgJson.version;

export const KEYSTATIC_CLOUD_HEADERS = {
  'x-keystatic-version': PKG_VERSION,
};

const textEncoder = new TextEncoder();

export async function redirectToCloudAuth(from: string, config: Config) {
  if (!config.cloud?.project) {
    throw new Error('Not a cloud config');
  }
  const code_verifier = base64UrlEncode(
    crypto.getRandomValues(new Uint8Array(32))
  );
  const code_challenge = base64UrlEncode(
    new Uint8Array(
      await crypto.subtle.digest('SHA-256', textEncoder.encode(code_verifier))
    )
  );
  const state = base64UrlEncode(crypto.getRandomValues(new Uint8Array(32)));
  localStorage.setItem(
    'keystatic-cloud-state',
    JSON.stringify({ state, from, code_verifier })
  );
  const url = new URL(`${KEYSTATIC_CLOUD_API_URL}/oauth/authorize`);
  url.searchParams.set('state', state);
  url.searchParams.set('client_id', config.cloud.project);
  url.searchParams.set(
    'redirect_uri',
    `${window.location.origin}/keystatic/cloud/oauth/callback`
  );
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('code_challenge_method', 'S256');
  url.searchParams.set('code_challenge', code_challenge);
  url.searchParams.set('keystatic_version', pkgJson.version);

  window.location.href = url.toString();
}

export function useShowRestoredDraftMessage(
  draft:
    | {
        state: Record<string, unknown>;
        savedAt: Date;
        treeKey?: string | undefined;
      }
    | undefined,
  state: Record<string, unknown>,
  localTreeKey: string | undefined
) {
  const show = useEffectEvent(() => {
    if (draft && state === draft.state) {
      showDraftRestoredToast(draft.savedAt, localTreeKey !== draft.treeKey);
    }
  });
  useEffect(() => {
    if (draft) {
      show();
    }
  }, [draft, show]);
}
