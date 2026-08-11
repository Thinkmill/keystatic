import {
  Tree as AriaTree,
  TreeHeader,
  TreeItem as AriaTreeItem,
  TreeItemContent,
  TreeSection as AriaTreeSection,
  type TreeItemRenderProps,
} from 'react-aria-components/Tree';
import { useLocale } from 'react-aria-components';
import {
  type CSSProperties,
  type ForwardedRef,
  type ReactElement,
  type ReactNode,
  forwardRef,
} from 'react';

import { Icon } from '@keystar/ui/icon';
import { chevronLeftIcon } from '@keystar/ui/icon/icons/chevronLeftIcon';
import { chevronRightIcon } from '@keystar/ui/icon/icons/chevronRightIcon';
import { dotIcon } from '@keystar/ui/icon/icons/dotIcon';
import { SlotProvider } from '@keystar/ui/slots';
import { classNames, css, tokenSchema, useStyleProps } from '@keystar/ui/style';
import { Text } from '@keystar/ui/typography';

import type {
  NavTreeItemProps,
  NavTreeProps,
  NavTreeSectionProps,
} from './types';

function NavTree<T extends object>(
  props: NavTreeProps<T>,
  forwardedRef: ForwardedRef<HTMLDivElement>
) {
  let styleProps = useStyleProps(props);
  return (
    <AriaTree
      {...props}
      {...styleProps}
      ref={forwardedRef}
      className={classNames(css({ outline: 'none' }), styleProps.className)}
    />
  );
}

const _NavTree = forwardRef(NavTree) as <T extends object>(
  props: NavTreeProps<T> & { ref?: ForwardedRef<HTMLDivElement> }
) => ReactElement;
export { _NavTree as NavTree };

function NavTreeItem<T extends object>(
  props: NavTreeItemProps<T>,
  forwardedRef: ForwardedRef<HTMLDivElement>
) {
  let styleProps = useStyleProps(props);
  return (
    <AriaTreeItem
      {...props}
      {...styleProps}
      ref={forwardedRef}
      className={classNames(
        css({
          color: tokenSchema.color.alias.foregroundIdle,
          cursor: 'default',
          fontWeight: tokenSchema.typography.fontWeight.medium,
          outline: 'none',
          position: 'relative',
        }),
        styleProps.className
      )}
    />
  );
}

const _NavTreeItem = forwardRef(NavTreeItem) as <T extends object = object>(
  props: NavTreeItemProps<T> & { ref?: ForwardedRef<HTMLDivElement> }
) => ReactElement;
export { _NavTreeItem as NavTreeItem };

export function NavTreeItemContent({
  children,
}: {
  children: ReactNode | ((states: TreeItemRenderProps) => ReactNode);
}) {
  let { direction } = useLocale();
  return (
    <TreeItemContent>
      {states => (
        <SlotProvider
          slots={{
            button: {
              elementType: 'span',
              marginStart: 'auto',
              prominence: 'low',
            },
            text: { color: 'inherit', truncate: true, weight: 'inherit' },
          }}
        >
          <div
            className={css({
              alignItems: 'center',
              borderRadius: tokenSchema.size.radius.regular,
              display: 'flex',
              gap: tokenSchema.size.space.small,
              minHeight: tokenSchema.size.element.regular,
              paddingInlineStart: `calc(${tokenSchema.size.space.regular} * var(--tree-level))`,

              '[data-hovered] > &': {
                backgroundColor: tokenSchema.color.alias.backgroundHovered,
              },
              '[data-pressed] > &': {
                backgroundColor: tokenSchema.color.alias.backgroundPressed,
              },
              '[data-focus-visible] > &': {
                outline: `${tokenSchema.size.alias.focusRing} solid ${tokenSchema.color.alias.focusRing}`,
              },
              '[data-selected] > &': {
                backgroundColor: tokenSchema.color.alias.backgroundSelected,
                fontWeight: tokenSchema.typography.fontWeight.semibold,
              },
            })}
            style={{ '--tree-level': states.level } as CSSProperties}
          >
            {states.hasChildItems ? (
              <Icon
                src={direction === 'rtl' ? chevronLeftIcon : chevronRightIcon}
                color="neutralTertiary"
                UNSAFE_style={{
                  transform: `rotate(${
                    states.isExpanded ? (direction === 'rtl' ? -90 : 90) : 0
                  }deg)`,
                }}
              />
            ) : (
              <Icon src={dotIcon} color="neutralTertiary" />
            )}
            {typeof children === 'function' ? children(states) : children}
          </div>
        </SlotProvider>
      )}
    </TreeItemContent>
  );
}

function NavTreeSection<T extends object>(
  props: NavTreeSectionProps<T>,
  forwardedRef: ForwardedRef<HTMLDivElement>
) {
  let styleProps = useStyleProps(props);
  return (
    <AriaTreeSection
      {...props}
      {...styleProps}
      ref={forwardedRef}
      className={styleProps.className}
    />
  );
}

const _NavTreeSection = forwardRef(NavTreeSection) as <
  T extends object = object,
>(
  props: NavTreeSectionProps<T> & { ref?: ForwardedRef<HTMLDivElement> }
) => ReactElement;
export { _NavTreeSection as NavTreeSection };

export function NavTreeHeader({ children }: { children: ReactNode }) {
  return (
    <TreeHeader>
      <Text
        casing="uppercase"
        size="small"
        color="neutralSecondary"
        weight="medium"
        UNSAFE_className={css({
          paddingBlock: tokenSchema.size.space.medium,
          paddingInline: tokenSchema.size.space.medium,
        })}
      >
        {children}
      </Text>
    </TreeHeader>
  );
}
