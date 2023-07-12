import { ReactNode } from 'react';

import { filterStyleProps, GridStyleProps } from '@keystar/ui/style';
import { forwardRefWithAs } from '@keystar/ui/utils/ts';

import { gridStyleProps, useGridStyleProps } from './resolvers';

export type GridProps = {
  children?: ReactNode;
} & GridStyleProps;

/**
 * A layout container using CSS grid. Keystar UI dimension values provide
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
