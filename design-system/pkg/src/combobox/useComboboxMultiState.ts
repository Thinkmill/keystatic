import { useFilter } from '@react-aria/i18n';
import { getChildNodes } from '@react-stately/collections';
import {
  FormValidationState,
  useFormValidationState,
} from '@react-stately/form';
import { ListCollection, ListState, useListState } from '@react-stately/list';
import { MenuTriggerState, useMenuTriggerState } from '@react-stately/menu';
import { useControlledState } from '@react-stately/utils';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Collection,
  CollectionStateBase,
  FocusStrategy,
  Node,
} from '@react-types/shared';

import { usePrevious } from '../utils';
import { ComboboxMultiProps } from './types';

export interface ComboboxMultiStateOptions<T>
  extends Omit<ComboboxMultiProps<T>, 'children'>,
    CollectionStateBase<T> {
  /** Whether the combo box allows the menu to be open when the collection is empty. */
  allowsEmptyCollection?: boolean;
}

export interface ComboboxMultiState<T>
  extends ListState<T>,
    MenuTriggerState,
    FormValidationState {
  /** Whether the select is currently focused. */
  // readonly isFocused: boolean,

  /** Sets whether the select is focused. */
  // setFocused(isFocused: boolean): void,

  /** Controls which item will be auto focused when the menu opens. */
  // readonly focusStrategy: FocusStrategy | null,

  /** Opens the menu. */
  // open(focusStrategy?: FocusStrategy | null): void,

  /** Toggles the menu. */
  // toggle(focusStrategy?: FocusStrategy | null): void
  /** The current value of the combo box input. */
  inputValue: string;
  /** Sets the value of the combo box input. */
  setInputValue(value: string): void;
}

export function useComboboxMultiState<T extends object>(
  props: ComboboxMultiStateOptions<T>
): ComboboxMultiState<T> {
  let { allowsEmptyCollection = false, menuTrigger = 'input' } = props;
  let [showAllItems, setShowAllItems] = useState(false);
  let listState = useListState({
    ...props,
    items: props.items ?? props.defaultItems,
    selectionBehavior: 'toggle',
    selectionMode: 'multiple',
  });
  let triggerState = useMenuTriggerState({
    ...props,
    onOpenChange: props.onOpenChange,
    isOpen: undefined,
    defaultOpen: undefined,
  });
  let [inputValue, setInputValue] = useControlledState(
    props.inputValue,
    props.defaultInputValue ?? '',
    props.onInputChange
  );
  let lastInputValue = usePrevious(inputValue);

  // Preserve original collection so we can show all items on demand
  let { collection } = listState;
  let originalCollection = collection;
  let { contains } = useFilter({ sensitivity: 'base' });
  let filteredCollection = useMemo(() => {
    // No filter if items are controlled
    if (props.items != null) {
      return collection;
    }

    return filterCollection(collection, inputValue, contains);
  }, [collection, inputValue, contains, props.items]);
  let [lastCollection, setLastCollection] = useState(filteredCollection);
  let updateLastCollection = useCallback(() => {
    setLastCollection(showAllItems ? originalCollection : filteredCollection);
  }, [showAllItems, originalCollection, filteredCollection]);

  let closeMenu = () => {
    // keep the old collection while closing the menu
    updateLastCollection();
    triggerState.close();
  };
  let close = () => {
    // clear the input on user initiated close
    setInputValue('');
    closeMenu();
  };
  let open = (focusStrategy: FocusStrategy | null = null) => {
    let displayAllItems = menuTrigger === 'focus';
    // Prevent open operations from triggering if there is nothing to display:
    // - Also prevent open operations from triggering if items are uncontrolled
    //   but defaultItems is empty, even if displayAllItems is true.
    // - This is to prevent comboboxes with empty defaultItems from opening but
    //   allow controlled items comboboxes to open even if the inital list is
    //   empty.
    if (
      allowsEmptyCollection ||
      filteredCollection.size > 0 ||
      (displayAllItems && originalCollection.size > 0) ||
      props.items
    ) {
      if (
        displayAllItems &&
        !triggerState.isOpen &&
        props.items === undefined
      ) {
        // Show all items if menu is manually opened. Ignored if items are controlled
        setShowAllItems(true);
      }

      triggerState.open(focusStrategy);
    }
  };

  let toggle = (focusStrategy: FocusStrategy | null = null) => {
    let displayAllItems = menuTrigger === 'focus';
    // If the menu is closed and there is nothing to display, early return so
    // toggle isn't called to prevent extraneous onOpenChange
    if (
      !(
        allowsEmptyCollection ||
        filteredCollection.size > 0 ||
        (displayAllItems && originalCollection.size > 0) ||
        props.items
      ) &&
      !triggerState.isOpen
    ) {
      return;
    }

    if (displayAllItems && !triggerState.isOpen && props.items === undefined) {
      // Show all items if menu is toggled open. Ignored if items are controlled
      setShowAllItems(true);
    }

    triggerState.toggle(focusStrategy);

    // keep the old collection while closing the menu
    if (triggerState.isOpen) {
      updateLastCollection();
    }
  };

  // commit controlled selection on close
  let commit = () => {
    if (props.selectedKeys !== undefined && props.inputValue !== undefined) {
      props.onSelectionChange?.(listState.selectionManager.selectedKeys);
    }

    close();
  };

  useEffect(() => {
    // Open the menu when the input value changes
    if (!triggerState.isOpen && inputValue && inputValue !== lastInputValue) {
      triggerState.open();
    }

    // Close the menu if the collection is empty. Don't close menu if filtered collection size is 0
    // but we are currently showing all items via button press
    if (
      !showAllItems &&
      !allowsEmptyCollection &&
      triggerState.isOpen &&
      filteredCollection.size === 0
    ) {
      closeMenu();
    }
  });

  let validation = useFormValidationState({
    ...props,
    value: useMemo(
      () => ({
        inputValue,
        selectedKeys: listState.selectionManager.selectedKeys,
      }),
      [inputValue, listState.selectionManager.selectedKeys]
    ),
  });

  let displayedCollection = useMemo(() => {
    if (triggerState.isOpen) {
      if (showAllItems) {
        return originalCollection;
      } else {
        return filteredCollection;
      }
    } else {
      return lastCollection;
    }
  }, [
    triggerState.isOpen,
    originalCollection,
    filteredCollection,
    showAllItems,
    lastCollection,
  ]);

  return {
    ...validation,
    focusStrategy: triggerState.focusStrategy,
    isOpen: triggerState.isOpen,
    setOpen: triggerState.setOpen,
    toggle,
    open,
    close: commit,
    selectionManager: listState.selectionManager,
    disabledKeys: listState.disabledKeys,
    collection: displayedCollection,
    inputValue,
    setInputValue,
  };
}

type FilterFn = (textValue: string, inputValue: string) => boolean;

function filterCollection<T extends object>(
  collection: Collection<Node<T>>,
  inputValue: string,
  filter: FilterFn
): Collection<Node<T>> {
  return new ListCollection(
    filterNodes(collection, collection, inputValue, filter)
  );
}

function filterNodes<T>(
  collection: Collection<Node<T>>,
  nodes: Iterable<Node<T>>,
  inputValue: string,
  filter: FilterFn
): Iterable<Node<T>> {
  let filteredNode: Node<T>[] = [];
  for (let node of nodes) {
    if (node.type === 'section' && node.hasChildNodes) {
      let filtered = filterNodes(
        collection,
        getChildNodes(node, collection),
        inputValue,
        filter
      );
      if ([...filtered].some(node => node.type === 'item')) {
        filteredNode.push({ ...node, childNodes: filtered });
      }
    } else if (node.type === 'item' && filter(node.textValue, inputValue)) {
      filteredNode.push({ ...node });
    } else if (node.type !== 'item') {
      filteredNode.push({ ...node });
    }
  }
  return filteredNode;
}
