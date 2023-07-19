'use client';

import { cache } from '@keystar/ui/style';
import { VoussoirProvider, VoussoirProviderProps } from '@keystar/ui/core';
import { useServerInsertedHTML } from 'next/navigation';
import { forwardRef, ForwardRefExoticComponent, Ref, useRef } from 'react';
import { UniversalNextLink } from './UniversalNextLink';

cache.compat = true;

const insertedKeys = Object.keys(cache.inserted);

const prevInsert = cache.insert;
cache.insert = (...args) => {
  const serialized = args[1];
  if (cache.inserted[serialized.name] === undefined) {
    insertedKeys.push(serialized.name);
  }
  return prevInsert(...args);
};

/** @deprecated — use `NextRootProvider` instead. */
export const RootVoussoirProvider: ForwardRefExoticComponent<
  VoussoirProviderProps & { fontClassName: string; ref?: Ref<HTMLHtmlElement> }
> = forwardRef(function RootVoussoirProvider(props, ref) {
  const lastIndexRef = useRef(0);

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
  return (
    <VoussoirProvider
      {...props}
      UNSAFE_className={`${props.fontClassName}${
        props.UNSAFE_className ? ` ${props.UNSAFE_className}` : ''
      }`}
      ref={ref}
      elementType="html"
      linkComponent={UniversalNextLink}
    />
  );
});
