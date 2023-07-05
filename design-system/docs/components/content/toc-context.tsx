'use client';
import {
  ComponentPropsWithoutRef,
  ProviderProps,
  createContext,
  useContext,
  useMemo,
} from 'react';

import { Heading as _Heading } from '@keystar/ui/typography';

import { HEADER_HEIGHT } from '../../components/constants';
import { HeadingEntry } from '../../utils/generate-toc';
import {
  IntersectionObserverProvider,
  useEntries,
  useObserve,
} from './intersection-observer';

const TocContext = createContext<HeadingEntry[] | undefined>(undefined);

export const TocContextProvider = (props: ProviderProps<HeadingEntry[]>) => (
  <IntersectionObserverProvider
    options={{ rootMargin: `-${HEADER_HEIGHT}px 0px 0px 0px` }}
  >
    <TocContext.Provider {...props} />
  </IntersectionObserverProvider>
);

export const useTocContext = (): {
  headings: HeadingEntry[];
} => {
  const context = useContext(TocContext);
  if (typeof context === 'undefined') {
    throw new Error('useTocContext must be used within a TocContextProvider');
  }
  return { headings: context };
};

export const Heading = (props: ComponentPropsWithoutRef<typeof _Heading>) => {
  const context = useContext(TocContext);
  if (typeof context === 'undefined') {
    throw new Error('Heading must be used within a TocContextProvider');
  }
  const { ref } = useObserve<HTMLHeadingElement>();
  return <_Heading ref={ref} {...props} />;
};

export const useIsActive = (id: string) => {
  const context = useContext(TocContext);
  if (typeof context === 'undefined') {
    throw new Error('useIsActive must be used within a TocContextProvider');
  }
  const entries = useEntries();

  const activeId = useMemo(() => {
    const intersectingIds = entries
      .filter(entry => entry.isIntersecting)
      .map(entry => entry.target.id);

    const findActiveId = (headings: HeadingEntry[]): string =>
      headings.reduce((activeId, heading) => {
        if (activeId) return activeId;
        if (intersectingIds.includes(heading.id)) return heading.id;
        return findActiveId(heading.items);
      }, '');

    return findActiveId(context);
  }, [context, entries]);

  return id === activeId;
};
