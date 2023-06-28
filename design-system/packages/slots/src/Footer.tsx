import { ReactNode } from 'react';
import { DOMProps } from '@react-types/shared';

import { BaseStyleProps, useStyleProps } from '@voussoir/style';
import { filterDOMProps } from '@voussoir/utils';
import { forwardRefWithAs } from '@voussoir/utils/ts';

import { useSlotProps } from './context';

type FooterProps = {
  /**
   * The footer element(s).
   */
  children: ReactNode;
} & BaseStyleProps &
  DOMProps;

/** A footer within a container. */
export const Footer = forwardRefWithAs<FooterProps, 'footer'>((props, ref) => {
  props = useSlotProps(props, 'footer');
  let { elementType: Element = 'footer', children, ...otherProps } = props;
  let styleProps = useStyleProps(otherProps);

  return (
    <Element {...filterDOMProps(otherProps)} {...styleProps} ref={ref}>
      {children}
    </Element>
  );
});
