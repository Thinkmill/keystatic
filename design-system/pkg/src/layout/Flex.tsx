import { ReactNode } from 'react';

import { filterStyleProps, FlexStyleProps } from '@keystar/ui/style';
import { forwardRefWithAs } from '@keystar/ui/utils/ts';

import { flexStyleProps, useFlexStyleProps } from './resolvers';

export type FlexProps = {
  children?: ReactNode;
} & FlexStyleProps;

/**
 * A layout container CSS flex. Keystar UI dimension values provide
 * consistent spacing between items.
 */
export const Flex = forwardRefWithAs<FlexProps, 'div'>(
  (props, forwardedRef) => {
    const { elementType: ElementType = 'div', children, ...otherProps } = props;
    const styleProps = useFlexStyleProps(otherProps);

    return (
      <ElementType
        ref={forwardedRef}
        {...filterStyleProps(otherProps, Object.keys(flexStyleProps))}
        {...styleProps}
      >
        {children}
      </ElementType>
    );
  }
);
