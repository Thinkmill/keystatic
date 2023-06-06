import { focusSafely, getFocusableTreeWalker } from '@react-aria/focus';
import { isFocusVisible, useHover } from '@react-aria/interactions';
import {
  getScrollParent,
  mergeProps,
  scrollIntoViewport,
} from '@react-aria/utils';
import {
  useSelectableCollection,
  useSelectableItem,
} from '@react-aria/selection';
import { useCollator, useLocale } from '@react-aria/i18n';
import { TreeState, useTreeState } from '@react-stately/tree';
import {
  Collection,
  DOMAttributes,
  FocusableElement,
  Node,
} from '@react-types/shared';
import React, {
  Key,
  KeyboardEvent as ReactKeyboardEvent,
  RefObject,
  useMemo,
  useRef,
} from 'react';

import { Icon } from '@voussoir/icon';
import { chevronLeftIcon } from '@voussoir/icon/icons/chevronLeftIcon';
import { chevronRightIcon } from '@voussoir/icon/icons/chevronRightIcon';
import { css, tokenSchema, useStyleProps } from '@voussoir/style';

import { NavTreeProps } from './types';
import { isReactText, toDataAttributes } from '@voussoir/utils';
import { Text } from '@voussoir/typography';
import { SlotProvider } from '@voussoir/slots';
import { Box } from '@voussoir/layout';

export function NavTree<T extends object>(props: NavTreeProps<T>) {
  let state = useTreeState(props);
  let ref = useRef<HTMLDivElement>(null);
  let styleProps = useStyleProps(props);
  let collator = useCollator({ usage: 'search', sensitivity: 'base' });

  let keyboardDelegate = useMemo(
    () =>
      new TreeKeyboardDelegate(collator, state.collection, state.disabledKeys),
    [collator, state.collection, state.disabledKeys]
  );

  let { collectionProps } = useSelectableCollection({
    ...props,
    keyboardDelegate,
    ref,
    selectionManager: state.selectionManager,
  });

  return (
    <div {...collectionProps} {...styleProps} ref={ref} role="treegrid">
      {resolveTreeNodes({ nodes: state.collection, state })}
    </div>
  );
}

function resolveTreeNodes<T>({
  nodes,
  state,
}: {
  nodes: Collection<Node<T>>;
  state: TreeState<T>;
}) {
  return Array.from(nodes).map((node: Node<T>) => (
    <TreeItem node={node} key={node.key} state={state} />
  ));
}

function TreeItem<T>({ node, state }: { node: Node<T>; state: TreeState<T> }) {
  let ref = useRef<HTMLDivElement>(null);
  let { direction } = useLocale();
  let { itemProps, isFocused, isSelected } = useTreeItem(
    { onAction: () => state.toggleKey(node.key), node },
    state,
    ref
  );

  let isRtl = direction === 'rtl';
  let isExpanded = node.hasChildNodes && state.expandedKeys.has(node.key);
  let contents = isReactText(node.rendered) ? (
    <Text>{node.rendered}</Text>
  ) : (
    node.rendered
  );

  return (
    <SlotProvider
      slots={{
        button: {
          elementType: 'span',
          marginStart: 'auto',
          prominence: 'low',
        },
        text: { color: 'inherit', truncate: true },
      }}
    >
      <div
        {...itemProps}
        {...toDataAttributes({ focused: isFocused })}
        aria-level={node.level}
        aria-expanded={node.hasChildNodes ? isExpanded : undefined}
        aria-selected={isSelected}
        ref={ref}
        role="row"
        className={css({
          borderRadius: tokenSchema.size.radius.regular,
          color: tokenSchema.color.alias.foregroundIdle,
          cursor: 'default',
          paddingInlineStart: `calc(${tokenSchema.size.space.regular} * ${
            node.level + 1
          })`,
          outline: 'none',

          '&[data-focused=true]': {
            backgroundColor: tokenSchema.color.alias.backgroundFocused,
            color: tokenSchema.color.alias.foregroundHovered,
          },
        })}
      >
        <div
          role="gridcell"
          className={css({
            alignItems: 'center',
            display: 'flex',
            minHeight: tokenSchema.size.element.regular,
            padding: tokenSchema.size.alias.focusRing,
            gap: tokenSchema.size.space.small,
          })}
        >
          {node.hasChildNodes ? (
            <Icon
              src={isRtl ? chevronLeftIcon : chevronRightIcon}
              color="neutralTertiary"
              UNSAFE_style={{
                // marginInlineStart: `calc(${tokenSchema.size.space.xlarge} * -1)`,
                transform: `rotate(${isExpanded ? (isRtl ? -90 : 90) : 0}deg)`,
              }}
            />
          ) : (
            <Box width="element.xsmall" />
          )}
          {contents}
        </div>
      </div>
      {isExpanded &&
        resolveTreeNodes({
          // @ts-expect-error
          nodes: node.childNodes,
          state,
        })}
    </SlotProvider>
  );
}

class TreeKeyboardDelegate<T> {
  collator: Intl.Collator;
  collection: Collection<Node<T>>;
  disabledKeys: Set<Key>;

  constructor(
    collator: Intl.Collator,
    collection: Collection<Node<T>>,
    disabledKeys: Set<Key>
  ) {
    this.collator = collator;
    this.collection = collection;
    this.disabledKeys = disabledKeys;
  }

  getKeyAbove(key: Key) {
    let { collection, disabledKeys } = this;
    let keyBefore = collection.getKeyBefore(key);

    while (keyBefore !== null) {
      let item = collection.getItem(keyBefore);

      if (item?.type === 'item' && !disabledKeys.has(item.key)) {
        return keyBefore;
      }

      keyBefore = collection.getKeyBefore(keyBefore);
    }

    return null;
  }

  getKeyBelow(key: Key) {
    let { collection, disabledKeys } = this;
    let keyBelow = collection.getKeyAfter(key);

    while (keyBelow !== null) {
      let item = collection.getItem(keyBelow);

      if (item?.type === 'item' && !disabledKeys.has(item.key)) {
        return keyBelow;
      }

      keyBelow = collection.getKeyAfter(keyBelow);
    }

    return null;
  }

  getFirstKey() {
    let { collection, disabledKeys } = this;
    let key = collection.getFirstKey();

    while (key !== null) {
      let item = collection.getItem(key);

      if (item?.type === 'item' && !disabledKeys.has(item.key)) {
        return key;
      }

      key = collection.getKeyAfter(key);
    }

    return null;
  }

  getLastKey() {
    let { collection, disabledKeys } = this;
    let key = collection.getLastKey();

    while (key !== null) {
      let item = collection.getItem(key);

      if (item?.type === 'item' && !disabledKeys.has(item.key)) {
        return key;
      }

      key = collection.getKeyBefore(key);
    }

    return null;
  }

  getKeyForSearch(search: string, fromKey = this.getFirstKey()) {
    let { collator, collection } = this;
    let key = fromKey;

    while (key !== null) {
      let item = collection.getItem(key);

      if (
        item?.textValue &&
        collator.compare(search, item.textValue.slice(0, search.length)) === 0
      ) {
        return key;
      }

      key = this.getKeyBelow(key);
    }

    return null;
  }
}

type TreeItemOptions<T> = {
  /** Handler that is called when a user performs an action on an item. */
  onAction?: (key: Key) => void;
  /** An object representing the tree item. */
  node: Node<T>;
  /** Whether the tree item is contained in a virtual scroller. */
  isVirtualized?: boolean;
  /** Whether selection should occur on press up instead of press down. */
  shouldSelectOnPressUp?: boolean;
};

/**
 * Provides the behavior and accessibility implementation for an item within a tree.
 * @param props - Props for the tree item.
 * @param state - State of the parent list, as returned by `useTreeState`.
 * @param ref - The ref attached to the tree element.
 */
export function useTreeItem<T>(
  props: TreeItemOptions<T>,
  state: TreeState<T>,
  ref: RefObject<FocusableElement>
) {
  // Copied from useGridListItem + some modifications to make it not so grid specific
  let { node, isVirtualized, shouldSelectOnPressUp } = props;
  let { selectionManager } = state;
  let { direction } = useLocale();

  let { itemProps: selectableItemProps, ...itemStates } = useSelectableItem({
    key: node.key,
    selectionManager,
    ref,
    isVirtualized,
    shouldSelectOnPressUp,
    onAction: () => state.toggleKey(node.key),
  });

  let { hoverProps } = useHover({
    isDisabled: state.disabledKeys.has(node.key),
    onHoverStart() {
      if (!isFocusVisible()) {
        state.selectionManager.setFocused(true);
        state.selectionManager.setFocusedKey(node.key);
      }
    },
  });

  let onKeyDownCapture = (e: ReactKeyboardEvent) => {
    if (!ref.current || !e.currentTarget.contains(e.target as Element)) {
      return;
    }

    let walker = getFocusableTreeWalker(ref.current);
    walker.currentNode = document.activeElement as FocusableElement;

    let isExpanded = state.expandedKeys.has(node.key);
    let item = state.collection.getItem(node.key);

    let handleArrowBackward = (focusable: FocusableElement) => {
      if (focusable) {
        e.preventDefault();
        e.stopPropagation();
        focusSafely(focusable);
        scrollIntoViewport(focusable, {
          containingElement: getScrollParent(ref.current!),
        });
      } else {
        if (item?.hasChildNodes && isExpanded) {
          state.toggleKey(node.key);
        } else if (item?.parentKey) {
          selectionManager.setFocusedKey(item.parentKey);
        }
      }
    };
    let handleArrowForward = (focusable: FocusableElement) => {
      if (item?.hasChildNodes && !isExpanded) {
        state.toggleKey(node.key);
      } else if (focusable) {
        e.preventDefault();
        e.stopPropagation();
        focusSafely(focusable);
        scrollIntoViewport(focusable, {
          containingElement: getScrollParent(ref.current!),
        });
      } else if (item?.hasChildNodes) {
        let firstChild = state.collection.getKeyAfter(node.key);
        if (firstChild) {
          selectionManager.setFocusedKey(firstChild);
        }
      }
    };

    switch (e.key) {
      case 'ArrowLeft': {
        if (direction === 'rtl') {
          handleArrowForward(walker.nextNode() as FocusableElement);
        } else {
          handleArrowBackward(walker.previousNode() as FocusableElement);
        }
        break;
      }
      case 'ArrowRight': {
        if (direction === 'rtl') {
          handleArrowBackward(walker.previousNode() as FocusableElement);
        } else {
          handleArrowForward(walker.nextNode() as FocusableElement);
        }
        break;
      }
      case 'ArrowUp':
      case 'ArrowDown':
        // Prevent this event from reaching row children, e.g. menu buttons. We want arrow keys to navigate
        // to the row above/below instead. We need to re-dispatch the event from a higher parent so it still
        // bubbles and gets handled by useSelectableCollection.
        if (!e.altKey && ref.current.contains(e.target as Element)) {
          e.stopPropagation();
          e.preventDefault();
          ref.current?.parentElement?.dispatchEvent(
            new KeyboardEvent(e.nativeEvent.type, e.nativeEvent)
          );
        }
        break;
    }
  };

  let itemProps: DOMAttributes = mergeProps(selectableItemProps, hoverProps, {
    onKeyDownCapture,
    'aria-label': node.textValue || undefined,
    'aria-selected': selectionManager.canSelectItem(node.key)
      ? selectionManager.isSelected(node.key)
      : undefined,
    'aria-disabled': selectionManager.isDisabled(node.key) || undefined,
  });

  // if (isVirtualized) {
  //   itemProps['aria-rowindex'] = node.index + 1;
  // }

  return {
    itemProps,
    isExpanded: node.hasChildNodes && state.expandedKeys.has(node.key),
    isFocused:
      selectionManager.isFocused && selectionManager.focusedKey === node.key, // FIXME: this can be removed when `useSelectableItem` is from latest
    ...itemStates,
  };
}
