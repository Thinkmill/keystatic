import { FocusRingProps, useFocusRing } from '@react-aria/focus';
import { mergeProps } from '@react-aria/utils';
import { Children, cloneElement } from 'react';

import { toDataAttributes } from './toDataAttributes';

/**
 * A utility component for styling interactions. Applies data-attributes to the
 * child element when it receives different types of focus.
 */
export function FocusRing(
  props: Omit<FocusRingProps, 'focusClass' | 'focusRingClass'>
) {
  let { children } = props;
  let { isFocused, isFocusVisible, focusProps } = useFocusRing(props);
  let child = Children.only(children);

  return cloneElement(
    child,
    mergeProps(child.props, {
      ...focusProps,
      ...toDataAttributes({
        focus: isFocusVisible
          ? 'visible'
          : props.within
          ? 'within'
          : isFocused || undefined,
      }),
    })
  );
}
