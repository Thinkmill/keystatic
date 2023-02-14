import { typedKeys } from 'emery';
import facepaint from 'facepaint';
import { isObject, omit } from 'lodash';

import {
  Breakpoint,
  BreakpointRange,
  Responsive,
  ResponsiveProp,
  StyleResolver,
} from './types';

// Breakpoints
// ----------------------------------------------------------------------------

export const breakpoints: Record<Breakpoint, number> = {
  mobile: 0,
  tablet: 768,
  desktop: 1280,
  wide: 1768,
};

// external stuff for composing responsive styles
const above = (bp: number) => `@media (min-width: ${bp}px)`;
const below = (bp: number) => `@media (max-width: ${bp - 1}px)`;
export const breakpointQueries = {
  above: {
    mobile: above(breakpoints.tablet),
    tablet: above(breakpoints.desktop),
    desktop: above(breakpoints.wide),
  },
  below: {
    tablet: below(breakpoints.tablet),
    desktop: below(breakpoints.desktop),
    wide: below(breakpoints.wide),
  },
};

// internal stuff, mostly for `useStyleProps` hook
const breakpointNames = typedKeys(breakpoints);
const mediaQueries = Object.values(omit(breakpoints, 'mobile')).map(above);
export const mapToMediaQueries = facepaint(mediaQueries);

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
  if (isObject(prop)) {
    for (let i = 0; i < matchedBreakpoints.length; i++) {
      let value = prop[matchedBreakpoints[i]];
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
