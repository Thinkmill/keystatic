import { useLayoutEffect } from '@react-aria/utils';
import {
  Attributes,
  cloneElement,
  isValidElement,
  ReactElement,
  ReactNode,
  RefObject,
  useState,
} from 'react';

// TODO: replace instances of this with CSS `:has()` when it's supported
// https://developer.mozilla.org/en-US/docs/Web/CSS/:has
// https://caniuse.com/#feat=css-has
// https://bugzilla.mozilla.org/show_bug.cgi?id=418039
export function useHasChild(query: string, ref: RefObject<HTMLElement | null>) {
  let [hasChild, setHasChild] = useState(true);
  useLayoutEffect(() => {
    setHasChild(!!(ref.current && ref.current.querySelector(query)));
  }, [setHasChild, query, ref]);
  return hasChild;
}

/**
 * Clone a React element, with optional props. If the value is
 * not a valid React element, return null.
 */
export function cloneValidElement<Props>(
  child: ReactElement<Props> | ReactNode,
  props?: Partial<Props> & Attributes
) {
  if (!isValidElement(child)) {
    return null;
  }

  return cloneElement(child, props);
}
