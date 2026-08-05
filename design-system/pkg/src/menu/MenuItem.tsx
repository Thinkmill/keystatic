import {
  MenuItem as AriaMenuItem,
  type MenuItemProps as AriaMenuItemProps,
  type MenuItemRenderProps,
} from 'react-aria-components/Menu';
import {
  Children,
  type ForwardedRef,
  type ReactElement,
  type ReactNode,
  forwardRef,
  isValidElement,
} from 'react';
import { Text as AriaText } from 'react-aria-components/Text';

import { ListItem } from '@keystar/ui/listbox';
import type { BaseStyleProps } from '@keystar/ui/style';
import { Kbd, Text } from '@keystar/ui/typography';
import { isReactText } from '@keystar/ui/utils';

export interface MenuItemProps<T = object>
  extends Omit<AriaMenuItemProps<T>, 'className' | 'style'>,
    BaseStyleProps {}

function MenuItem<T extends object>(
  props: MenuItemProps<T>,
  forwardedRef: ForwardedRef<HTMLDivElement>
) {
  let { children, ...otherProps } = props;
  return (
    <AriaMenuItem
      {...otherProps}
      ref={forwardedRef}
      textValue={
        otherProps.textValue ??
        (isReactText(children) ? String(children) : undefined)
      }
    >
      {states => {
        let content = resolveChildren(children, states);
        return (
          <ListItem
            aria-disabled={states.isDisabled}
            isHovered={states.isHovered}
            isFocused={states.isFocusVisible}
            isSelected={states.isSelected}
          >
            {wrapItemContent(content)}
          </ListItem>
        );
      }}
    </AriaMenuItem>
  );
}

type TextChildProps = React.ComponentProps<typeof Text>;
type KbdChildProps = React.ComponentProps<typeof Kbd>;

function wrapItemContent(children: ReactNode): ReactNode {
  if (isReactText(children)) return <Text>{children}</Text>;

  return Children.map(children, child => {
    if (isValidElement<TextChildProps>(child) && child.type === Text) {
      let { children, slot, ...textProps } = child.props;
      return (
        <AriaText
          slot={slot === 'description' ? 'description' : 'label'}
          render={({ className: _, ...domProps }) => (
            <Text {...textProps} {...domProps} slot={slot} />
          )}
        >
          {children}
        </AriaText>
      );
    }
    if (isValidElement<KbdChildProps>(child) && child.type === Kbd) {
      return child;
    }
    return child;
  });
}

const _MenuItem = forwardRef(MenuItem) as <T extends object = object>(
  props: MenuItemProps<T> & { ref?: ForwardedRef<HTMLDivElement> }
) => ReactElement;
export { _MenuItem as MenuItem };

function resolveChildren(
  children: AriaMenuItemProps<object>['children'],
  states: MenuItemRenderProps
): ReactNode {
  return typeof children === 'function'
    ? (children as (states: MenuItemRenderProps) => ReactNode)(states)
    : children;
}
