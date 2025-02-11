import { ReactNode, createContext, useContext, useMemo } from 'react';
import { ReadonlyPropPath } from '../document/DocumentEditor/component-blocks/utils';
import { Glob } from '../../..';
import {
  useAwarenessStates,
  useYjsIfAvailable,
} from '../../../app/shell/collab';
import { useCloudInfo } from '../../../app/shell/data';
import { useRouter } from '../../../app/router';
import { useConfig } from '../../../app/shell/context';
import { areArraysEqual } from '../document/DocumentEditor/document-features-normalization';
import { Avatar } from '@keystar/ui/avatar';
import { css } from '@keystar/ui/style';

function CollabAddToPathProvider(props: {
  path: ReadonlyPropPath;
  children: ReactNode;
}) {
  const yjsInfo = useYjsIfAvailable();
  const cloudInfo = useCloudInfo();
  const router = useRouter();
  const awarenessStates = useAwarenessStates();
  const avatarsAtPath = useMemo(() => {
    if (!yjsInfo || yjsInfo === 'loading' || !cloudInfo) {
      return [];
    }
    const avatars: { avatarUrl?: string; name: string }[] = [];
    for (const [clientId, val] of awarenessStates) {
      if (
        clientId === yjsInfo.awareness.clientID ||
        !val.user ||
        router.href !== `/keystatic/branch/${val.branch}/${val.location}` ||
        !Array.isArray(val.path) ||
        !areArraysEqual(val.path, props.path)
      ) {
        continue;
      }
      avatars.push(val.user);
    }
    return avatars;
  }, [yjsInfo, cloudInfo, awarenessStates, router.href, props.path]);
  return (
    <div
      data-ks-path={JSON.stringify(props.path)}
      onFocus={e => {
        if (e.target.closest('[data-ks-path]') === e.currentTarget) {
          if (yjsInfo && yjsInfo !== 'loading') {
            yjsInfo.awareness.setLocalStateField('path', props.path);
          }
        }
      }}
    >
      {!!avatarsAtPath.length && (
        <div
          className={css({
            position: 'relative',
            width: '100%',
            height: 0,
          })}
        >
          <div
            className={css({
              position: 'absolute',
              top: 0,
              right: 0,
              display: 'flex',
              gap: '0.5em',
            })}
          >
            {avatarsAtPath.map((avatar, i) => (
              <Avatar
                size="xsmall"
                key={i}
                src={avatar.avatarUrl}
                name={avatar.name}
              />
            ))}
          </div>
        </div>
      )}
      {props.children}
    </div>
  );
}

export function AddToPathProvider(props: {
  part: (string | number) | readonly (string | number)[];
  children: ReactNode;
}) {
  const path = useContext(PathContext);
  const config = useConfig();
  const newPath = useMemo(() => path.concat(props.part), [path, props.part]);

  let inner = (
    <PathContext.Provider value={newPath}>
      {props.children}
    </PathContext.Provider>
  );
  if (config.storage.kind === 'cloud') {
    return (
      <CollabAddToPathProvider path={newPath}>{inner}</CollabAddToPathProvider>
    );
  }
  return inner;
}

export type SlugFieldInfo = {
  field: string;
  slugs: Set<string>;
  glob: Glob;
};

export const SlugFieldContext = createContext<SlugFieldInfo | undefined>(
  undefined
);

export const SlugFieldProvider = SlugFieldContext.Provider;

export const PathContext = createContext<ReadonlyPropPath>([]);

export const PathContextProvider = PathContext.Provider;
