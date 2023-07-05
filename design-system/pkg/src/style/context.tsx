import React, {
  ProviderProps,
  useContext,
  useLayoutEffect,
  useState,
} from 'react';
import { typedEntries } from 'emery';

import {
  breakpoints,
  getResponsiveProp,
  getResponsiveRange,
} from './responsive';
import { Breakpoint, BreakpointRange, Responsive } from './types';

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

  return function responsiveValue<T>(value: Responsive<T>): T {
    return getResponsiveProp(value, bp);
  };
}

// Utils
// ----------------------------------------------------------------------------

const { mobile: _mobile, ...breakpointsWithoutMobile } = breakpoints;
const breakpointEntries = typedEntries(breakpointsWithoutMobile).sort(
  ([, valueA], [, valueB]) => valueB - valueA
);
const breakpointQueries = breakpointEntries.map(
  ([, value]) => `(min-width: ${value}px)`
);

const useLayoutEffectIgnoreOnServer: typeof useLayoutEffect =
  typeof window === 'undefined' ? () => {} : useLayoutEffect;

const supportsMatchMedia =
  typeof window !== 'undefined' && typeof window.matchMedia === 'function';

export function useMatchedBreakpoints(): BreakpointContext {
  const [breakpoint, setBreakpoint] = useState<BreakpointContext>(() => [
    'mobile',
  ]);

  useLayoutEffectIgnoreOnServer(() => {
    if (!supportsMatchMedia) {
      return;
    }

    const onResize = () => {
      setBreakpoint(prevMatchedBreakpoints => {
        const matched: Breakpoint[] = [];
        for (let i in breakpointQueries) {
          let query = breakpointQueries[i];
          if (window.matchMedia(query).matches) {
            matched.push(breakpointEntries[i][0]);
          }
        }
        matched.push('mobile');

        if (
          prevMatchedBreakpoints.length !== matched.length ||
          prevMatchedBreakpoints.some(
            (breakpoint, idx) => breakpoint !== matched[idx]
          )
        ) {
          return matched;
        }

        return prevMatchedBreakpoints;
      });
    };
    onResize();

    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return breakpoint;
}

export function useResponsiveRange() {
  let matchedBreakpoints = useBreakpoint();
  return function responsiveRange(range: BreakpointRange) {
    return getResponsiveRange(range, matchedBreakpoints);
  };
}
