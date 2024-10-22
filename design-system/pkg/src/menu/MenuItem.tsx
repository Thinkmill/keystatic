import { useFocusRing } from '@react-aria/focus';
import { useHover } from '@react-aria/interactions';
import { useMenuItem } from '@react-aria/menu';
import { mergeProps } from '@react-aria/utils';
import { TreeState } from '@react-stately/tree';
import { Node } from '@react-types/shared';
import { useRef } from 'react';

import { ListItem } from '@keystar/ui/listbox';
import { Text } from '@keystar/ui/typography';
import { isReactText } from '@keystar/ui/utils';

import { useMenuContext } from './context';

type MenuItemProps<T> = {
  item: Node<T>;
  state: TreeState<T>;
  isVirtualized?: boolean;
};

/** @private */
export function MenuItem<T>(props: MenuItemProps<T>) {
  let { item, state, isVirtualized } = props;
  let { onClose, closeOnSelect } = useMenuContext();

  let { rendered, key } = item;

  let isSelected = state.selectionManager.isSelected(key);
  let isDisabled = state.selectionManager.isDisabled(key);

  let ref = useRef<HTMLLIElement>(null);
  let { menuItemProps, labelProps, descriptionProps, keyboardShortcutProps } =
    useMenuItem(
      {
        isSelected,
        isDisabled,
        'aria-label': item['aria-label'],
        key,
        onClose,
        closeOnSelect,
        isVirtualized,
      },
      state,
      ref
    );
  let { hoverProps, isHovered } = useHover({ isDisabled });
  let { focusProps, isFocusVisible } = useFocusRing();

  let contents = isReactText(rendered) ? <Text>{rendered}</Text> : rendered;
  // NOTE: Support for `disabledBehavior` is not yet implemented in react-aria.
  let role =
    state.selectionManager.disabledBehavior === 'selection' &&
    state.disabledKeys.has(key)
      ? 'menuitem'
      : undefined;

  return (
    <ListItem
      {...mergeProps(menuItemProps, { role }, hoverProps, focusProps)}
      elementType={item.props.href ? 'a' : 'div'}
      descriptionProps={descriptionProps}
      keyboardShortcutProps={keyboardShortcutProps}
      labelProps={labelProps}
      isHovered={isHovered}
      isFocused={isFocusVisible}
      isSelected={isSelected}
      ref={ref}
    >
      {contents}
    </ListItem>
  );
}
