import { useSelectableCollection } from '@react-aria/selection';
import { chain } from '@react-aria/utils';
import { useListState } from '@react-stately/list';
import {
  AriaLabelingProps,
  CollectionBase,
  MultipleSelection,
} from '@react-types/shared';
import { Key, RefObject, useEffect } from 'react';

import { ListBoxBase, useListBoxLayout } from '@voussoir/listbox';
import { BaseStyleProps } from '@voussoir/style';

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
    'height' | 'width' | 'maxHeight' | 'maxWidth' | 'minHeight' | 'minWidth'
  >;

export function EditorListbox<T extends object>(props: EditorListboxProps<T>) {
  let { listenerRef, onEscape, scrollRef, ...otherProps } = props;
  let state = useListState(props);
  let layout = useListBoxLayout(state);

  // keyboard and selection management
  let { collectionProps } = useSelectableCollection({
    keyboardDelegate: layout,
    ref: listenerRef,
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
      layout={layout}
      state={state}
      autoFocus="first"
      height="inherit"
      focusOnPointerEnter
      shouldUseVirtualFocus
      shouldFocusWrap
      {...otherProps}
    />
  );
}
