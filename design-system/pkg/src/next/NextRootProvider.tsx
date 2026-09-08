'use client';

import { cache } from '@keystar/ui/style';
import { KeystarProvider } from '@keystar/ui/core';
import {
  usePathname,
  useRouter,
  useSearchParams,
  useServerInsertedHTML,
} from 'next/navigation';
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

  const { push, replace } = useRouter();
  const router = useMemo(() => {
    return {
      navigate(href: string, options?: { replace?: boolean }) {
        return options?.replace ? replace(href) : push(href);
      },
      // These hooks are consumed lazily by @keystar/ui/router.
      // eslint-disable-next-line react-compiler/react-compiler
      usePathname,
      // eslint-disable-next-line react-compiler/react-compiler
      useSearch: useNextSearch,
    };
  }, [push, replace]);

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

function useNextSearch() {
  const searchParams = useSearchParams();
  const search = searchParams.toString();
  return search ? `?${search}` : '';
}
