import { useFocusRing } from '@react-aria/focus';
import {
  isFocusVisible as getFocusVisible,
  useHover,
} from '@react-aria/interactions';
import { useOption } from '@react-aria/listbox';
import { mergeProps } from '@react-aria/utils';
import { Node } from '@react-types/shared';
import { useRef } from 'react';

import { Text } from '@keystar/ui/typography';
import { isReactText } from '@keystar/ui/utils';

import { useListBoxContext } from './context';
import { ListItem } from './ListItem';

interface OptionProps<T> {
  item: Node<T>;
  shouldSelectOnPressUp?: boolean;
  shouldFocusOnHover?: boolean;
  shouldUseVirtualFocus?: boolean;
}

/** @private */
export function ListBoxOption<T>(props: OptionProps<T>) {
  let {
    item,
    shouldSelectOnPressUp,
    shouldFocusOnHover,
    shouldUseVirtualFocus,
  } = props;

  let { rendered, key } = item;

  let { state } = useListBoxContext();

  let ref = useRef<HTMLDivElement>(null);
  let {
    optionProps,
    labelProps,
    descriptionProps,
    isSelected,
    isDisabled,
    isFocused,
    isPressed,
  } = useOption(
    {
      'aria-label': item['aria-label'],
      key,
      shouldSelectOnPressUp,
      shouldFocusOnHover,
      isVirtualized: true,
      shouldUseVirtualFocus,
    },
    state,
    ref
  );
  let { hoverProps, isHovered } = useHover({
    ...props,
    isDisabled,
  });
  let { isFocusVisible, focusProps } = useFocusRing();

  let contents = isReactText(rendered) ? <Text>{rendered}</Text> : rendered;
  let isKeyboardModality = getFocusVisible();

  return (
    <ListItem
      descriptionProps={descriptionProps}
      labelProps={labelProps}
      // If using virtual focus, apply focused styles to the item when the user is interacting with keyboard modality
      isFocused={
        shouldUseVirtualFocus ? isFocused && isKeyboardModality : isFocusVisible
      }
      // When shouldFocusOnHover is false, apply hover styles both when hovered with the mouse.
      // Otherwise, apply hover styles when focused using non-keyboard modality.
      isHovered={
        (isHovered && !shouldFocusOnHover) || (isFocused && !isKeyboardModality)
      }
      {...mergeProps(
        optionProps,
        focusProps,
        shouldFocusOnHover ? {} : hoverProps
      )}
      isPressed={isPressed}
      isSelected={isSelected}
      ref={ref}
    >
      {contents}
    </ListItem>
  );
}
