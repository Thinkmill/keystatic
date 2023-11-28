import { useSelectableCollection } from '@react-aria/selection';
import { chain } from '@react-aria/utils';
import { useListState } from '@react-stately/list';
import {
  AriaLabelingProps,
  CollectionBase,
  MultipleSelection,
} from '@react-types/shared';
import { Key, RefObject, useEffect, useRef } from 'react';

import { HStack } from '@keystar/ui/layout';
import { ListBoxBase, listStyles, useListBoxLayout } from '@keystar/ui/listbox';
import { BaseStyleProps } from '@keystar/ui/style';
import { Text } from '@keystar/ui/typography';

export { Item, Section } from '@keystar/ui/listbox';

export type EditorListboxProps<T> = {
  listenerRef: RefObject<HTMLElement>;
  scrollRef?: RefObject<HTMLElement>;
  onAction?: (key: Key) => void;
  onEscape?: () => void;
} & CollectionBase<T> &
  AriaLabelingProps &
  MultipleSelection &
  Pick<
    BaseStyleProps,
    | 'height'
    | 'width'
    | 'maxHeight'
    | 'maxWidth'
    | 'minHeight'
    | 'minWidth'
    | 'UNSAFE_className'
    | 'UNSAFE_style'
  >;

export function useEditorListbox<T extends object>(
  props: EditorListboxProps<T>
) {
  let { listenerRef, onEscape, scrollRef, ...otherProps } = props;
  let state = useListState(props);
  let layout = useListBoxLayout(state);

  // keyboard and selection management
  let listboxRef = useRef<HTMLDivElement>(null);
  let { collectionProps } = useSelectableCollection({
    keyboardDelegate: layout,
    ref: listenerRef,
    scrollRef: scrollRef ?? listboxRef,
    selectionManager: state.selectionManager,
    disallowEmptySelection: true,
    disallowTypeAhead: true,
    isVirtualized: true,
    shouldFocusWrap: true,
  });

  let onKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'Enter':
        state.selectionManager.select(state.selectionManager.focusedKey);
        props.onAction?.(state.selectionManager.focusedKey);
        e.preventDefault();
        break;
      case 'Escape':
        onEscape?.();
        break;
    }
  };

  let keydownListener = chain(onKeyDown, collectionProps.onKeyDown);
  return {
    keydownListener,
    listbox: (
      <ListBoxBase
        ref={listboxRef}
        renderEmptyState={renderEmptyState}
        layout={layout}
        state={state}
        autoFocus="first"
        // focusOnPointerEnter
        shouldUseVirtualFocus
        shouldFocusWrap
        UNSAFE_className={listStyles}
        {...otherProps}
      />
    ),
  };
}

export function EditorListbox<T extends object>(props: EditorListboxProps<T>) {
  const { keydownListener, listbox } = useEditorListbox(props);

  useEffect(() => {
    let domNode = props.listenerRef.current;
    domNode?.addEventListener('keydown', keydownListener);
    return () => domNode?.removeEventListener('keydown', keydownListener);
  }, [keydownListener, props.listenerRef]);

  return listbox;
}

function renderEmptyState() {
  return (
    <HStack
      alignItems="center"
      gap="regular"
      height="element.regular"
      paddingX="medium"
    >
      <Text color="neutralSecondary" weight="medium">
        No results…
      </Text>
    </HStack>
  );
}
