/* https://github.com/adobe/react-spectrum/blob/main/packages/%40react-spectrum/utils/src/useMediaQuery.ts */
import { useIsSSR } from '@react-aria/ssr';
import { useEffect, useState } from 'react';

/**
 * React hook that listens for matches to a given media query.
 * @example
 * let isBelowTablet = useMediaQuery('(max-width: 768px)');
 */
export function useMediaQuery(_query: string): boolean {
  const query = normalizeQuery(_query);

  let supportsMatchMedia =
    typeof window !== 'undefined' && typeof window.matchMedia === 'function';
  let [matches, setMatches] = useState(() =>
    supportsMatchMedia ? window.matchMedia(query).matches : false
  );

  useEffect(() => {
    if (!supportsMatchMedia) {
      return;
    }

    let mediaQueryList = window.matchMedia(query);
    let supportsEventListener =
      typeof mediaQueryList.addEventListener === 'function';

    let onChange = (evt: MediaQueryListEvent) => {
      setMatches(evt.matches);
    };

    if (supportsEventListener) {
      mediaQueryList.addEventListener('change', onChange);
    } else {
      mediaQueryList.addListener(onChange);
    }

    return () => {
      if (supportsEventListener) {
        mediaQueryList.removeEventListener('change', onChange);
      } else {
        mediaQueryList.removeListener(onChange);
      }
    };
  }, [supportsMatchMedia, query]);

  // If in SSR, the media query should never match. Once the page hydrates, this
  // will update and the real value will be returned.
  let isSSR = useIsSSR();
  return isSSR ? false : matches;
}

function normalizeQuery(query: string) {
  return query.replace(/^@media( ?)/m, '');
}
