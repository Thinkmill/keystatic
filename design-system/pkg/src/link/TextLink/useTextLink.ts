import { useFocusRing } from '@react-aria/focus';
import { useHover } from '@react-aria/interactions';
import { mergeProps } from '@react-aria/utils';
import { Fragment } from 'react';

import {
  classNames,
  css,
  toDataAttributes,
  tokenSchema,
} from '@keystar/ui/style';
import {
  Text,
  useHeadingContext,
  useTextContext,
} from '@keystar/ui/typography';

import { TextLinkButtonProps } from './types';

export function useTextLink({
  autoFocus,
  prominence = 'default',
}: TextLinkButtonProps) {
  const headingContext = useHeadingContext();
  const textContext = useTextContext();

  const { focusProps, isFocusVisible } = useFocusRing({ autoFocus });
  const { hoverProps, isHovered } = useHover({});

  const dataOptions = {
    prominence,
    hover: isHovered ? 'true' : undefined,
    focus: isFocusVisible ? 'visible' : undefined,
  };

  return {
    ...mergeProps(hoverProps, focusProps),
    ...toDataAttributes(dataOptions),
    Wrapper: !textContext && !headingContext ? Text : Fragment,
    className: classNames(
      css({
        color: tokenSchema.color.foreground.neutral,
        cursor: 'pointer',
        outline: 0,
        textDecoration: 'underline',
        textDecorationColor: tokenSchema.color.border.emphasis,
        textDecorationThickness: tokenSchema.size.border.regular,
        textUnderlineOffset: tokenSchema.size.border.medium,

        '&[data-hover="true"], &[data-focus="visible"]': {
          color: tokenSchema.color.foreground.neutralEmphasis,
          textDecorationColor: tokenSchema.color.foreground.neutral,
        },
        '&[data-focus="visible"]': {
          textDecorationStyle: 'double',
        },

        '&[data-prominence="high"]': {
          color: tokenSchema.color.foreground.accent,
          textDecorationColor: tokenSchema.color.border.accent,

          '&[data-hover="true"], &[data-focus="visible"]': {
            textDecorationColor: tokenSchema.color.foreground.accent,
          },
        },
      })
    ),
  };
}
