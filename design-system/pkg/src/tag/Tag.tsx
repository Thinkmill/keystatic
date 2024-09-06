import React, { useMemo, useRef } from 'react';
import { useFocusRing } from '@react-aria/focus';
import { useHover } from '@react-aria/interactions';
import { useLink } from '@react-aria/link';
import { type AriaTagProps, useTag } from '@react-aria/tag';
import { mergeProps } from '@react-aria/utils';
import type { ListState } from '@react-stately/list';

import { ClearButton } from '@keystar/ui/button';
import { ClearSlots, SlotProvider } from '@keystar/ui/slots';
import {
  classNames,
  css,
  toDataAttributes,
  tokenSchema,
  transition,
  useStyleProps,
} from '@keystar/ui/style';
import { Text } from '@keystar/ui/typography';
import { isReactText } from '@keystar/ui/utils';
import { gapVar, heightVar } from './styles';

export interface TagProps<T> extends AriaTagProps<T> {
  state: ListState<T>;
}

/** @private Internal use only: rendered via `Item` by consumer. */
export function Tag<T>(props: TagProps<T>) {
  const { item, state, ...otherProps } = props;

  let styleProps = useStyleProps(otherProps);
  let { hoverProps, isHovered } = useHover({});
  let { isFocused, isFocusVisible, focusProps } = useFocusRing({
    within: true,
  });
  let domRef = useRef<HTMLDivElement>(null);
  let linkRef = useRef<HTMLAnchorElement>(null);
  let {
    removeButtonProps,
    gridCellProps,
    rowProps,
    allowsRemoving: isRemovable,
  } = useTag(stripSyntheticLinkProps({ ...props, item }), state, domRef);
  const slots = useMemo(
    () =>
      ({
        avatar: {
          UNSAFE_className: css({
            marginInlineStart: tokenSchema.size.space.regular,
          }),
          size: 'xsmall',
        },
        icon: {
          UNSAFE_className: css({
            marginInlineStart: tokenSchema.size.space.regular,
          }),
          size: 'small',
        },
        text: {
          color: 'inherit',
          size: 'small',
          truncate: true,
          trim: false,
          UNSAFE_className: css({
            display: 'block',
            paddingInline: tokenSchema.size.space.regular,
          }),
        },
      }) as const,
    []
  );

  const isLink = 'href' in item.props;
  const { linkProps } = useLink(item.props, linkRef);
  const contents = isReactText(item.rendered) ? (
    <Text>{item.rendered}</Text>
  ) : (
    item.rendered
  );

  return (
    <div
      {...mergeProps(rowProps, hoverProps, focusProps)}
      {...toDataAttributes(
        {
          isFocused,
          isFocusVisible,
          isHovered,
          isLink,
          isRemovable,
        },
        {
          omitFalsyValues: true,
          trimBooleanKeys: true,
        }
      )}
      className={classNames(
        css({
          backgroundColor: tokenSchema.color.alias.backgroundIdle,
          border: `${tokenSchema.size.border.regular} solid ${tokenSchema.color.alias.borderIdle}`,
          borderRadius: tokenSchema.size.radius.small,
          color: tokenSchema.color.alias.foregroundIdle,
          cursor: 'default',
          display: 'inline-flex',
          height: heightVar,
          margin: `calc(${gapVar} / 2)`,
          maxInlineSize: '100%',
          outline: `0 solid transparent`,
          position: 'relative',
          transition: transition(['outline-color', 'outline-width'], {
            duration: 'short',
          }),
          userSelect: 'none',

          '&[data-href]': {
            cursor: 'pointer',

            '&[data-hovered]': {
              backgroundColor: tokenSchema.color.alias.backgroundHovered,
              borderColor: tokenSchema.color.alias.borderHovered,
              color: tokenSchema.color.alias.foregroundHovered,
            },
          },

          '&[data-focus-visible]': {
            outlineColor: tokenSchema.color.alias.focusRing,
            outlineWidth: tokenSchema.size.alias.focusRing,
            outlineOffset: `calc(${tokenSchema.size.border.regular} * -1)`,
          },
        }),
        styleProps.className
      )}
      ref={domRef}
    >
      <div
        className={css({ alignItems: 'center', display: 'flex' })}
        {...gridCellProps}
      >
        <SlotProvider slots={slots}>
          {/* TODO: review accessibility */}
          {isLink ? (
            <a
              {...linkProps}
              tabIndex={-1}
              ref={linkRef}
              className={css({
                color: 'inherit',
                outline: 'none',
                textDecoration: 'none',

                '&::before': { content: '""', inset: 0, position: 'absolute' },
              })}
            >
              {contents}
            </a>
          ) : (
            contents
          )}

          <ClearSlots>
            {isRemovable && (
              <ClearButton
                {...removeButtonProps}
                UNSAFE_className={css({
                  marginInlineStart: `calc(${tokenSchema.size.space.regular} * -1)`,
                  height: heightVar,
                  width: heightVar,
                })}
              />
            )}
          </ClearSlots>
        </SlotProvider>
      </div>
    </div>
  );
}

const SYNTHETIC_LINK_ATTRS = new Set([
  'data-download',
  'data-href',
  'data-ping',
  'data-referrer-policy',
  'data-rel',
  'data-target',
]);

/**
 * Circumvent react-aria synthetic link and implement real anchor, so users can
 * right-click and open in new tab, etc.
 */
function stripSyntheticLinkProps<T>(props: any): AriaTagProps<T> {
  const safeProps = { ...props };
  for (const attr of SYNTHETIC_LINK_ATTRS) {
    delete safeProps[attr];
  }
  return safeProps;
}
