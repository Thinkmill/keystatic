import {
  ListKeyboardDelegate,
  useSelectableCollection,
} from '@react-aria/selection';
import { chain } from '@react-aria/utils';
import { useListState } from '@react-stately/list';
import {
  AriaLabelingProps,
  CollectionBase,
  MultipleSelection,
} from '@react-types/shared';
import { Key, RefObject, useEffect, useMemo, useRef } from 'react';

import { ListBoxBase, listStyles, useListBoxLayout } from '@keystar/ui/listbox';
import { BaseStyleProps } from '@keystar/ui/style';

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

export function EditorListbox<T extends object>(props: EditorListboxProps<T>) {
  let { listenerRef, onEscape, scrollRef, ...otherProps } = props;
  let state = useListState(props);
  let layout = useListBoxLayout();
  let listboxRef = useRef<HTMLDivElement>(null);
  let delegate = useMemo(
    () =>
      new ListKeyboardDelegate({
        collection: state.collection,
        ref: listboxRef,
        layoutDelegate: layout,
      }),
    [layout, state.collection]
  );

  // keyboard and selection management
  let { collectionProps } = useSelectableCollection({
    keyboardDelegate: delegate,
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
        break;
      case 'Escape':
        onEscape?.();
        break;
    }
  };

  let keydownListener = chain(onKeyDown, collectionProps.onKeyDown);

  useEffect(() => {
    let domNode = listenerRef.current;
    domNode?.addEventListener('keydown', keydownListener);
    return () => domNode?.removeEventListener('keydown', keydownListener);
  }, [keydownListener, listenerRef]);

  return (
    <ListBoxBase
      ref={listboxRef}
      layout={layout}
      state={state}
      autoFocus="first"
      // focusOnPointerEnter
      shouldUseVirtualFocus
      shouldFocusWrap
      UNSAFE_className={listStyles}
      {...otherProps}
    />
  );
}
