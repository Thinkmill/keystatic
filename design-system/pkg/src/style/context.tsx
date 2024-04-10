import { useLayoutEffect } from '@react-aria/utils';
import { typedEntries } from 'emery';
import React, { ProviderProps, useContext, useState } from 'react';

import {
  breakpoints,
  getResponsiveProp,
  getResponsiveRange,
} from './responsive';
import { Breakpoint, BreakpointRange, Responsive } from './types';

type BreakpointContextValue = Breakpoint[];

const BreakpointContext = React.createContext<BreakpointContextValue>([
  'mobile',
]);

export function BreakpointProvider(
  props: ProviderProps<BreakpointContextValue>
) {
  const { children, value } = props;
  return (
    <BreakpointContext.Provider value={value}>
      {children}
    </BreakpointContext.Provider>
  );
}

export function useBreakpoint() {
  return useContext(BreakpointContext);
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

export function useMatchedBreakpoints(): BreakpointContextValue {
  let supportsMatchMedia =
    typeof window !== 'undefined' && typeof window.matchMedia === 'function';
  let getMatchedBreakpoints = () => {
    let matched: Breakpoint[] = [];
    for (let i in breakpointQueries) {
      let query = breakpointQueries[i];
      if (window.matchMedia(query).matches) {
        matched.push(breakpointEntries[i][0]);
      }
    }
    matched.push('mobile');
    return matched;
  };
  let [breakpoint, setBreakpoint] = useState(() =>
    supportsMatchMedia ? getMatchedBreakpoints() : ['mobile' as const]
  );

  useLayoutEffect(() => {
    if (!supportsMatchMedia) {
      return;
    }

    const onResize = () => {
      const matched = getMatchedBreakpoints();
      setBreakpoint(prevMatched => {
        if (
          prevMatched.length !== matched.length ||
          prevMatched.some((breakpoint, idx) => breakpoint !== matched[idx])
        ) {
          return matched;
        }

        return prevMatched;
      });
    };
    onResize();

    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, [supportsMatchMedia]);

  return breakpoint;
}

export function useResponsiveRange() {
  let matchedBreakpoints = useBreakpoint();
  return function responsiveRange(range: BreakpointRange) {
    return getResponsiveRange(range, matchedBreakpoints);
  };
}
