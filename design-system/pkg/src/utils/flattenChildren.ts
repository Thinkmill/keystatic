import { ReactNode, isValidElement } from 'react';
import _flattenChildren from 'react-keyed-flatten-children';

export function flattenChildren(children: ReactNode) {
  return _flattenChildren(children);
}

export function flattenElements(children: ReactNode) {
  return _flattenChildren(children).filter(isValidElement);
}
