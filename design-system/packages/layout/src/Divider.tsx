import { useSeparator } from '@react-aria/separator';
import { filterDOMProps } from '@react-aria/utils';

import { useSlotProps } from '@voussoir/slots';
import {
  ClassList,
  classNames,
  css,
  useStyleProps,
  tokenSchema,
} from '@voussoir/style';
import { DividerProps } from '@voussoir/types';
import { toDataAttributes } from '@voussoir/utils';
import { forwardRefWithAs } from '@voussoir/utils/ts';

export const dividerClassList = new ClassList('Divider');

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
        {...toDataAttributes({ orientation, size })}
        {...filterDOMProps(otherProps, { propNames: new Set(['role']) })}
        ref={forwardedRef}
        className={classNames(
          dividerClassList.root(),
          css({
            alignSelf: 'stretch',
            backgroundColor: tokenSchema.color.border.neutral,
            borderRadius: 'var(--size)',

            '&[data-size=regular]': {
              '--size': tokenSchema.size.border.regular,
            },
            '&[data-size=medium]': { '--size': tokenSchema.size.border.medium },
            '&[data-size=large]': { '--size': tokenSchema.size.border.large },

            '&[data-orientation=horizontal]': { blockSize: 'var(--size)' },
            '&[data-orientation=vertical]': { blockSize: 'var(--size)' },
          }),
          styleProps.className
        )}
      />
    );
  }
);
