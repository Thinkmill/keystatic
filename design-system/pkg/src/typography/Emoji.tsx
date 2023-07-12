import { filterDOMProps } from '@react-aria/utils';
import { DOMProps } from '@react-types/shared';
import {
  ForwardedRef,
  forwardRef,
  ForwardRefExoticComponent,
  Ref,
} from 'react';

import { BaseStyleProps, useStyleProps } from '@keystar/ui/style';

export type EmojiProps = {
  /** Label used to describe the symbol that will be announced to screen readers. */
  label?: string;
  /** Emoji symbol. */
  symbol: string;
} & BaseStyleProps &
  DOMProps;

/**
 * A utility component for displaying emoji characters accessibly. Emojis can
 * add playfulness to your interface, but require formatting to ensure that they
 * are accessible for all users.
 */
export const Emoji: ForwardRefExoticComponent<
  EmojiProps & { ref?: Ref<HTMLSpanElement> }
> = forwardRef(function Emoji(
  props: EmojiProps,
  forwardedRef: ForwardedRef<HTMLSpanElement>
) {
  const { label, symbol, ...otherProps } = props;
  const styleProps = useStyleProps(otherProps);
  return (
    <span
      aria-hidden={label ? undefined : true}
      aria-label={label}
      ref={forwardedRef}
      role="img"
      {...styleProps}
      {...filterDOMProps(otherProps)}
    >
      {symbol}
    </span>
  );
});
