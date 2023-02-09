import React, {
  ProviderProps,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { typedEntries } from 'emery';
import { useIsSSR } from '@voussoir/ssr';

import {
  breakpoints,
  getResponsiveProp,
  getResponsiveRange,
} from './responsive';
import { Breakpoint, BreakpointRange, ResponsiveProp } from './types';
import { omit } from 'lodash';

type BreakpointContext = Breakpoint[];

const Context = React.createContext<BreakpointContext>(['mobile']);

export function BreakpointProvider(props: ProviderProps<BreakpointContext>) {
  const { children, value } = props;
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useBreakpoint(): BreakpointContext {
  return useContext(Context);
}
/**
 * The function returned from this hook will resolve values in a mobile-first
 * manner based on the breakpoint the browser viewport currently falls within
 * (mobile, tablet, desktop or wide).
 *
 * @caution The returned function returns `value.mobile` when rendering
 * server-side or statically, so you should avoid this hook where possible.
 * Responsive props and media queries are preferable in most cases.
 */
export function useResponsiveValue() {
  const bp = useBreakpoint();

  return function responsiveValue<T>(value: ResponsiveProp<T>): T {
    return getResponsiveProp(value, bp);
  };
}

// Utils
// ----------------------------------------------------------------------------

const breakpointEntries = typedEntries(omit(breakpoints, 'mobile')).sort(
  ([, valueA], [, valueB]) => valueB - valueA
);
const breakpointQueries = breakpointEntries.map(
  ([, value]) => `(min-width: ${value}px)`
);

export function useMatchedBreakpoints(): BreakpointContext {
  const supportsMatchMedia =
    typeof window !== 'undefined' && typeof window.matchMedia === 'function';

  const getBreakpointHandler = useCallback(() => {
    let matched: Breakpoint[] = [];
    for (let i in breakpointQueries) {
      let query = breakpointQueries[i];
      if (window.matchMedia(query).matches) {
        matched.push(breakpointEntries[i][0]);
      }
    }
    matched.push('mobile');
    return matched;
  }, []);

  const [breakpoint, setBreakpoint] = useState<BreakpointContext>(() =>
    supportsMatchMedia ? getBreakpointHandler() : ['mobile']
  );

  useEffect(() => {
    if (!supportsMatchMedia) {
      return;
    }

    const onResize = () => {
      const breakpointHandler = getBreakpointHandler();

      setBreakpoint(previousBreakpointHandler => {
        if (
          previousBreakpointHandler.length !== breakpointHandler.length ||
          previousBreakpointHandler.some(
            (breakpoint, idx) => breakpoint !== breakpointHandler[idx]
          )
        ) {
          return [...breakpointHandler]; // Return a new array to force state change
        }

        return previousBreakpointHandler;
      });
    };

    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, [getBreakpointHandler, supportsMatchMedia]);

  // If in SSR, the media query should never match. Once the page hydrates,
  // this will update and the real value will be returned.
  const isSSR = useIsSSR();
  return isSSR ? ['mobile'] : breakpoint;
}

export function useResponsiveRange() {
  let matchedBreakpoints = useBreakpoint();
  return function responsiveRange(range: BreakpointRange) {
    return getResponsiveRange(range, matchedBreakpoints);
  };
}
