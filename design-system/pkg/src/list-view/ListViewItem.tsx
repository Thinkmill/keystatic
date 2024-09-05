import type {
  DraggableItemResult,
  DropIndicatorAria,
  DroppableItemResult,
} from '@react-aria/dnd';

import { useButton } from '@react-aria/button';
import { useFocusRing } from '@react-aria/focus';
import { useHover } from '@react-aria/interactions';
import {
  useGridListItem,
  useGridListSelectionCheckbox,
} from '@react-aria/gridlist';
import { useLocale } from '@react-aria/i18n';
import { mergeProps } from '@react-aria/utils';
import { useVisuallyHidden } from '@react-aria/visually-hidden';
import { DropTarget, Node } from '@react-types/shared';
import { assert } from 'emery';
import React, { useRef } from 'react';

import { Checkbox } from '@keystar/ui/checkbox';
import { KeystarProvider } from '@keystar/ui/core';
import { Icon } from '@keystar/ui/icon';
import { chevronLeftIcon } from '@keystar/ui/icon/icons/chevronLeftIcon';
import { chevronRightIcon } from '@keystar/ui/icon/icons/chevronRightIcon';
import { gripVerticalIcon } from '@keystar/ui/icon/icons/gripVerticalIcon';
import { Flex, Grid } from '@keystar/ui/layout';
import { ClearSlots, SlotProvider } from '@keystar/ui/slots';
import {
  FocusRing,
  classNames,
  css,
  toDataAttributes,
  tokenSchema,
  transition,
} from '@keystar/ui/style';
import { Text } from '@keystar/ui/typography';
import { isReactText } from '@keystar/ui/utils';

import { listViewClassList, listViewItemClassList } from './class-list';
import { useListViewContext } from './context';

interface ListViewItemProps<T> {
  item: Node<T>;
  isEmphasized: boolean;
  hasActions: boolean;
}

export function ListViewItem<T>(props: ListViewItemProps<T>) {
  let { item } = props;
  let {
    density,
    dragAndDropHooks,
    dragState,
    dropState,
    isListDraggable,
    isListDroppable,
    layout,
    loadingState,
    overflowMode,
    state,
  } = useListViewContext();
  let { direction } = useLocale();
  let rowRef = useRef<HTMLDivElement>(null);
  let { isFocusVisible: isFocusVisibleWithin, focusProps: focusWithinProps } =
    useFocusRing({ within: true });
  let { isFocusVisible, focusProps } = useFocusRing();
  let {
    rowProps,
    gridCellProps,
    isPressed,
    descriptionProps,
    isDisabled,
    allowsSelection,
    hasAction,
  } = useGridListItem(
    {
      node: item,
      isVirtualized: true,
      shouldSelectOnPressUp: isListDraggable,
    },
    state,
    rowRef
  );
  let isDroppable = isListDroppable && !isDisabled;
  let { hoverProps, isHovered } = useHover({
    isDisabled: !allowsSelection && !hasAction,
  });

  let { checkboxProps } = useGridListSelectionCheckbox(
    { key: item.key },
    state
  );

  let draggableItem: DraggableItemResult | null;
  if (isListDraggable) {
    // FIXME: improve implementation/types such that these guards aren't necessary
    assert(
      !!(dragAndDropHooks && dragAndDropHooks.useDraggableItem),
      'useDraggableItem is missing from dragAndDropHooks'
    );
    draggableItem = dragAndDropHooks.useDraggableItem(
      { key: item.key, hasDragButton: true },
      dragState
    );
    if (isDisabled) {
      draggableItem = null;
    }
  }
  let droppableItem: DroppableItemResult;
  let isDropTarget: boolean;
  let dropIndicator: DropIndicatorAria;
  let dropIndicatorRef = useRef<HTMLDivElement>(null);
  if (isListDroppable) {
    let target = {
      type: 'item',
      key: item.key,
      dropPosition: 'on',
    } as DropTarget;
    isDropTarget = dropState.isDropTarget(target);
    // FIXME: improve implementation/types such that these guards aren't necessary
    assert(
      !!(dragAndDropHooks && dragAndDropHooks.useDropIndicator),
      'useDropIndicator is missing from dragAndDropHooks'
    );
    dropIndicator = dragAndDropHooks.useDropIndicator(
      { target },
      dropState,
      dropIndicatorRef
    );
  }

  let dragButtonRef = useRef<HTMLDivElement>(null);
  let { buttonProps } = useButton(
    {
      // @ts-expect-error
      ...draggableItem?.dragButtonProps,
      elementType: 'div',
    },
    dragButtonRef
  );
  let chevron = (
    <Icon
      {...toDataAttributes({
        disabled: !hasAction,
        visible: item.props.hasChildItems,
      })}
      color="neutral"
      src={direction === 'ltr' ? chevronRightIcon : chevronLeftIcon}
      aria-hidden="true"
      UNSAFE_className={classNames(
        listViewItemClassList.element('parent-indicator'),
        css({
          display: 'none',
          gridArea: 'chevron',
          marginInlineStart: tokenSchema.size.space.regular,

          [`${listViewItemClassList.selector(
            'root'
          )}[data-child-nodes=true] &`]: {
            display: 'inline-block',
            visibility: 'hidden',
          },

          '&[data-visible=true]': {
            visibility: 'visible',
          },
          '&[data-disabled=true]': {
            stroke: tokenSchema.color.alias.foregroundDisabled,
          },
        })
      )}
    />
  );

  let showCheckbox =
    state.selectionManager.selectionMode !== 'none' &&
    state.selectionManager.selectionBehavior === 'toggle';
  let { visuallyHiddenProps } = useVisuallyHidden();

  let dropProps = isDroppable
    ? // @ts-expect-error
      droppableItem?.dropProps
    : // @ts-expect-error
      { 'aria-hidden': droppableItem?.dropProps['aria-hidden'] };
  const mergedProps = mergeProps(
    rowProps,
    // @ts-expect-error
    draggableItem?.dragProps,
    dropProps,
    hoverProps,
    focusWithinProps,
    focusProps,
    // Remove tab index from list row if performing a screenreader drag. This prevents TalkBack from focusing the row,
    // allowing for single swipe navigation between row drop indicator
    // @ts-expect-error
    dragAndDropHooks?.isVirtualDragging() && { tabIndex: null }
  );

  let isFirstRow = item.prevKey == null;
  let isLastRow = item.nextKey == null;
  // Figure out if the ListView content is equal or greater in height to the container. If so, we'll need to round the bottom
  // border corners of the last row when selected and we can get rid of the bottom border if it isn't selected to avoid border overlap
  // with bottom border
  let isFlushWithContainerBottom = false;
  if (isLastRow && loadingState !== 'loadingMore') {
    if (
      layout.getContentSize()?.height >= layout.virtualizer?.visibleRect.height
    ) {
      isFlushWithContainerBottom = true;
    }
  }

  let content = isReactText(item.rendered) ? (
    <Text>{item.rendered}</Text>
  ) : (
    item.rendered
  );
  if (isDisabled) {
    content = <KeystarProvider isDisabled>{content}</KeystarProvider>;
  }

  return (
    <div
      {...mergedProps}
      {...toDataAttributes({ 'flush-last': isFlushWithContainerBottom })}
      className={classNames(
        listViewItemClassList.element('row'),
        css({
          cursor: 'default',
          outline: 0,
          position: 'relative',

          /* box shadow for bottom border */
          '&:not([data-flush-last=true])::after': {
            boxShadow: `inset 0 -1px 0 0 ${tokenSchema.color.border.neutral}`,
            content: '" "',
            display: 'block',
            insetBlockEnd: 0,
            insetBlockStart: 0,
            insetInlineEnd: 0,
            insetInlineStart: 0,
            pointerEvents: 'none',
            position: 'absolute',
            zIndex: 3,
          },
        })
      )}
      ref={rowRef}
    >
      <div
        {...toDataAttributes({
          first: isFirstRow || undefined,
          last: isLastRow || undefined,
          // @ts-expect-error
          droppable: isDropTarget || undefined,
          draggable: isListDraggable || undefined,
          focus: isFocusVisible
            ? 'visible'
            : isFocusVisibleWithin
            ? 'within'
            : undefined,
          interaction: isPressed ? 'press' : isHovered ? 'hover' : undefined,
        })}
        className={classNames(
          listViewItemClassList.element('root'),
          css({
            display: 'grid',
            paddingInline: tokenSchema.size.space.medium,
            position: 'relative',
            outline: 0,

            // density
            minHeight: tokenSchema.size.element.medium,
            paddingBlock: tokenSchema.size.space.medium,
            [`${listViewClassList.selector('root')}[data-density="compact"] &`]:
              {
                minHeight: tokenSchema.size.element.regular,
                paddingBlock: tokenSchema.size.space.regular,
              },
            [`${listViewClassList.selector(
              'root'
            )}[data-density="spacious"] &`]: {
              minHeight: tokenSchema.size.element.large,
              paddingBlock: tokenSchema.size.space.large,
            },

            // variants
            '&[data-draggable=true]': {
              paddingInlineStart: tokenSchema.size.space.small,
            },

            // interactions
            '&[data-interaction="hover"]': {
              backgroundColor: tokenSchema.color.alias.backgroundHovered,
            },
            '&[data-interaction="press"]': {
              backgroundColor: tokenSchema.color.alias.backgroundPressed,
            },

            // focus indicator
            '&[data-focus="visible"]': {
              '&::before': {
                backgroundColor: tokenSchema.color.background.accentEmphasis,
                borderRadius: tokenSchema.size.space.small,
                content: '""',
                insetBlock: 0,
                insetInlineStart: tokenSchema.size.space.xsmall,
                marginBlock: tokenSchema.size.space.xsmall,
                marginInlineEnd: `calc(${tokenSchema.size.space.small} * -1)`,
                position: 'absolute',
                width: tokenSchema.size.space.small,
              },
            },

            // selected
            [`${listViewItemClassList.selector(
              'row'
            )}[aria-selected="true"] &`]: {
              backgroundColor: tokenSchema.color.alias.backgroundSelected,
              // boxShadow: `0 0 0 ${tokenSchema.size.border.regular} ${tokenSchema.color.alias.focusRing}`,

              '&[data-interaction="hover"], &[data-focus="visible"]': {
                backgroundColor:
                  tokenSchema.color.alias.backgroundSelectedHovered,
              },
            },
          })
        )}
        {...gridCellProps}
      >
        <Grid
          UNSAFE_className={listViewItemClassList.element('grid')}
          // minmax supports `ActionGroup` buttonLabelBehavior="collapse"
          columns="auto auto auto 1fr minmax(0px, auto) auto auto"
          rows="1fr auto"
          areas={[
            'draghandle checkbox thumbnail content actions actionmenu chevron',
            'draghandle checkbox thumbnail description actions actionmenu chevron',
          ]}
          alignItems="center"
        >
          {isListDraggable && (
            <div
              className={classNames(
                css({
                  gridArea: 'draghandle',

                  display: 'flex',
                  justifyContent: 'center',
                  width: tokenSchema.size.element.small,
                })
              )}
            >
              {!isDisabled && (
                <FocusRing>
                  <div
                    {...(buttonProps as React.HTMLAttributes<HTMLElement>)}
                    className={classNames(
                      listViewItemClassList.element('draghandle'),
                      css({
                        outline: 0,
                        position: 'relative',

                        // focus ring
                        '::after': {
                          borderRadius: tokenSchema.size.radius.small,
                          content: '""',
                          inset: 0,
                          margin: 0,
                          position: 'absolute',
                          transition: transition(['box-shadow', 'margin'], {
                            easing: 'easeOut',
                          }),
                        },
                        '&[data-focus=visible]::after': {
                          boxShadow: `0 0 0 ${tokenSchema.size.alias.focusRing} ${tokenSchema.color.alias.focusRing}`,
                          margin: `calc(${tokenSchema.size.alias.focusRingGap} * -1)`,
                        },
                      })
                    )}
                    ref={dragButtonRef}
                    draggable="true"
                  >
                    <Icon src={gripVerticalIcon} color="neutral" />
                  </div>
                </FocusRing>
              )}
            </div>
          )}
          {/* @ts-expect-error */}
          {isListDroppable && !dropIndicator?.isHidden && (
            <div
              role="button"
              {...visuallyHiddenProps}
              // @ts-expect-error
              {...dropIndicator?.dropIndicatorProps}
              ref={dropIndicatorRef}
            />
          )}
          {showCheckbox && (
            <Flex
              gridArea="checkbox"
              alignItems="center"
              justifyContent="center"
            >
              <Checkbox
                {...checkboxProps}
                UNSAFE_className={classNames(
                  listViewItemClassList.element('checkbox'),
                  css({
                    paddingInlineEnd: tokenSchema.size.space.regular,
                  })
                )}
              />
            </Flex>
          )}
          <SlotProvider
            slots={{
              text: {
                color: isDisabled
                  ? 'color.alias.foregroundDisabled'
                  : undefined,
                gridArea: 'content',
                flexGrow: 1,
                truncate: overflowMode === 'truncate',
                weight: 'medium',
                UNSAFE_className: listViewItemClassList.element('content'),
              },
              description: {
                color: isDisabled
                  ? 'color.alias.foregroundDisabled'
                  : 'neutralSecondary',
                size: 'small',
                gridArea: 'description',
                flexGrow: 1,
                marginTop: 'regular',
                truncate: overflowMode === 'truncate',
                UNSAFE_className: listViewItemClassList.element('description'),
                ...descriptionProps,
              },
              image: {
                borderRadius: 'xsmall',
                gridArea: 'thumbnail',
                marginEnd: 'regular',
                overflow: 'hidden',
                height:
                  density === 'compact' ? 'element.small' : 'element.regular',
                UNSAFE_className: listViewItemClassList.element('thumbnail'),
              },
              button: {
                UNSAFE_className: listViewItemClassList.element('actions'),
                prominence: 'low',
                gridArea: 'actions',
              },
              actionGroup: {
                UNSAFE_className: listViewItemClassList.element('actions'),
                prominence: 'low',
                gridArea: 'actions',
                density: 'compact',
              },
              actionMenu: {
                UNSAFE_className: listViewItemClassList.element('actionmenu'),
                prominence: 'low',
                gridArea: 'actionmenu',
              },
            }}
          >
            {content}
            <ClearSlots>{chevron}</ClearSlots>
          </SlotProvider>
        </Grid>
      </div>
    </div>
  );
}
