import { isFocusVisible, useHover, usePress } from '@react-aria/interactions';
import { mergeProps } from '@react-aria/utils';
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
  PressEvent,
} from '@react-types/shared';
import React, {
  Key,
  KeyboardEvent as ReactKeyboardEvent,
  RefObject,
  useId,
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
import { getItemCount } from '@react-stately/collections';
import { TreeKeyboardDelegate } from './TreeKeyboardDelegate';

interface TreeMapShared {
  id: string;
  onAction: (key: Key) => void;
}
export const treeMap = new WeakMap<TreeState<unknown>, TreeMapShared>();

export function NavTree<T extends object>(props: NavTreeProps<T>) {
  let { onAction } = props;
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
    allowsTabNavigation: true,
    keyboardDelegate,
    ref,
    selectionManager: state.selectionManager,
  });

  let id = useId();
  treeMap.set(state, { id, onAction });

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
  let { itemProps, isExpanded, isFocused } = useTreeItem({ node }, state, ref);

  let isRtl = direction === 'rtl';
  let contents = isReactText(node.rendered) ? (
    <Text>{node.rendered}</Text>
  ) : (
    node.rendered
  );

  return (
    <SlotProvider
      slots={{
        button: {
          isHidden: !isFocused,
          elementType: 'span',
          marginStart: 'auto',
          prominence: 'low',
        },
        text: { color: 'inherit', truncate: true, weight: 'inherit' },
      }}
    >
      <div
        {...itemProps}
        {...toDataAttributes({
          focused: isFocused
            ? isFocusVisible()
              ? 'visible'
              : 'true'
            : undefined,
        })}
        ref={ref}
        role="row"
        className={css({
          color: tokenSchema.color.alias.foregroundIdle,
          cursor: 'default',
          fontWeight: tokenSchema.typography.fontWeight.medium,
          position: 'relative',
          outline: 'none',
          padding: tokenSchema.size.alias.focusRing,
          paddingInlineStart: tokenSchema.size.space.regular,
        })}
      >
        <div
          role="gridcell"
          className={css({
            alignItems: 'center',
            borderRadius: `calc(${tokenSchema.size.radius.regular} + ${tokenSchema.size.alias.focusRing})`,
            display: 'flex',
            gap: tokenSchema.size.space.small,
            minHeight: tokenSchema.size.element.regular,
            padding: tokenSchema.size.alias.focusRing,
            paddingInlineStart: `calc(${tokenSchema.size.space.regular} * var(--inset))`,

            '[data-focused] > &': {
              backgroundColor: tokenSchema.color.alias.backgroundFocused,
              color: tokenSchema.color.alias.foregroundHovered,
            },
            // '[data-focused=visible] > &': {
            //   outline: `${tokenSchema.size.alias.focusRing} solid ${tokenSchema.color.alias.focusRing}`,
            // },

            '[aria-selected=true] > &': {
              backgroundColor: tokenSchema.color.alias.backgroundPressed,
              color: tokenSchema.color.alias.foregroundHovered,
              fontWeight: tokenSchema.typography.fontWeight.semibold,

              '&::before': {
                backgroundColor: tokenSchema.color.background.accentEmphasis,
                borderRadius: tokenSchema.size.space.small,
                content: '""',
                insetBlock: tokenSchema.size.space.xsmall,
                insetInlineStart: 0,
                position: 'absolute',
                width: tokenSchema.size.space.small,
              },
            },
          })}
          style={{
            // @ts-expect-error
            '--inset': node.level + 1,
          }}
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
  let { node, isVirtualized } = props;
  let { selectionManager } = state;
  let treeData = treeMap.get(state);
  let { direction } = useLocale();

  let onAction = () => {
    if (treeData?.onAction) {
      treeData.onAction(node.key);
    }

    if (node.hasChildNodes) {
      state.toggleKey(node.key);
    }
  };

  let { itemProps: selectableItemProps, ...itemStates } = useSelectableItem({
    key: node.key,
    selectionManager,
    ref,
    isVirtualized,
    shouldSelectOnPressUp: true,
  });

  let onPressStart = (e: PressEvent) => {
    if (e.pointerType === 'keyboard' && onAction) {
      onAction();
    }
  };
  let onPressUp = (e: PressEvent) => {
    if (e.pointerType !== 'keyboard') {
      if (onAction) {
        onAction();
      }
    }
  };
  let { pressProps } = usePress({
    onPressStart,
    onPressUp,
    isDisabled: itemStates.isDisabled,
  });

  let isExpanded = state.expandedKeys.has(node.key);

  let { hoverProps } = useHover({
    isDisabled: state.disabledKeys.has(node.key),
    onHoverStart() {
      if (!isFocusVisible()) {
        selectionManager.setFocused(true);
        selectionManager.setFocusedKey(node.key);
      }
    },
  });

  let onKeyDownCapture = (e: ReactKeyboardEvent) => {
    if (!ref.current || !e.currentTarget.contains(e.target as Element)) {
      return;
    }

    let handleArrowBackward = () => {
      if (node.hasChildNodes && isExpanded) {
        state.toggleKey(node.key);
      } else if (node?.parentKey) {
        selectionManager.setFocusedKey(node.parentKey);
      }
    };
    let handleArrowForward = () => {
      if (node.hasChildNodes && !isExpanded) {
        state.toggleKey(node.key);
      } else if (node.hasChildNodes) {
        let firstChild = state.collection.getKeyAfter(node.key);
        if (firstChild) {
          selectionManager.setFocusedKey(firstChild);
        }
      }
    };

    switch (e.key) {
      case 'ArrowLeft': {
        if (direction === 'rtl') {
          handleArrowForward();
        } else {
          handleArrowBackward();
        }
        break;
      }
      case 'ArrowRight': {
        if (direction === 'rtl') {
          handleArrowBackward();
        } else {
          handleArrowForward();
        }
        break;
      }
    }
  };

  let itemProps: DOMAttributes = {
    ...mergeProps(selectableItemProps, pressProps, hoverProps),
    onKeyDownCapture,
    'aria-label': node.textValue || undefined,
    'aria-disabled': itemStates.isDisabled || undefined,
    'aria-level': node.level + 1,
    'aria-expanded': node.hasChildNodes ? isExpanded : undefined,
    // hmm...
    // 'aria-current': itemStates.isSelected ? 'page' : undefined,
    'aria-selected': node.hasChildNodes ? undefined : itemStates.isSelected,
  };

  if (isVirtualized) {
    let index = Number(state.collection.getItem(node.key)?.index);
    itemProps['aria-posinset'] = Number.isNaN(index) ? undefined : index + 1;
    // itemProps['aria-rowindex'] = index;
    itemProps['aria-setsize'] = getItemCount(state.collection);
  }

  return {
    itemProps,
    isExpanded: node.hasChildNodes && isExpanded,
    isFocused:
      selectionManager.isFocused && selectionManager.focusedKey === node.key, // FIXME: this can be removed when `useSelectableItem` is from latest
    ...itemStates,
  };
}
