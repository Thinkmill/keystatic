// import { chain } from '@react-aria/utils';
import { usePress } from '@react-aria/interactions';
import { Collection, Node } from '@react-types/shared';
import {
  useSelectableCollection,
  useSelectableItem,
} from '@react-aria/selection';
import { useCollator } from '@react-aria/i18n';
import { TreeState, useTreeState } from '@react-stately/tree';
import React, { Key, useMemo, useRef } from 'react';

import { Icon } from '@voussoir/icon';
import { chevronRightIcon } from '@voussoir/icon/icons/chevronRightIcon';
import { css, tokenSchema, useStyleProps } from '@voussoir/style';

import { NavTreeProps } from './types';
import { isReactText } from '@voussoir/utils';
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
    keyboardDelegate,
    ref,
    selectionManager: state.selectionManager,
  });

  return (
    <div
      {...collectionProps}
      {...styleProps}
      onKeyDown={e => {
        collectionProps?.onKeyDown?.(e);
        let { selectionManager } = state;

        let isExpanded = state.expandedKeys.has(selectionManager.focusedKey);
        let item = state.collection.getItem(selectionManager.focusedKey);
        console.log(state.expandedKeys);
        switch (e.key) {
          case 'ArrowLeft':
            if (item?.hasChildNodes && isExpanded) {
              state.toggleKey(selectionManager.focusedKey);
            } else if (item?.parentKey) {
              selectionManager.setFocusedKey(item.parentKey);
            }
            break;
          case 'ArrowRight':
            if (item?.hasChildNodes && !isExpanded) {
              state.toggleKey(selectionManager.focusedKey);
            } else if (item?.hasChildNodes) {
              let firstChild = state.collection.getKeyAfter(
                selectionManager.focusedKey
              );
              if (firstChild) {
                selectionManager.setFocusedKey(firstChild);
              }
            }
            break;
        }
      }}
      ref={ref}
      role="tree"
    >
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

  let { itemProps } = useSelectableItem({
    key: node.key,
    selectionManager: state.selectionManager,
    ref: ref,
  });

  let { pressProps } = usePress({
    ...itemProps,
    onPress: () => state.toggleKey(node.key),
  });

  let isExpanded = node.hasChildNodes && state.expandedKeys.has(node.key);
  let isSelected = state.selectionManager.isSelected(node.key);
  let contents = isReactText(node.rendered) ? (
    <Text>{node.rendered}</Text>
  ) : (
    node.rendered
  );

  return (
    <SlotProvider
      slots={{
        text: {
          truncate: true,
        },
      }}
    >
      <div
        {...pressProps}
        aria-expanded={node.hasChildNodes ? isExpanded : undefined}
        aria-selected={isSelected}
        ref={ref}
        role="treeitem"
        className={css({})}
      >
        <div
          role="presentation"
          className={css({
            alignItems: 'center',
            display: 'flex',
            // gap: tokenSchema.size.space.small,
            padding: tokenSchema.size.space.regular,
            paddingInlineStart: tokenSchema.size.space.xlarge,
          })}
        >
          {node.hasChildNodes ? (
            <Icon
              src={chevronRightIcon}
              color="neutralTertiary"
              UNSAFE_style={{
                // marginInlineStart: `calc(${tokenSchema.size.space.xlarge} * -1)`,
                transform: `rotate(${isExpanded ? 90 : 0}deg)`,
              }}
            />
          ) : (
            <Box width="element.xsmall" />
          )}
          <div className={css({})}>{contents}</div>
        </div>
        {isExpanded && (
          <div
            className={css({
              borderInlineStart: isSelected
                ? `1px solid ${tokenSchema.color.border.muted}`
                : undefined,
              paddingInlineStart: tokenSchema.size.space.regular,
            })}
            role="group"
          >
            {resolveTreeNodes({
              // @ts-expect-error
              nodes: node.childNodes,
              state,
            })}
          </div>
        )}
      </div>
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
