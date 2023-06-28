import { useSeparator } from '@react-aria/separator';
import { filterDOMProps } from '@react-aria/utils';

import { useSlotProps } from '@voussoir/slots';
import { css, classNames, useStyleProps, tokenSchema } from '@voussoir/style';
import { DividerProps } from '@voussoir/types';
import { forwardRefWithAs } from '@voussoir/utils/ts';

/**
 * Dividers bring clarity to a layout by grouping and dividing content in close proximity.
 * They can also be used to establish rhythm and hierarchy.
 */
export const Divider = forwardRefWithAs<DividerProps, 'div'>(
  (props, forwardedRef) => {
    props = useSlotProps(props, 'divider');
    const {
      orientation = 'horizontal',
      elementType: Element = orientation === 'vertical' ? 'div' : 'hr',
      size = 'regular',
      ...otherProps
    } = props;

    const styleProps = useStyleProps(otherProps);

    let { separatorProps } = useSeparator({
      ...props,
      // FIXME: `forwardRefWithAs` yields `React.ElementType<any>` which is
      // incompatible with react-aria's expectations for `elementType`.
      elementType: Element as string,
    });

    return (
      <Element
        {...styleProps}
        {...separatorProps}
        {...filterDOMProps(otherProps, { propNames: new Set(['role']) })}
        ref={forwardedRef}
        className={classNames(
          `is-${orientation}`,
          `is-${size}`,
          css({
            alignSelf: 'stretch',
            backgroundColor: tokenSchema.color.border.neutral,
            borderRadius: 'var(--size)',

            '&.is-regular': { '--size': tokenSchema.size.border.regular },
            '&.is-medium': { '--size': tokenSchema.size.border.medium },
            '&.is-large': { '--size': tokenSchema.size.border.large },

            '&.is-horizontal': { blockSize: 'var(--size)' },
            '&.is-vertical': { inlineSize: 'var(--size)' },
          }),
          styleProps.className
        )}
      />
    );
  }
);
