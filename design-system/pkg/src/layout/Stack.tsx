import { ReactNode } from 'react';

import { filterStyleProps, FlexStyleProps } from '@keystar/ui/style';
import { forwardRefWithAs } from '@keystar/ui/utils/ts';

import { flexStyleProps, useFlexStyleProps } from './resolvers';

export type StackProps = {
  children?: ReactNode;
} & Omit<FlexStyleProps, 'direction' | 'inline' | 'wrap'>;

/** A thin wrapper around `Flex`, for stacking elements vertically. */
export const VStack = forwardRefWithAs<StackProps, 'div'>(
  (props, forwardedRef) => {
    const { elementType: ElementType = 'div', children, ...otherProps } = props;
    const styleProps = useFlexStyleProps({
      direction: 'column',
      ...otherProps,
    });

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

/** A thin wrapper around `Flex`, for stacking elements horizontally. */
export const HStack = forwardRefWithAs<StackProps, 'div'>(
  (props, forwardedRef) => {
    const { elementType: ElementType = 'div', children, ...otherProps } = props;
    const styleProps = useFlexStyleProps({
      direction: 'row',
      ...otherProps,
    });

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
