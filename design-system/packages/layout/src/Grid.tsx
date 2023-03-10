import { ReactNode } from 'react';

import { filterStyleProps, GridStyleProps } from '@voussoir/style';
import { forwardRefWithAs } from '@voussoir/utils/ts';

import { gridStyleProps, useGridStyleProps } from './resolvers';

export type GridProps = {
  children?: ReactNode;
} & GridStyleProps;

/**
 * A layout container using CSS grid. Voussoir dimension values provide
 * consistent sizing and spacing.
 */
export const Grid = forwardRefWithAs<GridProps, 'div'>(
  (props, forwardedRef) => {
    const { elementType: ElementType = 'div', children, ...otherProps } = props;
    const styleProps = useGridStyleProps(otherProps);

    return (
      <ElementType
        ref={forwardedRef}
        {...filterStyleProps(otherProps, Object.keys(gridStyleProps))}
        {...styleProps}
      >
        {children}
      </ElementType>
    );
  }
);
