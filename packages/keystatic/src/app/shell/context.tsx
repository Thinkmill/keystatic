import { breakpoints } from '@keystar/ui/style';
import { useResizeObserver } from '@react-aria/utils';
import { RefObject, createContext, useContext, useState } from 'react';

import { Config } from '../../config';

// Config context
// -----------------------------------------------------------------------------

export const ConfigContext = createContext<Config | null>(null);

export function useConfig(): Config {
  const config = useContext(ConfigContext);
  if (!config) {
    throw new Error('ConfigContext.Provider not found');
  }
  return config;
}

// Meta context
// -----------------------------------------------------------------------------

type AppStateType = { basePath: string };

export const AppStateContext = createContext<AppStateType>({
  basePath: '/keystatic',
});

export function useAppState() {
  const appState = useContext(AppStateContext);
  if (!appState) {
    throw new Error('AppStateContext.Provider not found');
  }
  return appState;
}

// Page context
// -----------------------------------------------------------------------------

type ContentSize = keyof typeof breakpoints;
type AboveSize = Exclude<ContentSize, 'wide'>;
type BelowSize = Exclude<ContentSize, 'mobile'>;
type QueryOptions =
  | { above: AboveSize; below: BelowSize }
  | { above: AboveSize }
  | { below: BelowSize };

const ContentPanelContext = createContext<ContentSize>('mobile');
export const ContentPanelProvider = ContentPanelContext.Provider;

export function useContentPanelSize() {
  return useContext(ContentPanelContext);
}
export function useContentPanelQuery(options: QueryOptions) {
  const sizes = ['mobile', 'tablet', 'desktop', 'wide'];
  const size = useContentPanelSize();

  const startIndex = 'above' in options ? sizes.indexOf(options.above) + 1 : 0;
  const endIndex =
    'below' in options ? sizes.indexOf(options.below) - 1 : sizes.length - 1;
  const range = sizes.slice(startIndex, endIndex + 1);

  return range.includes(size);
}

/** @private only used to initialize context */
export function useContentPanelState(ref: RefObject<HTMLElement | null>) {
  let [contentSize, setContentSize] = useState<ContentSize>('mobile');

  const onResize = () => {
    setContentSize(size => {
      let contentPane = ref.current;
      if (!contentPane) {
        return size;
      }
      if (contentPane.offsetWidth >= breakpoints.wide) {
        return 'wide';
      }
      if (contentPane.offsetWidth >= breakpoints.desktop) {
        return 'desktop';
      }
      if (contentPane.offsetWidth >= breakpoints.tablet) {
        return 'tablet';
      }
      return 'mobile';
    });
  };

  useResizeObserver({ ref, onResize });

  return contentSize;
}
