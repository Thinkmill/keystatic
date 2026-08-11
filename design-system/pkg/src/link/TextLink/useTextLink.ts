import { Fragment } from 'react';

import { classNames, css, tokenSchema } from '@keystar/ui/style';
import {
  Text,
  useHeadingContext,
  useTextContext,
} from '@keystar/ui/typography';

export function useTextLink() {
  const headingContext = useHeadingContext();
  const textContext = useTextContext();

  return {
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

        '&[data-hovered], &[data-focus-visible], &:hover, &:focus-visible': {
          color: tokenSchema.color.foreground.neutralEmphasis,
          textDecorationColor: tokenSchema.color.foreground.neutral,
        },
        '&[data-focus-visible], &:focus-visible': {
          textDecorationStyle: 'double',
        },

        '&[data-prominence="high"]': {
          color: tokenSchema.color.foreground.accent,
          textDecorationColor: tokenSchema.color.border.accent,

          '&[data-hovered], &[data-focus-visible], &:hover, &:focus-visible': {
            textDecorationColor: tokenSchema.color.foreground.accent,
          },
        },
      })
    ),
  };
}
