import { useSelectableCollection } from '@react-aria/selection';
import { chain } from '@react-aria/utils';
import { useListState } from '@react-stately/list';
import {
  AriaLabelingProps,
  CollectionBase,
  MultipleSelection,
} from '@react-types/shared';
import { Key, ReactElement, RefObject, useCallback, useEffect } from 'react';

import { Icon } from '@voussoir/icon';
import { Item, ListBoxBase, useListBoxLayout } from '@voussoir/listbox';
import { Kbd, KbdProps, Text } from '@voussoir/typography';
import { BaseStyleProps } from '@voussoir/style';

export type EditorListboxProps<T> = {
  listenerRef: RefObject<HTMLElement>;
  scrollRef?: RefObject<HTMLElement>;
  onAction?: (key: Key) => void;
  onEscape?: () => void;
} & Omit<CollectionBase<T>, 'children'> &
  AriaLabelingProps &
  MultipleSelection &
  Pick<
    BaseStyleProps,
    'height' | 'width' | 'maxHeight' | 'maxWidth' | 'minHeight' | 'minWidth'
  >;

type KbdOption = 'alt' | 'meta' | 'shift';
type KbdOptions = KbdOption[];
type KbdFormat = readonly [...KbdOptions, Key] | string;
type ItemBase = {
  description?: string;
  icon?: ReactElement;
  id: Key;
  kbd?: KbdFormat;
  label: string;
};

export function EditorListbox<T extends ItemBase>(
  props: EditorListboxProps<T>
) {
  let { listenerRef, onEscape, scrollRef, ...otherProps } = props;
  let children = useCallback(
    (item: T) => (
      <Item key={item.id} textValue={item.label}>
        <Text>{item.label}</Text>
        {item.description && <Text slot="description">{item.description}</Text>}
        {item.kbd && <Kbd {...getKbdProps(item.kbd)} />}
        {item.icon && <Icon src={item.icon} />}
      </Item>
    ),
    []
  );
  let state = useListState({ children, ...props });
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

function getKbdProps(format: KbdFormat) {
  if (typeof format === 'string') {
    return { children: format };
  }

  let [children, ...options] = [...format].reverse();
  let props: KbdProps = { children };
  for (let option of options as KbdOptions) {
    props[option] = true;
  }

  return props;
}
