'use client';

import { cache } from '@keystar/ui/style';
import { KeystarProvider } from '@keystar/ui/core';
import { useRouter, useServerInsertedHTML } from 'next/navigation';
import { ReactNode, useMemo, useRef } from 'react';

import { ColorSchemeProvider, useRootColorScheme } from './useRootColorScheme';

cache.compat = true;

type NextRootProviderProps = {
  children: ReactNode;
  fontClassName: string;
  locale?: string;
};

export function NextRootProvider(props: NextRootProviderProps) {
  return (
    <ColorSchemeProvider>
      <InnerProvider {...props} />
    </ColorSchemeProvider>
  );
}

const insertedKeys = Object.keys(cache.inserted);

const prevInsert = cache.insert;
cache.insert = (...args) => {
  const serialized = args[1];
  if (cache.inserted[serialized.name] === undefined) {
    insertedKeys.push(serialized.name);
  }
  return prevInsert(...args);
};

function InnerProvider(props: NextRootProviderProps) {
  let lastIndexRef = useRef(0);
  let { colorScheme } = useRootColorScheme();

  useServerInsertedHTML(() => {
    const names = insertedKeys.slice(lastIndexRef.current);
    lastIndexRef.current = insertedKeys.length;
    if (names.length === 0) return null;
    let styles = '';
    for (const name of names) {
      styles += cache.inserted[name];
    }
    return (
      <style
        key={Math.random().toString(36)}
        data-emotion={`${cache.key} ${names.join(' ')}`}
        dangerouslySetInnerHTML={{
          __html: styles,
        }}
      />
    );
  });

  const { push: navigate } = useRouter();
  const router = useMemo(() => {
    return { navigate };
  }, [navigate]);

  return (
    <KeystarProvider
      {...props}
      UNSAFE_className={props.fontClassName}
      colorScheme={colorScheme}
      elementType="html"
      router={router}
    />
  );
}
