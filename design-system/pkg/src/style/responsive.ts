import { typedKeys } from 'emery';
import facepaint from 'facepaint';

import {
  Breakpoint,
  BreakpointRange,
  Responsive,
  ResponsiveProp,
  StyleResolver,
} from './types';
import { CSSObject } from '@emotion/css';

// Breakpoints
// ----------------------------------------------------------------------------

export const breakpoints: Record<Breakpoint, number> = {
  mobile: 0,
  tablet: 740,
  desktop: 992,
  wide: 1200,
};

// external stuff for composing responsive styles
const mediaAbove = (bp: number) => `@media (min-width: ${bp}px)`;
const mediaBelow = (bp: number) => `@media (max-width: ${bp - 1}px)`;
const containerAbove = (bp: number) => `@container (min-width: ${bp}px)`;
const containerBelow = (bp: number) => `@container (max-width: ${bp - 1}px)`;
export const breakpointQueries = {
  above: {
    mobile: mediaAbove(breakpoints.tablet),
    tablet: mediaAbove(breakpoints.desktop),
    desktop: mediaAbove(breakpoints.wide),
  },
  below: {
    tablet: mediaBelow(breakpoints.tablet),
    desktop: mediaBelow(breakpoints.desktop),
    wide: mediaBelow(breakpoints.wide),
  },
};
export const containerQueries = {
  above: {
    mobile: containerAbove(breakpoints.tablet),
    tablet: containerAbove(breakpoints.desktop),
    desktop: containerAbove(breakpoints.wide),
  },
  below: {
    tablet: containerBelow(breakpoints.tablet),
    desktop: containerBelow(breakpoints.desktop),
    wide: containerBelow(breakpoints.wide),
  },
};

// internal stuff, mostly for `useStyleProps` hook
const breakpointNames = typedKeys(breakpoints);
const { mobile: _mobile, ...breakpointsWithoutMobile } = breakpoints;
const mediaQueries = Object.values(breakpointsWithoutMobile).map(mediaAbove);
export const mapToMediaQueries: (...styles: CSSObject[]) => CSSObject[] =
  facepaint(mediaQueries);

// CSS Utils
// ----------------------------------------------------------------------------

export function mapResponsiveValue<Value>(
  propResolver: StyleResolver,
  value?: Responsive<Value>
) {
  if (value == null) {
    return null;
  }

  // NOTE: grid layout primitive supports array values
  if (typeof value === 'object' && !Array.isArray(value)) {
    return objectToArray(propResolver, value);
  }

  return propResolver(value);
}

function objectToArray<Value>(
  propResolver: StyleResolver,
  value: ResponsiveProp<Value>
) {
  const valueArray = [];

  for (let i = 0; i < breakpointNames.length; i++) {
    const key = breakpointNames[i];
    valueArray.push(value[key] != null ? propResolver(value[key]) : null);
  }

  return valueArray;
}

// JS Utils
// ----------------------------------------------------------------------------

export function getResponsiveProp<T>(
  prop: Responsive<T>,
  matchedBreakpoints: Breakpoint[]
): T {
  if (typeof prop === 'object' && prop !== null) {
    for (let i = 0; i < matchedBreakpoints.length; i++) {
      let value = (prop as any)[matchedBreakpoints[i]];
      if (value != null) {
        return value;
      }
    }
    // @ts-ignore FIXME
    return prop.mobile;
  }
  return prop;
}

export function getResponsiveRange(
  range: BreakpointRange,
  matchedBreakpoints: Breakpoint[]
): boolean {
  if (typeof range === 'boolean') {
    return range;
  }

  if (!('above' in range) && !('below' in range)) {
    return getResponsiveProp(range, matchedBreakpoints);
  }

  const startIndex =
    'above' in range ? breakpointNames.indexOf(range.above) + 1 : 0;
  const endIndex =
    'below' in range
      ? breakpointNames.indexOf(range.below) - 1
      : breakpointNames.length - 1;

  const prop: Responsive<boolean> = Object.fromEntries(
    breakpointNames.map((key, index) => {
      return [key, index >= startIndex && index <= endIndex];
    })
  );

  return getResponsiveProp(prop, matchedBreakpoints);
}
