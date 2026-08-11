import {
  Separator as AriaSeparator,
  type SeparatorProps as AriaSeparatorProps,
} from 'react-aria-components/Separator';

import { useSlotProps } from '@keystar/ui/slots';
import {
  ClassList,
  classNames,
  css,
  filterStyleProps,
  toDataAttributes,
  tokenSchema,
  useStyleProps,
} from '@keystar/ui/style';
import { DividerProps } from '@keystar/ui/types';
import { forwardRefWithAs } from '@keystar/ui/utils/ts';

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

    return (
      <AriaSeparator
        {...(filterStyleProps(otherProps, ['size']) as AriaSeparatorProps)}
        {...styleProps}
        {...toDataAttributes({ orientation, size })}
        elementType={Element as 'div' | 'hr'}
        orientation={orientation}
        ref={forwardedRef as never}
        className={classNames(
          dividerClassList.element('root'),
          css({
            alignSelf: 'stretch',
            backgroundColor: tokenSchema.color.border.neutral,
            borderRadius: 'var(--size)',

            '&[data-size=regular]': {
              '--size': tokenSchema.size.border.regular,
            },
            '&[data-size=medium]': { '--size': tokenSchema.size.border.medium },
            '&[data-size=large]': { '--size': tokenSchema.size.border.large },

            '&[data-orientation=horizontal]': { height: 'var(--size)' },
            '&[data-orientation=vertical]': { width: 'var(--size)' },
          }),
          styleProps.className
        )}
      />
    );
  }
);
