import { HTMLAttributes } from 'react';
import { defaultStyleProps } from './resolvers';

const defaultStyleKeys = Object.keys(defaultStyleProps);

/**
 * Filters out style props.
 * @param props - The component props to be filtered.
 * @param otherPropNames - An array of other style property names that should be omitted.
 */
export function filterStyleProps<Props extends {}>(
  props: Props,
  otherPropNames: string[] = []
): HTMLAttributes<HTMLElement> {
  let filteredProps: any = {};
  let omit = new Set([
    'isHidden',
    'UNSAFE_className',
    'UNSAFE_style',
    ...defaultStyleKeys,
    ...otherPropNames,
  ]);

  for (const prop in props) {
    if (Object.prototype.hasOwnProperty.call(props, prop) && !omit.has(prop)) {
      filteredProps[prop] = props[prop];
    }
  }

  return filteredProps;
}
