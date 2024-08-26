import { filterDOMProps, useObjectRef } from '@react-aria/utils';
import { useLink } from '@react-aria/link';
import { DOMProps } from '@react-types/shared';
import { forwardRef, ReactNode, useMemo } from 'react';

import { SlotProvider } from '@keystar/ui/slots';
import {
  FocusRing,
  classNames,
  css,
  tokenSchema,
  transition,
} from '@keystar/ui/style';
import { Text } from '@keystar/ui/typography';
import { isReactText } from '@keystar/ui/utils';

import { itemIndicatorGutter, itemIndicatorWidth } from './constants';

export type NavItemProps = {
  /**
   * Indicate which item represents the current item. Typically "page" will be
   * the appropriate value. See
   * [MDN](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-current).
   */
  'aria-current'?: boolean | 'page' | 'step' | 'location' | 'date' | 'time';
  /** The content of the nav item. */
  children: ReactNode;
  /** The URL that the hyperlink points to. */
  href: string;
} & DOMProps;

// TODO:
// - generic `Item` slot component
// - collection/virtualized?

/** An item within a `NavList`. */
export const NavItem = forwardRef<HTMLAnchorElement, NavItemProps>(
  function NavItem(props, forwardedRef) {
    const {
      'aria-current': ariaCurrent,
      children,
      href,
      ...otherProps
    } = props;
    const styles = useStyles();
    const domRef = useObjectRef(forwardedRef);
    const { linkProps } = useLink(props, domRef);

    const slots = useMemo(
      () => ({
        text: { color: 'inherit', UNSAFE_className: styles.text } as const,
      }),
      [styles.text]
    );

    return (
      <li>
        <FocusRing>
          <a
            ref={domRef}
            aria-current={ariaCurrent}
            href={href}
            className={classNames(styles.anchor)}
            {...linkProps}
            {...filterDOMProps(otherProps)}
          >
            <div className={classNames(styles.content)}>
              <SlotProvider slots={slots}>
                {isReactText(children) ? <Text>{children}</Text> : children}
              </SlotProvider>
            </div>
          </a>
        </FocusRing>
      </li>
    );
  }
);

// Styles
// ------------------------------

function useStyles() {
  const ringColor = tokenSchema.color.alias.focusRing;
  const ringWidth = tokenSchema.size.alias.focusRing;

  const anchor = css({
    color: tokenSchema.color.foreground.neutral,
    display: 'flex',
    gap: itemIndicatorGutter,
    paddingBlock: tokenSchema.size.space.xsmall,
    outline: 0,

    // selected indicator
    '&::before': {
      borderRadius: itemIndicatorWidth,
      content: '""',
      insetInlineStart: tokenSchema.size.space.xsmall,
      marginBlock: tokenSchema.size.space.xsmall,
      position: 'relative',
      width: itemIndicatorWidth,
    },

    // interaction
    '&:hover': {
      color: tokenSchema.color.foreground.neutralEmphasis,
    },

    // selection
    '&[aria-current]:not([aria-current=false])': {
      color: tokenSchema.color.foreground.neutralEmphasis,

      '&::before': {
        backgroundColor: tokenSchema.color.background.accentEmphasis,
      },
    },
  });

  const content = css({
    alignItems: 'center',
    borderRadius: tokenSchema.size.radius.regular,
    display: 'flex',
    flex: 1,
    flexShrink: 0,
    gap: tokenSchema.size.space.regular,
    minHeight: tokenSchema.size.element.regular,
    minWidth: 0,
    paddingInline: tokenSchema.size.space.medium,
    paddingBlock: tokenSchema.size.space.small,
    position: 'relative',

    // focus ring
    [`&::after`]: {
      borderRadius: tokenSchema.size.radius.regular,
      content: '""',
      insetBlock: 1,
      insetInline: -1,
      margin: 1,
      position: 'absolute',
      transition: transition(['box-shadow', 'margin'], {
        easing: 'easeOut',
      }),
    },
    [`.${anchor}[data-focus=visible] &::after`]: {
      boxShadow: `0 0 0 ${ringWidth} ${ringColor}`,
      margin: 0,
    },

    [`.${anchor}[aria-current]:not([aria-current=false]) &`]: {
      backgroundColor: tokenSchema.color.alias.backgroundHovered,
    },

    [`.${anchor}:hover &`]: {
      backgroundColor: tokenSchema.color.alias.backgroundHovered,
    },
    [`.${anchor}:active &`]: {
      backgroundColor: tokenSchema.color.alias.backgroundPressed,
    },
  });

  const text = css({
    fontWeight: tokenSchema.typography.fontWeight.regular,

    [`.${anchor}[aria-current]:not([aria-current=false]) &`]: {
      fontWeight: tokenSchema.typography.fontWeight.medium,
    },
  });

  return { anchor, content, text };
}
