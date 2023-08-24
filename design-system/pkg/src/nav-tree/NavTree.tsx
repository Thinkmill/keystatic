import { useCollator, useLocale } from '@react-aria/i18n';
import { isFocusVisible, useHover, usePress } from '@react-aria/interactions';
import {
  useSelectableCollection,
  useSelectableItem,
} from '@react-aria/selection';
import { mergeProps } from '@react-aria/utils';
import { getChildNodes, getItemCount } from '@react-stately/collections';
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
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
} from 'react';

import { Icon } from '@keystar/ui/icon';
import { chevronLeftIcon } from '@keystar/ui/icon/icons/chevronLeftIcon';
import { chevronRightIcon } from '@keystar/ui/icon/icons/chevronRightIcon';
import { dotIcon } from '@keystar/ui/icon/icons/dotIcon';
import { SlotProvider } from '@keystar/ui/slots';
import {
  classNames,
  css,
  toDataAttributes,
  tokenSchema,
  useStyleProps,
} from '@keystar/ui/style';
import { Text } from '@keystar/ui/typography';
import { isReactText } from '@keystar/ui/utils';

import { TreeKeyboardDelegate } from './TreeKeyboardDelegate';
import { NavTreeProps } from './types';

type NavTreeContext = {
  id: string;
  onAction?: (key: Key) => void;
  onSelectionChange?: (key: Key) => void;
  selectedAncestralKeys: Key[];
};

const TreeContext = createContext<NavTreeContext | null>(null);
function useTreeContext() {
  let context = useContext(TreeContext);
  if (context === null) {
    throw new Error('NavTree: missing context');
  }
  return context;
}

export function NavTree<T extends object>(props: NavTreeProps<T>) {
  let { onAction, onSelectionChange, selectedKey, ...otherProps } = props;
  let ref = useRef<HTMLDivElement>(null);
  let styleProps = useStyleProps(props);

  // tweak selection behaviour
  let [selectedAncestralKeys, setSelectedAncestralKeys] = React.useState<Key[]>(
    []
  );
  let selectionProps = useMemo(() => {
    if (selectedKey) {
      let selectedKeys = new Set([selectedKey]);
      return { selectedKeys, selectionMode: 'single' as const };
    }
    return {};
  }, [selectedKey]);

  // tree state
  let state = useTreeState({ ...otherProps, ...selectionProps });
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
  let context = useMemo(
    () => ({ id, onAction, onSelectionChange, selectedAncestralKeys }),
    [id, onAction, onSelectionChange, selectedAncestralKeys]
  );

  useEffect(() => {
    if (state.selectionManager.firstSelectedKey) {
      let item = state.collection.getItem(
        state.selectionManager.firstSelectedKey
      );

      if (item) {
        let ancestors = getAncestors(state.collection, item);
        setSelectedAncestralKeys(ancestors.map(item => item.key));
      }
    }
  }, [state.collection, state.selectionManager.firstSelectedKey]);

  return (
    <TreeContext.Provider value={context}>
      <div
        {...collectionProps}
        // {...hoverProps}
        {...styleProps}
        className={classNames(styleProps.className, css({ outline: 'none' }))}
        ref={ref}
        role="treegrid"
      >
        {resolveTreeNodes({ nodes: state.collection, state })}
      </div>
    </TreeContext.Provider>
  );
}

function resolveTreeNodes<T>({
  nodes,
  state,
}: {
  nodes: Iterable<Node<T>>;
  state: TreeState<T>;
}) {
  return Array.from(nodes).map((node: Node<T>) => {
    let Comp = node.type === 'section' ? TreeSection : TreeItem;
    return <Comp key={node.key} node={node} state={state} />;
  });
}

// TODO: review accessibility
function TreeSection<T>({
  node,
  state,
}: {
  node: Node<T>;
  state: TreeState<T>;
}) {
  return (
    <>
      <div role="rowgroup">
        <div role="row">
          <div role="columnheader" aria-sort="none">
            <Text
              casing="uppercase"
              size="small"
              color="neutralSecondary"
              weight="medium"
              UNSAFE_className={css({
                paddingBlock: tokenSchema.size.space.medium,
                paddingInline: tokenSchema.size.space.medium,
              })}
            >
              {node.rendered}
            </Text>
          </div>
        </div>
      </div>
      <div role="rowgroup">
        {resolveTreeNodes({
          nodes: getChildNodes(node, state.collection),
          state,
        })}
      </div>
    </>
  );
}

function TreeItem<T>({ node, state }: { node: Node<T>; state: TreeState<T> }) {
  let ref = useRef<HTMLDivElement>(null);
  let { direction } = useLocale();
  let {
    itemProps,
    isExpanded,
    isPressed,
    isHovered,
    isFocused,
    isSelectedAncestor,
  } = useTreeItem({ node }, state, ref);

  let isRtl = direction === 'rtl';
  let contents = isReactText(node.rendered) ? (
    <Text>{node.rendered}</Text>
  ) : (
    node.rendered
  );

  let itemClassName = css({
    color: tokenSchema.color.alias.foregroundIdle,
    cursor: 'default',
    fontWeight: tokenSchema.typography.fontWeight.medium,
    position: 'relative',
    outline: 'none',
    padding: tokenSchema.size.alias.focusRing,
    paddingInlineStart: tokenSchema.size.space.regular,
  });
  let itemStyle = useCallback(
    (...selectors: string[]) =>
      selectors.map(selector => `.${itemClassName}${selector}`).join(', '),
    [itemClassName]
  );

  return (
    <SlotProvider
      slots={{
        button: {
          isHidden: !(isFocused && isFocusVisible()) && !isHovered,
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
          selectedAncestor: isSelectedAncestor || undefined,
          hovered: isHovered || undefined,
          pressed: isPressed || undefined,
          focused: isFocused
            ? isFocusVisible()
              ? 'visible'
              : 'true'
            : undefined,
        })}
        ref={ref}
        role="row"
        className={itemClassName}
      >
        <div
          role="gridcell"
          className={css({
            alignItems: 'center',
            // borderRadius: `calc(${tokenSchema.size.radius.regular} + ${tokenSchema.size.alias.focusRing})`,
            borderRadius: tokenSchema.size.radius.regular,
            display: 'flex',
            gap: tokenSchema.size.space.small,
            minHeight: tokenSchema.size.element.regular,
            paddingInlineStart: `calc(${tokenSchema.size.space.regular} * var(--inset))`,

            '[role=rowgroup] &': {
              paddingInlineStart: `calc(${tokenSchema.size.space.regular} * calc(var(--inset) - 1))`,
            },

            // interaction states
            [itemStyle('[data-hovered] > &')]: {
              backgroundColor: tokenSchema.color.alias.backgroundHovered,
              color: tokenSchema.color.alias.foregroundHovered,
            },
            [itemStyle('[data-pressed] > &')]: {
              backgroundColor: tokenSchema.color.alias.backgroundPressed,
              color: tokenSchema.color.alias.foregroundPressed,
            },
            [itemStyle('[data-focused=visible] > &')]: {
              outline: `${tokenSchema.size.alias.focusRing} solid ${tokenSchema.color.alias.focusRing}`,
            },

            // indicate when a collapsed item contains the selected item, so
            // that the user always knows where they are in the tree
            [itemStyle(
              '[data-selected-ancestor=true][aria-expanded=false] > &'
            )]: {
              '&::before': {
                backgroundColor: tokenSchema.color.background.accentEmphasis,
                borderRadius: tokenSchema.size.space.small,
                content: '""',
                insetBlockStart: `50%`,
                insetInlineStart: 0,
                marginBlockStart: `calc(${tokenSchema.size.space.medium} / 2 * -1)`,
                position: 'absolute',
                height: tokenSchema.size.space.medium,
                width: tokenSchema.size.space.small,
              },
            },

            // selected item
            [itemStyle('[aria-current=page] > &')]: {
              backgroundColor: tokenSchema.color.alias.backgroundHovered,
              color: tokenSchema.color.alias.foregroundHovered,
              fontWeight: tokenSchema.typography.fontWeight.semibold,

              '&::before': {
                backgroundColor: tokenSchema.color.background.accentEmphasis,
                borderRadius: tokenSchema.size.space.small,
                content: '""',
                insetBlock: tokenSchema.size.space.small,
                insetInlineStart: 0,
                position: 'absolute',
                width: tokenSchema.size.space.small,
              },
            },
            [itemStyle('[aria-current=page][data-hovered] > &')]: {
              backgroundColor: tokenSchema.color.alias.backgroundPressed,
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
                transform: `rotate(${isExpanded ? (isRtl ? -90 : 90) : 0}deg)`,
              }}
            />
          ) : (
            <Icon src={dotIcon} color="neutralTertiary" />
          )}
          {contents}
        </div>
      </div>
      {isExpanded &&
        resolveTreeNodes({
          nodes: getChildNodes(node, state.collection),
          state,
        })}
    </SlotProvider>
  );
}

type TreeItemOptions<T> = {
  /** An object representing the tree item. */
  node: Node<T>;
  /** Whether the tree item is contained in a virtual scroller. */
  isVirtualized?: boolean;
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
  let { node, isVirtualized } = props;
  let { selectionManager } = state;
  let treeData = useTreeContext();
  let { direction } = useLocale();

  let isExpanded = state.expandedKeys.has(node.key);
  let isSelectedAncestor = treeData?.selectedAncestralKeys.includes(node.key);

  let onPress = (e: PressEvent) => {
    treeData.onAction?.(node.key);

    if (node.hasChildNodes) {
      // allow the user to alt+click to expand/collapse all descendants
      if (e.altKey) {
        let descendants = getDescendantNodes(node, state.collection);

        let newKeys = new Set(state.expandedKeys);
        for (let descendant of descendants) {
          if (isExpanded) {
            newKeys.delete(descendant.key);
          } else {
            newKeys.add(descendant.key);
          }
        }
        state.setExpandedKeys(newKeys);
      } else {
        state.toggleKey(node.key);
      }
    } else {
      treeData.onSelectionChange?.(node.key);
    }
  };

  let { itemProps: selectableItemProps, ...itemStates } = useSelectableItem({
    key: node.key,
    selectionManager,
    ref,
    isVirtualized,
    // shouldUseVirtualFocus: true,
    shouldSelectOnPressUp: true,
  });
  let { pressProps } = usePress({ onPress, isDisabled: itemStates.isDisabled });
  let { isHovered, hoverProps } = useHover({
    isDisabled: itemStates.isDisabled,
  });

  let onKeyDownCapture = (e: ReactKeyboardEvent) => {
    if (!ref.current || !e.currentTarget.contains(e.target as Element)) {
      return;
    }

    let handleArrowBackward = () => {
      if (node.hasChildNodes && isExpanded) {
        if (e.altKey) {
          let expandedKeys = new Set(state.expandedKeys);
          for (let descendant of getDescendantNodes(node, state.collection)) {
            expandedKeys.delete(descendant.key);
          }
          state.setExpandedKeys(expandedKeys);
        } else {
          state.toggleKey(node.key);
        }
      } else if (node?.parentKey) {
        let parentNode = state.collection.getItem(node.parentKey);
        if (parentNode?.type === 'item') {
          selectionManager.setFocusedKey(node.parentKey);
        }
      }
    };
    let handleArrowForward = () => {
      if (node.hasChildNodes && !isExpanded) {
        if (e.altKey) {
          let expandedKeys = new Set(state.expandedKeys);
          for (let descendant of getDescendantNodes(node, state.collection)) {
            expandedKeys.add(descendant.key);
          }
          state.setExpandedKeys(expandedKeys);
        } else {
          state.toggleKey(node.key);
        }
      } else if (node.hasChildNodes) {
        let firstChild = state.collection.getKeyAfter(node.key);
        if (firstChild) {
          selectionManager.setFocusedKey(firstChild);
        }
      }
    };

    switch (e.key) {
      case 'ArrowLeft': {
        e.preventDefault();
        if (direction === 'rtl') {
          handleArrowForward();
        } else {
          handleArrowBackward();
        }
        break;
      }
      case 'ArrowRight': {
        e.preventDefault();
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
    'aria-current': itemStates.isSelected ? 'page' : undefined,
  };

  if (isVirtualized) {
    let index = Number(state.collection.getItem(node.key)?.index);
    itemProps['aria-posinset'] = Number.isNaN(index) ? undefined : index + 1;
    itemProps['aria-setsize'] = getItemCount(state.collection);
  }

  return {
    itemProps,
    ...itemStates,
    isExpanded: node.hasChildNodes && isExpanded,
    isSelectedAncestor,
    isHovered,
  };
}

/** Get descendants that contain children, inclusive of the root node. */
function getDescendantNodes<T>(
  node: Node<T>,
  collection: Collection<Node<T>>,
  depth = Infinity
) {
  const descendants = new Set<Node<T>>();

  if (depth === 0 || !node.hasChildNodes) {
    return descendants;
  }

  descendants.add(node);

  for (let child of getChildNodes(node, collection)) {
    const childDescendants = getDescendantNodes(child, collection, depth - 1);
    for (let descendant of childDescendants) {
      descendants.add(descendant);
    }
  }

  return descendants;
}

function getAncestors<T>(
  collection: Collection<Node<T>>,
  node: Node<T>
): Node<T>[] {
  let parents = [];

  while (node?.parentKey != null) {
    // @ts-expect-error if there's a `parentKey`, there's a parent...
    node = collection.getItem(node.parentKey);
    parents.unshift(node);
  }

  return parents;
}
