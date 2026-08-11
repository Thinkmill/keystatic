import {
  Tag as AriaTag,
  type TagProps as AriaTagProps,
  type TagRenderProps,
} from 'react-aria-components/TagGroup';
import { Button } from 'react-aria-components/Button';
import { type ForwardedRef, type ReactNode, forwardRef, useMemo } from 'react';

import { Icon } from '@keystar/ui/icon';
import { xIcon } from '@keystar/ui/icon/icons/xIcon';
import { ClearSlots, SlotProvider } from '@keystar/ui/slots';
import {
  type BaseStyleProps,
  classNames,
  css,
  tokenSchema,
  transition,
  useStyleProps,
} from '@keystar/ui/style';
import { Text } from '@keystar/ui/typography';
import { isReactText } from '@keystar/ui/utils';

import { gapVar, heightVar } from './styles';

export interface TagProps
  extends Omit<AriaTagProps, 'className' | 'style'>,
    BaseStyleProps {}

function TagImpl(props: TagProps, forwardedRef: ForwardedRef<HTMLDivElement>) {
  let { children, ...otherProps } = props;
  let styleProps = useStyleProps(props);
  let slots = useMemo(
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

  return (
    <AriaTag
      {...otherProps}
      {...styleProps}
      ref={forwardedRef}
      className={classNames(
        css({
          alignItems: 'center',
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

          '&[data-href][data-hovered]': {
            backgroundColor: tokenSchema.color.alias.backgroundHovered,
            borderColor: tokenSchema.color.alias.borderHovered,
            color: tokenSchema.color.alias.foregroundHovered,
          },
          '&[data-focus-visible]': {
            outlineColor: tokenSchema.color.alias.focusRing,
            outlineWidth: tokenSchema.size.alias.focusRing,
            outlineOffset: `calc(${tokenSchema.size.border.regular} * -1)`,
          },
        }),
        styleProps.className
      )}
    >
      {states => (
        <SlotProvider slots={slots}>
          {renderChildren(children, states)}
          <ClearSlots>
            {states.allowsRemoving && (
              <Button
                slot="remove"
                aria-label="Remove"
                className={css({
                  alignItems: 'center',
                  background: 'none',
                  border: 0,
                  color: 'inherit',
                  display: 'inline-flex',
                  justifyContent: 'center',
                  marginInlineStart: `calc(${tokenSchema.size.space.regular} * -1)`,
                  padding: 0,
                  height: heightVar,
                  width: heightVar,
                })}
              >
                <Icon src={xIcon} size="small" />
              </Button>
            )}
          </ClearSlots>
        </SlotProvider>
      )}
    </AriaTag>
  );
}

export const Tag = forwardRef(TagImpl);

function renderChildren(
  children: AriaTagProps['children'],
  states: TagRenderProps
): ReactNode {
  let content =
    typeof children === 'function'
      ? (children as (states: TagRenderProps) => ReactNode)(states)
      : children;
  return isReactText(content) ? <Text>{content}</Text> : content;
}
