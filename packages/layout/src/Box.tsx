import { ReactNode } from 'react';

import {
  BoxStyleProps,
  filterStyleProps,
  useStyleProps,
} from '@voussoir/style';
import { DOMProps } from '@voussoir/types';
import { forwardRefWithAs } from '@voussoir/utils/ts';

export type BoxProps = {
  children?: ReactNode;
} & DOMProps &
  BoxStyleProps;

/** Exposes a prop-based API for adding styles to a view, within the constraints of the theme. */
export const Box = forwardRefWithAs<BoxProps, 'div'>((props, forwardedRef) => {
  const { elementType: ElementType = 'div', children, ...otherProps } = props;
  const styleProps = useStyleProps(otherProps);

  return (
    <ElementType
      ref={forwardedRef}
      {...filterStyleProps(otherProps)}
      {...styleProps}
    >
      {children}
    </ElementType>
  );
});
