import {
  ListKeyboardDelegate,
  useSelectableCollection,
} from '@react-aria/selection';
import { chain } from '@react-aria/utils';
import { useSingleSelectListState } from '@react-stately/list';
import {
  AriaLabelingProps,
  CollectionBase,
  SingleSelection,
} from '@react-types/shared';
import { Key, RefObject, useCallback, useEffect, useMemo, useRef } from 'react';

import { Item, ListBoxBase, useListBoxLayout } from '@voussoir/listbox';
import { Kbd, Text } from '@voussoir/typography';

export type EditorListboxProps<T> = {
  listenerRef: RefObject<HTMLElement>;
  scrollRef?: RefObject<HTMLElement>;
  onEscape?: () => void;
} & Omit<CollectionBase<T>, 'children'> &
  AriaLabelingProps &
  SingleSelection;

type ItemBase = {
  label: string;
  description?: string;
  kbd?:
    | string
    | { alt?: boolean; meta?: boolean; shift?: boolean; text: string };
  id: Key;
};

export function EditorListbox<T extends ItemBase>(
  props: EditorListboxProps<T>
) {
  let {
    items,
    disabledKeys,
    defaultSelectedKey,
    listenerRef,
    onEscape,
    onSelectionChange,
    scrollRef,
    selectedKey,
    ...ariaProps
  } = props;
  let children = useCallback(
    (item: T) => (
      <Item key={item.id} textValue={item.label}>
        <Text>{item.label}</Text>
        {item.description && <Text slot="description">{item.description}</Text>}
        {item.kbd &&
          (typeof item.kbd === 'string' ? (
            <Kbd>{item.kbd}</Kbd>
          ) : (
            <Kbd alt={item.kbd.alt} meta={item.kbd.meta} shift={item.kbd.shift}>
              {item.kbd.text}
            </Kbd>
          ))}
      </Item>
    ),
    []
  );
  let state = useSingleSelectListState({
    items,
    children,
    disabledKeys,
    defaultSelectedKey,
    onSelectionChange,
    selectedKey,
  });
  let layout = useListBoxLayout(state);

  // keyboard and selection management
  let listBoxRef = useRef<HTMLDivElement>(null);
  let keyboardDelegate = useMemo(
    () =>
      new ListKeyboardDelegate(
        // @ts-expect-error
        state.collection,
        state.disabledKeys,
        listBoxRef
      ),
    [state.collection, state.disabledKeys, listBoxRef]
  );
  let { collectionProps } = useSelectableCollection({
    keyboardDelegate,
    ref: listenerRef,
    scrollRef,
    selectionManager: state.selectionManager,
    disallowEmptySelection: true,
    disallowTypeAhead: true,
    isVirtualized: true,
    shouldFocusWrap: true,
  });

  let onKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'Enter':
        state.setSelectedKey(state.selectionManager.focusedKey);
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
      ref={listBoxRef}
      layout={layout}
      state={state}
      autoFocus="first"
      height="inherit"
      focusOnPointerEnter
      shouldUseVirtualFocus
      shouldFocusWrap
      {...ariaProps}
    />
  );
}
