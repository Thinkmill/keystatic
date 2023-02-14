import { CSSProperties, HTMLAttributes } from 'react';
import { warning } from 'emery';
import { css } from '@emotion/css';

import { defaultStyleProps } from './resolvers';
import {
  mapToMediaQueries,
  mapResponsiveValue,
  getResponsiveRange,
} from './responsive';
import { BaseStyleProps, BoxStyleProps, StyleResolverMap } from './types';
import { classNames } from './classNames';
import { useBreakpoint } from './context';

// Convert
// ----------------------------------------------------------------------------

export function convertStyleProps<T extends BaseStyleProps>(
  props: T,
  propResolvers: StyleResolverMap
): CSSProperties {
  // FIXME: is there a better way to do this?
  // delcaring `style` as `CSSProperties` yields the following error when assigning properties:
  // "Expression produces a union type that is too complex to represent"
  let style: any = {};
  for (let key in props) {
    let styleProp = propResolvers[key];
    if (!styleProp || props[key] == null) {
      continue;
    }

    let [name, convert] = styleProp;

    let value = mapResponsiveValue(convert, props[key]);
    if (Array.isArray(name)) {
      for (let k of name) {
        style[k] = value;
      }
    } else {
      style[name] = value;
    }
  }

  return style;
}

// Use
// ----------------------------------------------------------------------------

export function useStyleProps<T extends BoxStyleProps>(
  props: T,
  customResolvers: StyleResolverMap = {}
): Pick<HTMLAttributes<HTMLElement>, 'className' | 'hidden' | 'style'> {
  let propResolvers = { ...defaultStyleProps, ...customResolvers };
  let { isHidden, UNSAFE_className, UNSAFE_style, ...otherProps } = props;

  let matchedBreakpoints = useBreakpoint();
  // @ts-ignore FIXME: One or more of the propResolvers' signature breaks the type contract.
  let convertedProps = convertStyleProps(props, propResolvers);
  let resolvedStyles = mapToMediaQueries(convertedProps);

  warning(
    // @ts-ignore
    !otherProps.className,
    'The className prop is unsafe and is unsupported. ' +
      'Please use style props, or UNSAFE_className if you absolutely must do something custom. ' +
      'Note that this may break in future versions due to DOM structure changes.'
  );

  warning(
    // @ts-ignore
    !otherProps.style,
    'The style prop is unsafe and is unsupported. ' +
      'Please use style props, or UNSAFE_style if you absolutely must do something custom. ' +
      'Note that this may break in future versions due to DOM structure changes.'
  );

  let hidden;
  const style = UNSAFE_style ?? {};
  if (isHidden && getResponsiveRange(isHidden, matchedBreakpoints)) {
    hidden = true;
    style.display = 'none';
  }

  return {
    hidden,
    className: classNames(css(resolvedStyles), UNSAFE_className),
    style,
  };
}
