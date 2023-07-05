import { filterDOMProps } from '@react-aria/utils';
import { DOMProps } from '@react-types/shared';
import { ReactNode } from 'react';

import { BaseStyleProps, useStyleProps } from '@keystar/ui/style';
import { forwardRefWithAs } from '@keystar/ui/utils/ts';

import { useSlotProps } from './context';

type HeaderProps = {
  /**
   * The header element(s).
   */
  children: ReactNode;
} & BaseStyleProps &
  DOMProps;

/** A header within a container. */
export const Header = forwardRefWithAs<HeaderProps, 'header'>((props, ref) => {
  props = useSlotProps(props, 'header');
  let { elementType: Element = 'header', children, ...otherProps } = props;
  let styleProps = useStyleProps(otherProps);

  return (
    <Element {...filterDOMProps(otherProps)} {...styleProps} ref={ref}>
      {children}
    </Element>
  );
});
