import { useGridList } from '@react-aria/gridlist';
import type { DroppableCollectionResult } from '@react-aria/dnd';
import { FocusScope } from '@react-aria/focus';
import { useLocalizedStringFormatter } from '@react-aria/i18n';
import { Virtualizer } from '@react-aria/virtualizer';
import { filterDOMProps, mergeProps, useObjectRef } from '@react-aria/utils';
import type {
  DraggableCollectionState,
  DroppableCollectionState,
} from '@react-stately/dnd';
import { ListState, useListState } from '@react-stately/list';
import { assert } from 'emery';
import React, {
  Key,
  PropsWithChildren,
  ReactElement,
  RefObject,
  useEffect,
  useMemo,
  useRef,
} from 'react';

import { useProvider } from '@keystar/ui/core';
import { ProgressCircle } from '@keystar/ui/progress';
import {
  FocusRing,
  classNames,
  css,
  toDataAttributes,
  tokenSchema,
  useStyleProps,
} from '@keystar/ui/style';

import { listViewClassList } from './class-list';
import { ListViewProvider, useListViewContext } from './context';
import localizedMessages from './l10n';
import { DragPreview as DragPreviewElement } from './DragPreview';
import { InsertionIndicator } from './InsertionIndicator';
import { ListViewItem } from './ListViewItem';
import { ListViewLayout } from './ListViewLayout';
import RootDropIndicator from './RootDropIndicator';
import { ListViewProps } from './types';
import { ListKeyboardDelegate } from '@react-aria/selection';

const ROW_HEIGHTS = {
  compact: {
    medium: 32,
    large: 40,
  },
  regular: {
    medium: 40,
    large: 50,
  },
  spacious: {
    medium: 48,
    large: 60,
  },
} as const;

function useListLayout<T>(
  state: ListState<T>,
  density: NonNullable<ListViewProps<T>['density']>,
  overflowMode: ListViewProps<T>['overflowMode']
) {
  let { scale } = useProvider();
  let layout = useMemo(
    () =>
      new ListViewLayout<T>({
        estimatedRowHeight:
          overflowMode === 'wrap' ? undefined : ROW_HEIGHTS[density][scale],
      }),
    [scale, density, overflowMode]
  );

  return layout;
}

function ListView<T extends object>(
  props: ListViewProps<T>,
  ref: RefObject<HTMLDivElement>
) {
  let {
    density = 'regular',
    loadingState,
    onLoadMore,
    isQuiet,
    overflowMode = 'truncate',
    onAction,
    dragAndDropHooks,
    renderEmptyState,
    ...otherProps
  } = props;

  let isListDraggable = !!dragAndDropHooks?.useDraggableCollectionState;
  let isListDroppable = !!dragAndDropHooks?.useDroppableCollectionState;

  let dragHooksProvided = useRef(isListDraggable);
  let dropHooksProvided = useRef(isListDroppable);

  useEffect(() => {
    if (dragHooksProvided.current !== isListDraggable) {
      console.warn(
        'Drag hooks were provided during one render, but not another. This should be avoided as it may produce unexpected behavior.'
      );
    }
    if (dropHooksProvided.current !== isListDroppable) {
      console.warn(
        'Drop hooks were provided during one render, but not another. This should be avoided as it may produce unexpected behavior.'
      );
    }
  }, [isListDraggable, isListDroppable]);

  let domRef = useObjectRef(ref);
  let state = useListState({
    ...props,
    selectionBehavior:
      props.selectionStyle === 'highlight' ? 'replace' : 'toggle',
  });
  let { collection, selectionManager } = state;
  let stringFormatter = useLocalizedStringFormatter(localizedMessages);
  let isLoading = loadingState === 'loading' || loadingState === 'loadingMore';

  let styleProps = useStyleProps(props);
  let preview = useRef(null);

  // DraggableCollectionState;
  let dragState!: DraggableCollectionState;
  if (
    isListDraggable &&
    dragAndDropHooks?.useDraggableCollectionState &&
    dragAndDropHooks?.useDraggableCollection
  ) {
    // consumers are warned when hooks change between renders
    // eslint-disable-next-line react-compiler/react-compiler
    dragState = dragAndDropHooks.useDraggableCollectionState({
      collection,
      selectionManager,
      preview,
    });
    // eslint-disable-next-line react-compiler/react-compiler
    dragAndDropHooks.useDraggableCollection({}, dragState, domRef);
  }
  let layout = useListLayout(state, props.density || 'regular', overflowMode);

  let DragPreview = dragAndDropHooks?.DragPreview;
  let dropState!: DroppableCollectionState;
  let droppableCollection: DroppableCollectionResult;
  let isRootDropTarget: boolean;
  if (
    isListDroppable &&
    dragAndDropHooks?.useDroppableCollectionState &&
    dragAndDropHooks?.useDroppableCollection
  ) {
    // consumers are warned when hooks change between renders
    // eslint-disable-next-line react-compiler/react-compiler
    dropState = dragAndDropHooks.useDroppableCollectionState({
      collection,
      selectionManager,
    });
    // eslint-disable-next-line react-compiler/react-compiler
    droppableCollection = dragAndDropHooks.useDroppableCollection(
      {
        keyboardDelegate: new ListKeyboardDelegate({
          collection,
          disabledKeys: dragState?.draggingKeys.size
            ? undefined
            : selectionManager.disabledKeys,
          ref: domRef,
          layoutDelegate: layout,
        }),
        dropTargetDelegate: layout,
      },
      dropState,
      domRef
    );

    isRootDropTarget = dropState.isDropTarget({ type: 'root' });
  }

  let { gridProps } = useGridList(
    {
      ...props,
      isVirtualized: true,
      layoutDelegate: layout,
      onAction,
    },
    state,
    domRef
  );

  let focusedKey = selectionManager.focusedKey;
  let dropTargetKey: Key | null = null;
  if (dropState?.target?.type === 'item') {
    dropTargetKey = dropState.target.key;
    if (dropState.target.dropPosition === 'after') {
      // Normalize to the "before" drop position since we only render those in the DOM.
      dropTargetKey =
        state.collection.getKeyAfter(dropTargetKey) ?? dropTargetKey;
    }
  }

  let persistedKeys = useMemo(() => {
    return new Set([focusedKey, dropTargetKey].filter(k => k !== null));
  }, [focusedKey, dropTargetKey]);

  let hasAnyChildren = useMemo(
    () => [...collection].some(item => item.hasChildNodes),
    [collection]
  );

  return (
    <ListViewProvider
      value={{
        density,
        // @ts-expect-error
        dragAndDropHooks,
        dragState,
        dropState,
        isListDraggable,
        isListDroppable,
        layout,
        // @ts-expect-error
        loadingState,
        // @ts-expect-error
        onAction,
        overflowMode,
        renderEmptyState,
        state,
      }}
    >
      <FocusScope>
        <FocusRing>
          <Virtualizer
            {...mergeProps(
              // @ts-expect-error
              isListDroppable ? droppableCollection?.collectionProps : {},
              gridProps
            )}
            {...filterDOMProps(otherProps)}
            {...gridProps}
            {...styleProps}
            {...toDataAttributes({
              childNodes: hasAnyChildren,
              density,
              draggable: isListDraggable,
              // @ts-expect-error
              dropTarget: isRootDropTarget,
              overflowMode,
            })}
            isLoading={isLoading}
            onLoadMore={onLoadMore}
            ref={domRef}
            persistedKeys={persistedKeys}
            scrollDirection="vertical"
            layout={layout}
            layoutOptions={useMemo(() => ({ isLoading }), [isLoading])}
            collection={collection}
            className={classNames(
              listViewClassList.element('root'),
              css({
                backgroundColor: tokenSchema.color.background.canvas,
                border: `${tokenSchema.size.border.regular} solid ${tokenSchema.color.border.neutral}`,
                borderRadius: tokenSchema.size.radius.medium,
                boxSizing: 'content-box', // resolves measurement/scroll issues related to border
                outline: 0,
                overflow: 'auto',
                position: 'relative',
                transform: 'translate3d(0, 0, 0)',
                userSelect: 'none',

                '&[data-drop-target=true]': {
                  borderColor: tokenSchema.color.alias.focusRing,
                  backgroundColor: tokenSchema.color.alias.backgroundSelected,
                  boxShadow: `inset 0 0 0 1px ${tokenSchema.color.alias.focusRing}`,
                },
                '&[data-focus=visible]': {
                  borderColor: tokenSchema.color.alias.focusRing,
                  boxShadow: `inset 0 0 0 1px ${tokenSchema.color.alias.focusRing}`,
                },
              }),
              styleProps.className
            )}
          >
            {(type, item) => {
              if (type === 'item') {
                return (
                  <>
                    {isListDroppable &&
                      collection.getKeyBefore(item.key) == null && (
                        <RootDropIndicator key="root" />
                      )}
                    {isListDroppable && (
                      <InsertionIndicator
                        key={`${item.key}-before`}
                        target={{
                          key: item.key,
                          type: 'item',
                          dropPosition: 'before',
                        }}
                      />
                    )}
                    <ListViewItem
                      item={item}
                      isEmphasized
                      hasActions={!!onAction}
                    />
                    {isListDroppable && (
                      <InsertionIndicator
                        key={`${item.key}-after`}
                        target={{
                          key: item.key,
                          type: 'item',
                          dropPosition: 'after',
                        }}
                        isPresentationOnly={
                          collection.getKeyAfter(item.key) != null
                        }
                      />
                    )}
                  </>
                );
              } else if (type === 'loader') {
                return (
                  <CenteredWrapper>
                    <ProgressCircle
                      isIndeterminate
                      size={density === 'compact' ? 'small' : undefined}
                      aria-label={
                        collection.size > 0
                          ? stringFormatter.format('loadingMore')
                          : stringFormatter.format('loading')
                      }
                    />
                  </CenteredWrapper>
                );
              } else if (type === 'placeholder') {
                let emptyState = props.renderEmptyState
                  ? props.renderEmptyState()
                  : null;
                if (emptyState == null) {
                  return null;
                }

                return <CenteredWrapper>{emptyState}</CenteredWrapper>;
              }
            }}
          </Virtualizer>
        </FocusRing>
      </FocusScope>
      {DragPreview && isListDraggable && (
        <DragPreview ref={preview}>
          {() => {
            // @ts-expect-error FIXME
            let item = state.collection.getItem(dragState.draggedKey);

            assert(item != null, 'Dragged item must exist in collection.');

            let itemCount = dragState.draggingKeys.size;
            // @ts-expect-error
            let itemHeight = layout.getLayoutInfo(dragState.draggedKey).rect
              .height;

            return (
              <DragPreviewElement
                item={item}
                itemCount={itemCount}
                itemHeight={itemHeight}
                density={density}
              />
            );
          }}
        </DragPreview>
      )}
    </ListViewProvider>
  );
}

function CenteredWrapper({ children }: PropsWithChildren) {
  let { state } = useListViewContext();
  return (
    <div
      role="row"
      aria-rowindex={state.collection.size + 1}
      data-has-items={state.collection.size > 0}
      className={classNames(
        listViewClassList.element('centered-wrapper'),
        css({
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          width: '100%',

          // if there's items it must be loading—add a gutter between the items
          // and the loading indicator
          '&[data-has-items=true]': {
            paddingTop: tokenSchema.size.space.regular,
          },
        })
      )}
    >
      <div role="gridcell">{children}</div>
    </div>
  );
}

/**
 * Displays a list of interactive items, and allows a user to navigate, select,
 * or perform an action.
 */
const _ListView = React.forwardRef(ListView as any) as <T>(
  props: ListViewProps<T> & { ref?: RefObject<HTMLDivElement> }
) => ReactElement;
export { _ListView as ListView };
