import { assert } from 'emery';
import {
  type CSSProperties,
  // type ForwardedRef,
  type HTMLAttributes,
  type Key,
  type PropsWithChildren,
  type ReactElement,
  type ReactNode,
  type RefObject,
  Children,
  cloneElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useButton } from '@react-aria/button';
import {
  DraggableItemResult,
  DropIndicatorAria,
  DroppableCollectionResult,
  DroppableItemResult,
  DropTarget,
} from '@react-aria/dnd';
import { FocusScope, useFocusRing } from '@react-aria/focus';
import { useLocale, useLocalizedStringFormatter } from '@react-aria/i18n';
import {
  getInteractionModality,
  useHover,
  usePress,
} from '@react-aria/interactions';
import { ListKeyboardDelegate } from '@react-aria/selection';
import {
  useTable,
  useTableCell,
  useTableColumnHeader,
  useTableHeaderRow,
  useTableRow,
  useTableRowGroup,
  useTableSelectAllCheckbox,
  useTableSelectionCheckbox,
} from '@react-aria/table';
import {
  mergeProps,
  scrollIntoView,
  scrollIntoViewport,
  useLoadMore,
} from '@react-aria/utils';
import {
  layoutInfoToStyle,
  ScrollView,
  setScrollLeft,
  VirtualizerItem,
  VirtualizerItemOptions,
} from '@react-aria/virtualizer';
import { useVisuallyHidden, VisuallyHidden } from '@react-aria/visually-hidden';
import {
  DraggableCollectionState,
  DroppableCollectionState,
} from '@react-stately/dnd';
import {
  TableState,
  useTableColumnResizeState,
  useTableState,
} from '@react-stately/table';
import {
  LayoutInfo,
  Rect,
  ReusableView,
  useVirtualizerState,
} from '@react-stately/virtualizer';
import { GridNode } from '@react-types/grid';
import { ColumnSize, TableCollection } from '@react-types/table';

import { Checkbox } from '@keystar/ui/checkbox';
import { Icon } from '@keystar/ui/icon';
import { gripVerticalIcon } from '@keystar/ui/icon/icons/gripVerticalIcon';
import { ProgressCircle } from '@keystar/ui/progress';
import { SlotProvider } from '@keystar/ui/slots';
import {
  classNames,
  css,
  FocusRing,
  toDataAttributes,
  tokenSchema,
  useStyleProps,
} from '@keystar/ui/style';
import { TooltipTrigger, Tooltip } from '@keystar/ui/tooltip';
import { Text } from '@keystar/ui/typography';
import { isReactText } from '@keystar/ui/utils';

import {
  TableContext,
  TableRowContext,
  useTableContext,
  useTableRowContext,
  VirtualizerContext,
} from './context';
import { DragPreview as KeystarDragPreview } from './DragPreview';
import { InsertionIndicator } from './InsertionIndicator';
import localizedMessages from './l10n';
import { Resizer, ResizeStateContext, useResizeStateContext } from './Resizer';
import {
  SortIndicator,
  bodyClassname,
  bodyResizeIndicatorClassname,
  cellClassname,
  cellWrapperClassname,
  centeredWrapperClassname,
  checkboxCellClassname,
  columnResizeIndicatorClassname,
  dragCellClassname,
  headerCellClassname,
  headerClassname,
  headerWrapperClassname,
  rowClassname,
  tableClassname,
} from './styles';
import { TableViewLayout } from './TableViewLayout';
import { ColumnProps, TableCosmeticConfig, TableProps } from './types';

// Constants

const DEFAULT_HEADER_HEIGHT = 36;
const DEFAULT_HIDE_HEADER_CELL_WIDTH = 36;
const SELECTION_CELL_DEFAULT_WIDTH = 36;
const DRAG_BUTTON_CELL_DEFAULT_WIDTH = 20;
const ROW_HEIGHTS = {
  compact: 28,
  regular: 36,
  spacious: 44,
} as const;

// Main

export function TableView<T extends object>(
  props: TableProps<T>
  // forwardedRef: ForwardedRef<HTMLDivElement>
) {
  let {
    density = 'regular',
    prominence = 'default',
    dragAndDropHooks,
    onAction,
    onResizeEnd: propsOnResizeEnd,
    onResizeStart: propsOnResizeStart,
    overflowMode = 'truncate',
  } = props;

  let isTableDraggable = !!dragAndDropHooks?.useDraggableCollectionState;
  let isTableDroppable = !!dragAndDropHooks?.useDroppableCollectionState;
  let dragHooksProvided = useRef(isTableDraggable);
  let dropHooksProvided = useRef(isTableDroppable);
  let state = useTableState({
    ...props,
    showSelectionCheckboxes: true,
    showDragButtons: isTableDraggable,
    selectionBehavior: 'toggle',
  });

  useEffect(() => {
    if (dragHooksProvided.current !== isTableDraggable) {
      console.warn(
        'Drag hooks were provided during one render, but not another. This should be avoided as it may produce unexpected behavior.'
      );
    }
    if (dropHooksProvided.current !== isTableDroppable) {
      console.warn(
        'Drop hooks were provided during one render, but not another. This should be avoided as it may produce unexpected behavior.'
      );
    }
    if ('expandedKeys' in state && (isTableDraggable || isTableDroppable)) {
      console.warn(
        'Drag and drop is not yet fully supported with expandable rows and may produce unexpected results.'
      );
    }
  }, [isTableDraggable, isTableDroppable, state]);

  // Starts when the user selects resize from the menu, ends when resizing ends
  // used to control the visibility of the resizer Nubbin
  let [isInResizeMode, setIsInResizeMode] = useState(false);
  // Starts when the resizer is actually moved
  // entering resizing/exiting resizing doesn't trigger a render
  // with table layout, so we need to track it here
  let [, setIsResizing] = useState(false);

  // TODO: support consumer provided ref
  // let domRef = useObjectRef(forwardedRef);
  let domRef = useRef<HTMLDivElement>(null);
  let headerRef = useRef<HTMLDivElement>(null);
  let bodyRef = useRef<HTMLDivElement>(null);
  let styleProps = useStyleProps(props);

  let layout = useMemo(
    () =>
      new TableViewLayout<T>({
        // If props.overflowMode is wrap, then use estimated heights based on scale, otherwise use fixed heights.
        rowHeight:
          props.overflowMode === 'wrap' ? undefined : ROW_HEIGHTS[density],
        estimatedRowHeight:
          props.overflowMode === 'wrap' ? ROW_HEIGHTS[density] : undefined,
        headingHeight:
          props.overflowMode === 'wrap' ? undefined : DEFAULT_HEADER_HEIGHT,
        estimatedHeadingHeight:
          props.overflowMode === 'wrap' ? DEFAULT_HEADER_HEIGHT : undefined,
      }),
    [props.overflowMode, density]
  );

  let dragState: DraggableCollectionState | undefined = undefined;
  let preview = useRef(null);
  if (
    dragAndDropHooks?.useDraggableCollection &&
    dragAndDropHooks?.useDraggableCollectionState
  ) {
    dragState = dragAndDropHooks.useDraggableCollectionState({
      collection: state.collection,
      selectionManager: state.selectionManager,
      preview,
    });
    dragAndDropHooks.useDraggableCollection({}, dragState, domRef);
  }

  let DragPreview = dragAndDropHooks?.DragPreview;
  let dropState: DroppableCollectionState | undefined = undefined;
  let droppableCollection: DroppableCollectionResult | undefined = undefined;
  let isRootDropTarget = false;
  if (
    dragAndDropHooks?.useDroppableCollection &&
    dragAndDropHooks?.useDroppableCollectionState
  ) {
    dropState = dragAndDropHooks.useDroppableCollectionState({
      collection: state.collection,
      selectionManager: state.selectionManager,
    });
    droppableCollection = dragAndDropHooks.useDroppableCollection(
      {
        keyboardDelegate: new ListKeyboardDelegate({
          collection: state.collection,
          disabledKeys: state.selectionManager.disabledKeys,
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

  let { gridProps } = useTable(
    {
      ...props,
      isVirtualized: true,
      layoutDelegate: layout,
      onRowAction: onAction ?? props.onRowAction,
      scrollRef: bodyRef,
    },
    state,
    domRef
  );
  let [headerMenuOpen, setHeaderMenuOpen] = useState(false);
  let [headerRowHovered, setHeaderRowHovered] = useState(false);

  // This overrides collection view's renderWrapper to support DOM hierarchy.
  let renderWrapper = useCallback(
    (
      parent: View,
      reusableView: View,
      children: View[],
      renderChildren: (views: View[]) => ReactElement[]
    ) => {
      if (reusableView.viewType === 'rowgroup') {
        return (
          <TableBody
            key={reusableView.key}
            layoutInfo={reusableView.layoutInfo!}
            parent={parent?.layoutInfo}
            // Override the default role="rowgroup" with role="presentation",
            // in favor or adding role="rowgroup" to the ScrollView with
            // ref={bodyRef} in the TableVirtualizer below.
            role="presentation"
          >
            {renderChildren(children)}
          </TableBody>
        );
      }

      if (reusableView.viewType === 'header') {
        return (
          <TableHead
            key={reusableView.key}
            layoutInfo={reusableView.layoutInfo!}
            parent={parent?.layoutInfo}
          >
            {renderChildren(children)}
          </TableHead>
        );
      }

      if (reusableView.viewType === 'row') {
        return (
          <TableRow
            key={reusableView.key}
            item={reusableView.content}
            layoutInfo={reusableView.layoutInfo!}
            parent={parent?.layoutInfo}
          >
            {renderChildren(children)}
          </TableRow>
        );
      }

      if (reusableView.viewType === 'headerrow') {
        return (
          <TableHeaderRow
            onHoverChange={setHeaderRowHovered}
            key={reusableView.key}
            // @ts-expect-error
            layoutInfo={reusableView.layoutInfo}
            parent={parent?.layoutInfo}
            item={reusableView.content}
          >
            {renderChildren(children)}
          </TableHeaderRow>
        );
      }

      return (
        <TableCellWrapper
          key={reusableView.key}
          // @ts-expect-error
          layoutInfo={reusableView.layoutInfo}
          virtualizer={reusableView.virtualizer}
          parent={parent}
        >
          {reusableView.rendered}
        </TableCellWrapper>
      );
    },
    []
  );

  let renderView = useCallback((type: string, item: GridNode<T>) => {
    switch (type) {
      case 'header':
      case 'rowgroup':
      case 'section':
      case 'row':
      case 'headerrow':
        return null;
      case 'cell': {
        if (item.props.isSelectionCell) {
          return <TableCheckboxCell cell={item} />;
        }

        if (item.props.isDragButtonCell) {
          return <TableDragCell cell={item} />;
        }

        return <TableCell cell={item} />;
      }
      case 'placeholder':
        return (
          <div
            role="gridcell"
            aria-colindex={item.index && item.index + 1}
            aria-colspan={
              item.colspan && item.colspan > 1 ? item.colspan : undefined
            }
          />
        );
      case 'column':
        if (item.props.isSelectionCell) {
          return <TableSelectAllCell column={item} />;
        }

        if (item.props.isDragButtonCell) {
          return <TableDragHeaderCell column={item} />;
        }

        // TODO: consider this case, what if we have hidden headers and a empty table
        if (item.props.hideHeader) {
          return (
            <TooltipTrigger placement="top" trigger="focus">
              <TableColumnHeader column={item} />
              <Tooltip>{item.rendered}</Tooltip>
            </TooltipTrigger>
          );
        }

        // NOTE: don't allow resizing on the last column, it creates a weird UX
        // where the combined column width can be less than the table
        if (item.props.allowsResizing && !!item.nextKey) {
          return <ResizableTableColumnHeader column={item} />;
        }

        return <TableColumnHeader column={item} />;
      case 'loader':
        return <LoadingState />;
      case 'empty': {
        return <EmptyState />;
      }
      default: {
        return null;
      }
    }
  }, []);

  let [isVerticalScrollbarVisible, setVerticalScollbarVisible] =
    useState(false);
  let [isHorizontalScrollbarVisible, setHorizontalScollbarVisible] =
    useState(false);
  let viewport = useRef({ x: 0, y: 0, width: 0, height: 0 });
  let onVisibleRectChange = useCallback((rect: Rect) => {
    if (
      viewport.current.width === rect.width &&
      viewport.current.height === rect.height
    ) {
      return;
    }
    viewport.current = rect;
    if (bodyRef.current) {
      setVerticalScollbarVisible(
        bodyRef.current.clientWidth + 2 < bodyRef.current.offsetWidth
      );
      setHorizontalScollbarVisible(
        bodyRef.current.clientHeight + 2 < bodyRef.current.offsetHeight
      );
    }
  }, []);
  let { isFocusVisible, focusProps } = useFocusRing();
  let isEmpty = state.collection.size === 0;

  let onFocusedResizer = () => {
    if (bodyRef.current && headerRef.current) {
      bodyRef.current.scrollLeft = headerRef.current.scrollLeft;
    }
  };

  let onResizeStart = useCallback(
    (widths: Map<Key, ColumnSize>) => {
      setIsResizing(true);
      propsOnResizeStart?.(widths);
    },
    [setIsResizing, propsOnResizeStart]
  );
  let onResizeEnd = useCallback(
    (widths: Map<Key, ColumnSize>) => {
      setIsInResizeMode(false);
      setIsResizing(false);
      propsOnResizeEnd?.(widths);
    },
    [propsOnResizeEnd, setIsInResizeMode, setIsResizing]
  );

  let focusedKey = state.selectionManager.focusedKey;
  let dropTargetKey: Key | null = null;
  if (dropState?.target?.type === 'item') {
    dropTargetKey = dropState.target.key;
    if (
      dropState.target.dropPosition === 'before' &&
      dropTargetKey !== state.collection.getFirstKey()
    ) {
      // Normalize to the "after" drop position since we only render those in the DOM.
      // The exception to this is for the first row in the table, where we also render the "before" position.
      dropTargetKey = state.collection.getKeyBefore(dropTargetKey);
    }
  }

  let persistedKeys = useMemo(() => {
    return new Set([focusedKey, dropTargetKey].filter(k => k !== null));
  }, [focusedKey, dropTargetKey]);

  let mergedProps = mergeProps(
    isTableDroppable ? droppableCollection?.collectionProps : {},
    gridProps,
    focusProps
  );
  if (dragAndDropHooks?.isVirtualDragging?.()) {
    delete mergedProps.tabIndex;
  }
  let cosmeticConfig = {
    density,
    overflowMode,
    prominence,
  };

  return (
    <TableContext.Provider
      value={{
        cosmeticConfig,
        dragAndDropHooks,
        dragState,
        dropState,
        headerMenuOpen,
        headerRowHovered,
        isEmpty,
        isInResizeMode,
        isTableDraggable,
        isTableDroppable,
        layout,
        onFocusedResizer,
        onResize: props.onResize ?? (() => {}),
        onResizeEnd,
        onResizeStart,
        renderEmptyState: props.renderEmptyState,
        setHeaderMenuOpen,
        setIsInResizeMode,
        state,
      }}
    >
      <TableVirtualizer
        {...mergedProps}
        {...styleProps}
        {...toDataAttributes({
          ...cosmeticConfig,
          scrollbar:
            isVerticalScrollbarVisible && isHorizontalScrollbarVisible
              ? 'both'
              : isVerticalScrollbarVisible
              ? 'vertical'
              : isHorizontalScrollbarVisible
              ? 'horizontal'
              : undefined,
        })}
        className={classNames(tableClassname, styleProps.className)}
        tableState={state}
        cosmeticConfig={cosmeticConfig}
        layout={layout}
        collection={state.collection}
        persistedKeys={persistedKeys}
        renderView={renderView}
        // @ts-expect-error
        renderWrapper={renderWrapper}
        onVisibleRectChange={onVisibleRectChange}
        domRef={domRef}
        headerRef={headerRef}
        bodyRef={bodyRef}
        isFocusVisible={isFocusVisible}
        isVirtualDragging={dragAndDropHooks?.isVirtualDragging?.() ?? false}
        isRootDropTarget={isRootDropTarget}
      />
      {DragPreview && isTableDraggable && (
        <DragPreview ref={preview}>
          {() => {
            if (dragAndDropHooks?.renderPreview && dragState?.draggingKeys) {
              return dragAndDropHooks.renderPreview(
                dragState.draggingKeys,
                dragState.draggedKey
              );
            }
            let itemCount = dragState?.draggingKeys.size ?? 0;
            let maxWidth = bodyRef?.current?.getBoundingClientRect().width;
            let height = ROW_HEIGHTS[density];
            let itemText = state.collection.getTextValue?.(
              dragState?.draggedKey!
            );
            return (
              <KeystarDragPreview
                itemText={itemText}
                itemCount={itemCount}
                height={height}
                maxWidth={maxWidth}
              />
            );
          }}
        </DragPreview>
      )}
    </TableContext.Provider>
  );
}

type View = ReusableView<GridNode<unknown>, ReactNode>;
interface TableVirtualizerProps<T> extends HTMLAttributes<HTMLElement> {
  cosmeticConfig: TableCosmeticConfig;
  tableState: TableState<T>;
  layout: TableViewLayout<T>;
  collection: TableCollection<T>;
  persistedKeys: Set<Key> | null;
  renderView: (type: string, content: GridNode<T>) => ReactElement | null;
  renderWrapper?: (
    parent: View | null,
    reusableView: View,
    children: View[],
    renderChildren: (views: View[]) => ReactElement[]
  ) => ReactElement;
  domRef: RefObject<HTMLDivElement>;
  bodyRef: RefObject<HTMLDivElement>;
  headerRef: RefObject<HTMLDivElement>;
  onVisibleRectChange: (rect: Rect) => void;
  isFocusVisible: boolean;
  isVirtualDragging: boolean;
  isRootDropTarget: boolean;
}

function TableVirtualizer<T>(props: TableVirtualizerProps<T>) {
  let {
    cosmeticConfig,
    tableState,
    layout,
    collection,
    persistedKeys,
    renderView,
    renderWrapper,
    domRef,
    bodyRef,
    headerRef,
    onVisibleRectChange: onVisibleRectChangeProp,
    isFocusVisible,
    isVirtualDragging,
    isRootDropTarget,
    ...otherProps
  } = props;
  let { direction } = useLocale();
  let loadingState = collection.body.props.loadingState;
  let isLoading = loadingState === 'loading' || loadingState === 'loadingMore';
  let onLoadMore = collection.body.props.onLoadMore;
  let [tableWidth, setTableWidth] = useState(0);

  const slots = useMemo(() => {
    return { text: { truncate: cosmeticConfig.overflowMode === 'truncate' } };
  }, [cosmeticConfig.overflowMode]);

  const getDefaultWidth = useCallback(
    ({
      props: { hideHeader, isSelectionCell, showDivider, isDragButtonCell },
    }: GridNode<T>): ColumnSize | null | undefined => {
      if (hideHeader) {
        let width = DEFAULT_HIDE_HEADER_CELL_WIDTH;
        return showDivider ? width + 1 : width;
      } else if (isSelectionCell) {
        return SELECTION_CELL_DEFAULT_WIDTH;
      } else if (isDragButtonCell) {
        return DRAG_BUTTON_CELL_DEFAULT_WIDTH;
      }
    },
    []
  );

  const getDefaultMinWidth = useCallback(
    ({
      props: { hideHeader, isSelectionCell, showDivider, isDragButtonCell },
    }: GridNode<T>): ColumnSize | null | undefined => {
      if (hideHeader) {
        let width = DEFAULT_HIDE_HEADER_CELL_WIDTH;
        return showDivider ? width + 1 : width;
      } else if (isSelectionCell) {
        return SELECTION_CELL_DEFAULT_WIDTH;
      } else if (isDragButtonCell) {
        return DRAG_BUTTON_CELL_DEFAULT_WIDTH;
      }
      return 75;
    },
    []
  );

  let columnResizeState = useTableColumnResizeState(
    {
      tableWidth,
      getDefaultWidth,
      getDefaultMinWidth,
    },
    tableState
  );

  let state = useVirtualizerState<GridNode<unknown>, ReactNode>({
    layout,
    collection,
    renderView,
    onVisibleRectChange(rect) {
      if (bodyRef.current) {
        bodyRef.current.scrollTop = rect.y;
        setScrollLeft(bodyRef.current, direction, rect.x);
      }
    },
    persistedKeys,
    layoutOptions: useMemo(
      () => ({
        columnWidths: columnResizeState.columnWidths,
      }),
      [columnResizeState.columnWidths]
    ),
  });

  useLoadMore({ isLoading, onLoadMore, scrollOffset: 1 }, bodyRef);
  let onVisibleRectChange = useCallback(
    (rect: Rect) => {
      state.setVisibleRect(rect);
    },
    [state]
  );

  let onVisibleRectChangeMemo = useCallback(
    (rect: Rect) => {
      setTableWidth(rect.width);
      onVisibleRectChange(rect);
      onVisibleRectChangeProp(rect);
    },
    [onVisibleRectChange, onVisibleRectChangeProp]
  );

  // this effect runs whenever the contentSize changes, it doesn't matter what the content size is
  // only that it changes in a resize, and when that happens, we want to sync the body to the
  // header scroll position
  useEffect(() => {
    if (
      getInteractionModality() === 'keyboard' &&
      bodyRef.current &&
      domRef.current &&
      headerRef.current &&
      headerRef.current.contains(document.activeElement) &&
      document.activeElement instanceof HTMLElement
    ) {
      scrollIntoView(headerRef.current, document.activeElement);
      scrollIntoViewport(document.activeElement, {
        containingElement: domRef.current,
      });
      bodyRef.current.scrollLeft = headerRef.current.scrollLeft;
    }
  }, [state.contentSize, headerRef, bodyRef, domRef]);

  let headerHeight = layout.getLayoutInfo('header')?.rect.height || 0;

  // Sync the scroll position from the table body to the header container.
  let onScroll = useCallback(() => {
    if (bodyRef.current && headerRef.current) {
      headerRef.current.scrollLeft = bodyRef.current.scrollLeft;
    }
  }, [bodyRef, headerRef]);

  let resizerPosition =
    columnResizeState.resizingColumn != null
      ? layout.getLayoutInfo(columnResizeState.resizingColumn).rect.maxX - 2
      : 0;

  // minimize re-render caused on Resizers by memoing this
  let resizingColumnWidth =
    columnResizeState.resizingColumn != null
      ? columnResizeState.getColumnWidth(columnResizeState.resizingColumn)
      : 0;
  let resizingColumn = useMemo(
    () => ({
      width: resizingColumnWidth,
      key: columnResizeState.resizingColumn,
    }),
    [resizingColumnWidth, columnResizeState.resizingColumn]
  );
  if (isVirtualDragging) {
    delete otherProps.tabIndex;
  }

  let firstColumn = collection.columns[0];
  let scrollPadding = 0;
  if (firstColumn.props.isSelectionCell || firstColumn.props.isDragButtonCell) {
    scrollPadding = columnResizeState.getColumnWidth(firstColumn.key);
  }

  // @ts-expect-error `renderWrapper` will be defined
  let visibleViews = renderChildren(null, state.visibleViews, renderWrapper);

  return (
    <VirtualizerContext.Provider value={resizingColumn}>
      <FocusScope>
        <div {...otherProps} ref={domRef}>
          <div
            role="presentation"
            className={headerWrapperClassname}
            style={{
              height: headerHeight,
              overflow: 'hidden',
              position: 'relative',
              willChange: state.isScrolling ? 'scroll-position' : undefined,
              scrollPaddingInlineStart: scrollPadding,
            }}
            ref={headerRef}
          >
            <ResizeStateContext.Provider value={columnResizeState}>
              {visibleViews[0]}
            </ResizeStateContext.Provider>
          </div>
          <SlotProvider slots={slots}>
            <ScrollView
              data-focus={isFocusVisible ? 'visible' : undefined}
              className={bodyClassname}
              //  Firefox and Chrome make generic elements using CSS overflow 'scroll' or 'auto' tabbable,
              //  including them within the accessibility tree, which breaks the table structure in Firefox.
              //  Using tabIndex={-1} prevents the ScrollView from being tabbable, and using role="rowgroup"
              //  here and role="presentation" on the table body content fixes the table structure.
              role="rowgroup"
              tabIndex={isVirtualDragging ? undefined : -1}
              style={{
                flex: 1,
                scrollPaddingInlineStart: scrollPadding,
              }}
              innerStyle={{ overflow: 'visible' }}
              ref={bodyRef}
              contentSize={state.contentSize}
              onVisibleRectChange={onVisibleRectChangeMemo}
              onScrollStart={state.startScrolling}
              onScrollEnd={state.endScrolling}
              onScroll={onScroll}
            >
              {visibleViews[1]}
              <div
                className={bodyResizeIndicatorClassname}
                style={{
                  [direction === 'ltr'
                    ? 'left'
                    : 'right']: `${resizerPosition}px`,
                  height: `${Math.max(
                    state.virtualizer.contentSize.height,
                    state.virtualizer.visibleRect.height
                  )}px`,
                  display: columnResizeState.resizingColumn ? 'block' : 'none',
                }}
              />
            </ScrollView>
          </SlotProvider>
        </div>
      </FocusScope>
    </VirtualizerContext.Provider>
  );
}

// Styled components
// ------------------------------

type PropsWithLayoutInfos = {
  layoutInfo: LayoutInfo;
  parent: LayoutInfo | null;
} & HTMLAttributes<HTMLElement>;

function renderChildren<T extends object>(
  parent: View | null,
  views: View[],
  renderWrapper: NonNullable<TableVirtualizerProps<T>['renderWrapper']>
): ReactElement[] {
  return views.map(view => {
    return renderWrapper(
      parent,
      view,
      view.children ? Array.from(view.children) : [],
      childViews => renderChildren(view, childViews, renderWrapper)
    );
  });
}

function useStyle(layoutInfo: LayoutInfo, parent: LayoutInfo | null) {
  let { direction } = useLocale();
  let style = layoutInfoToStyle(layoutInfo, direction, parent);
  if (style.overflow === 'hidden') {
    style.overflow = 'visible'; // needed to support position: sticky
  }
  return style;
}

function TableHead({
  children,
  layoutInfo,
  parent,
  ...otherProps
}: PropsWithLayoutInfos) {
  let { rowGroupProps } = useTableRowGroup();
  let style = useStyle(layoutInfo, parent);

  return (
    <div
      {...rowGroupProps}
      {...otherProps}
      className={headerClassname}
      style={style}
    >
      {children}
    </div>
  );
}

function TableDragHeaderCell(props: { column: GridNode<unknown> }) {
  let { column } = props;
  let ref = useRef<HTMLDivElement>(null);
  let { state } = useTableContext();
  let { columnHeaderProps } = useTableColumnHeader(
    {
      node: column,
      isVirtualized: true,
    },
    state,
    ref
  );
  let stringFormatter = useLocalizedStringFormatter(localizedMessages);

  return (
    <FocusRing>
      <div
        {...columnHeaderProps}
        ref={ref}
        className={headerCellClassname}
        style={{ padding: 0, height: 'inherit' }}
      >
        <VisuallyHidden>{stringFormatter.format('drag')}</VisuallyHidden>
      </div>
    </FocusRing>
  );
}

function TableBody({
  children,
  layoutInfo,
  parent,
  ...otherProps
}: PropsWithLayoutInfos) {
  let { rowGroupProps } = useTableRowGroup();
  let style = useStyle(layoutInfo, parent);

  return (
    <div {...rowGroupProps} {...otherProps} style={style}>
      {children}
    </div>
  );
}

function TableHeaderRow(props: {
  children: ReactNode;
  onHoverChange: (hovered: boolean) => void;
  item: any;
  style: CSSProperties;
}) {
  let ref = useRef<HTMLDivElement>(null);
  let { state } = useTableContext();
  let { hoverProps } = useHover(props);
  let { rowProps } = useTableHeaderRow(
    { node: props.item, isVirtualized: true },
    state,
    ref
  );
  // let styleProps = useRowHeaderStyleProps(props);

  return (
    <div
      className={rowClassname}
      {...mergeProps(rowProps, hoverProps)}
      ref={ref}
    >
      {props.children}
    </div>
  );
}

function TableColumnHeader<T>(props: { column: GridNode<T> }) {
  let { column } = props;
  let columnProps = column.props as ColumnProps<T>;

  let ref = useRef<HTMLDivElement>(null);
  let { cosmeticConfig, isEmpty, state } = useTableContext();
  let { columnHeaderProps } = useTableColumnHeader(
    { node: column, isVirtualized: true },
    state,
    ref
  );
  let { hoverProps, isHovered } = useHover({
    ...props,
    isDisabled: isEmpty || !columnProps.allowsSorting,
  });
  let slots = useMemo(() => {
    return {
      text: { color: 'inherit', weight: 'medium', truncate: true },
    } as const;
  }, []);

  return (
    <FocusRing>
      <div
        {...mergeProps(columnHeaderProps, hoverProps)}
        {...toDataAttributes(
          {
            align: columnProps.align,
            isHovered,
            overflowMode: 'truncate',
            prominence: cosmeticConfig.prominence,
          },
          {
            omitFalsyValues: true,
            trimBooleanKeys: true,
          }
        )}
        className={headerCellClassname}
        ref={ref}
      >
        <SlotProvider slots={slots}>
          {columnProps.hideHeader ? (
            <VisuallyHidden>{column.rendered}</VisuallyHidden>
          ) : isReactText(column.rendered) ? (
            <Text>{column.rendered}</Text>
          ) : (
            column.rendered
          )}
        </SlotProvider>

        {columnProps.allowsSorting && <SortIndicator />}
      </div>
    </FocusRing>
  );
}

function ResizableTableColumnHeader(props: { column: GridNode<unknown> }) {
  let { column } = props;
  let ref = useRef(null);
  let triggerRef = useRef(null);
  let resizingRef = useRef(null);
  let {
    state,
    onResizeStart,
    onResize,
    onResizeEnd,
    headerRowHovered,
    isEmpty,
  } = useTableContext();
  let columnResizeState = useResizeStateContext();
  let { pressProps, isPressed } = usePress({ isDisabled: isEmpty });
  let { columnHeaderProps } = useTableColumnHeader(
    {
      node: column,
      isVirtualized: true,
    },
    state,
    ref
  );
  let { hoverProps, isHovered } = useHover({ ...props, isDisabled: isEmpty });
  let slots = useMemo(() => {
    return {
      text: { color: 'inherit', weight: 'medium', truncate: true },
    } as const;
  }, []);

  let resizingColumn = columnResizeState.resizingColumn;
  let showResizer =
    !isEmpty &&
    ((headerRowHovered && getInteractionModality() !== 'keyboard') ||
      resizingColumn != null);
  let alignment = 'start';
  if (
    column.props.align === 'center' ||
    (column.colspan && column.colspan > 1)
  ) {
    alignment = 'center';
  } else if (column.props.align === 'end') {
    alignment = 'end';
  }

  return (
    <FocusRing>
      <div
        {...toDataAttributes(
          {
            align: alignment,
            sortable: column.props.allowsSorting,
            resizable: column.props.allowsResizing,
            interaction: isPressed ? 'press' : isHovered ? 'hover' : undefined,
            sort:
              state.sortDescriptor?.column === column.key
                ? state.sortDescriptor?.direction
                : undefined,
          },
          {
            omitFalsyValues: true,
            trimBooleanKeys: true,
          }
        )}
        {...mergeProps(columnHeaderProps, pressProps, hoverProps)}
        ref={ref}
        className={headerCellClassname}
      >
        <SlotProvider slots={slots}>
          {column.props.hideHeader ? (
            <VisuallyHidden>{column.rendered}</VisuallyHidden>
          ) : isReactText(column.rendered) ? (
            <Text>{column.rendered}</Text>
          ) : (
            column.rendered
          )}
        </SlotProvider>

        {column.props.allowsSorting && <SortIndicator />}

        <Resizer
          ref={resizingRef}
          column={column}
          showResizer={showResizer}
          onResizeStart={onResizeStart}
          onResize={onResize}
          onResizeEnd={onResizeEnd}
          triggerRef={triggerRef}
        />
        <div
          aria-hidden
          data-visible={resizingColumn != null}
          data-resizing={resizingColumn === column.key}
          className={columnResizeIndicatorClassname}
        />
      </div>
    </FocusRing>
  );
}

function TableRow(props: PropsWithLayoutInfos & { item: GridNode<unknown> }) {
  let { item, children, layoutInfo, parent, ...otherProps } = props;
  let ref = useRef(null);
  let {
    state,
    layout,
    dragAndDropHooks,
    isTableDraggable,
    isTableDroppable,
    dragState,
    dropState,
  } = useTableContext();
  let { rowProps, hasAction, allowsSelection } = useTableRow(
    {
      node: item,
      isVirtualized: true,
      shouldSelectOnPressUp: isTableDraggable,
    },
    state,
    ref
  );

  let isSelected = state.selectionManager.isSelected(item.key);
  let isDisabled = state.selectionManager.isDisabled(item.key);
  let isInteractive =
    !isDisabled && (hasAction || allowsSelection || isTableDraggable);
  let isDroppable = isTableDroppable && !isDisabled;
  let { pressProps, isPressed } = usePress({ isDisabled: !isInteractive });

  // The row should show the focus background style when any cell inside it is focused.
  // If the row itself is focused, then it should have a blue focus indicator on the left.
  let { isFocusVisible: isFocusVisibleWithin, focusProps: focusWithinProps } =
    useFocusRing({ within: true });
  let { isFocusVisible, focusProps } = useFocusRing();
  let { hoverProps, isHovered } = useHover({ isDisabled: !isInteractive });
  let isFirstRow =
    state.collection.rows.find(row => row.level === 1)?.key === item.key;
  let isLastRow = item.nextKey == null;
  // Figure out if the TableView content is equal or greater in height to the container. If so, we'll need to round the bottom
  // border corners of the last row when selected.
  let isFlushWithContainerBottom = false;
  if (isLastRow) {
    if (
      layout.getContentSize()?.height >= layout.virtualizer?.visibleRect.height
    ) {
      isFlushWithContainerBottom = true;
    }
  }

  let draggableItem: DraggableItemResult | null = null;
  if (isTableDraggable) {
    assert(!!dragAndDropHooks?.useDraggableItem);
    assert(!!dragState);
    draggableItem = dragAndDropHooks.useDraggableItem(
      { key: item.key, hasDragButton: true },
      dragState
    );
    if (isDisabled) {
      draggableItem = null;
    }
  }
  let droppableItem: DroppableItemResult | null = null;
  let isDropTarget: boolean = false;
  let dropIndicator: DropIndicatorAria | null = null;
  let dropIndicatorRef = useRef(null);
  if (isTableDroppable) {
    assert(!!dragAndDropHooks?.useDroppableItem);
    assert(!!dragAndDropHooks?.useDropIndicator);
    assert(!!dropState);
    let target = {
      type: 'item',
      key: item.key,
      dropPosition: 'on',
    } as DropTarget;
    isDropTarget = dropState.isDropTarget(target);
    droppableItem = dragAndDropHooks.useDroppableItem(
      { target },
      dropState,
      dropIndicatorRef
    );
    dropIndicator = dragAndDropHooks.useDropIndicator(
      { target },
      dropState,
      dropIndicatorRef
    );
  }

  let dragButtonRef = useRef<HTMLDivElement>(null);
  let { buttonProps: dragButtonProps } = useButton(
    {
      ...draggableItem?.dragButtonProps,
      elementType: 'div',
    },
    dragButtonRef
  );

  let style = useStyle(layoutInfo, parent);

  let mergedRowProps = mergeProps(
    rowProps,
    otherProps,
    { style },
    focusWithinProps,
    focusProps,
    hoverProps,
    pressProps,
    draggableItem?.dragProps
  );
  // Remove tab index from list row if performing a screenreader drag. This
  // prevents TalkBack from focusing the row, allowing for single swipe
  // navigation between row drop indicator
  if (dragAndDropHooks?.isVirtualDragging?.()) {
    delete mergedRowProps.tabIndex;
  }

  let dropProps = isDroppable
    ? droppableItem?.dropProps
    : { 'aria-hidden': droppableItem?.dropProps['aria-hidden'] };
  let { visuallyHiddenProps } = useVisuallyHidden();

  return (
    <TableRowContext.Provider
      value={{
        dragButtonProps,
        dragButtonRef,
        isHovered,
        isFocusVisibleWithin,
      }}
    >
      {isTableDroppable && isFirstRow && (
        <InsertionIndicator
          rowProps={mergedRowProps}
          visibleRect={layout.virtualizer?.visibleRect}
          key={`${item.key}-before`}
          target={{ key: item.key, type: 'item', dropPosition: 'before' }}
        />
      )}
      {isTableDroppable && !dropIndicator?.isHidden && (
        <div role="row" {...visuallyHiddenProps}>
          <div role="gridcell">
            <div
              role="button"
              {...dropIndicator?.dropIndicatorProps}
              ref={dropIndicatorRef}
            />
          </div>
        </div>
      )}
      <div
        {...mergeProps(mergedRowProps, dropProps)}
        {...toDataAttributes(
          {
            isDisabled,
            isDropTarget,
            isFocusVisible,
            isFocusVisibleWithin,
            isFlushWithContainerBottom,
            isFirstRow,
            isLastRow,
            isHovered,
            isPressed,
            isSelected,
            isNextSelected:
              item.nextKey && state.selectionManager.isSelected(item.nextKey),
          },
          {
            omitFalsyValues: true,
            trimBooleanKeys: true,
          }
        )}
        ref={ref}
        className={rowClassname}
      >
        {children}
      </div>
      {isTableDroppable && (
        <InsertionIndicator
          rowProps={mergedRowProps}
          visibleRect={layout.virtualizer?.visibleRect}
          key={`${item.key}-after`}
          target={{ key: item.key, type: 'item', dropPosition: 'after' }}
        />
      )}
    </TableRowContext.Provider>
  );
}

function TableDragCell(props: { cell: GridNode<unknown> }) {
  let { cell } = props;
  let ref = useRef<HTMLDivElement>(null);
  let { cosmeticConfig, state, isTableDraggable } = useTableContext();
  let isDisabled =
    cell.parentKey && state.selectionManager.isDisabled(cell.parentKey);
  let { gridCellProps } = useTableCell(
    {
      node: cell,
      isVirtualized: true,
    },
    state,
    ref
  );

  return (
    <FocusRing>
      <div
        {...gridCellProps}
        {...toDataAttributes(
          { ...cosmeticConfig, isDisabled },
          { omitFalsyValues: true, trimBooleanKeys: true }
        )}
        ref={ref}
        className={classNames(cellClassname, dragCellClassname)}
      >
        {isTableDraggable && !isDisabled && <DragButton />}
      </div>
    </FocusRing>
  );
}

function DragButton() {
  let { dragButtonProps, dragButtonRef, isFocusVisibleWithin, isHovered } =
    useTableRowContext();
  let { visuallyHiddenProps } = useVisuallyHidden();
  return (
    <FocusRing>
      <div
        {...(dragButtonProps as HTMLAttributes<HTMLElement>)}
        className={css({
          borderRadius: tokenSchema.size.radius.xsmall,
          display: 'flex',
          justifyContent: 'center',
          outline: 0,
          padding: 0,
          height: tokenSchema.size.icon.regular,
          width: 10, // magic number specific to this icon. minimizing space taken by drag handle

          '&[data-focus=visible]': {
            outline: `${tokenSchema.size.alias.focusRing} solid ${tokenSchema.color.alias.focusRing}`,
          },
        })}
        style={
          !isFocusVisibleWithin && !isHovered ? visuallyHiddenProps.style : {}
        }
        ref={dragButtonRef}
        draggable="true"
      >
        <Icon src={gripVerticalIcon} color="neutral" />
      </div>
    </FocusRing>
  );
}

function TableCell({ cell }: { cell: GridNode<unknown> }) {
  let { cosmeticConfig, state } = useTableContext();
  let ref = useRef<HTMLDivElement>(null);
  let { gridCellProps } = useTableCell(
    {
      node: cell,
      isVirtualized: true,
    },
    state,
    ref
  );
  let { id, ...otherGridCellProps } = gridCellProps;

  return (
    <FocusRing>
      <div
        {...otherGridCellProps}
        {...toDataAttributes({
          ...cosmeticConfig,
          align: cell.column?.props.align,
          hideHeader: cell.column?.props.hideHeader,
          showDivider:
            cell.column?.props.showDivider && cell.column?.nextKey !== null,
        })}
        aria-labelledby={id}
        ref={ref}
        className={cellClassname}
      >
        {typeof cell.rendered === 'boolean' || cell.rendered == null ? null : (
          <CellContents id={id}>
            {isReactText(cell.rendered) ? (
              <Text>{cell.rendered}</Text>
            ) : (
              cell.rendered
            )}
          </CellContents>
        )}
      </div>
    </FocusRing>
  );
}
function CellContents(props: HTMLAttributes<HTMLElement>) {
  const { children, ...attributes } = props;
  const slots = useMemo(() => ({ text: { color: 'inherit' } }) as const, []);
  const element = Children.only(children) as ReactElement;
  return (
    <SlotProvider slots={slots}>
      {cloneElement(element, mergeProps(element.props, attributes))}
    </SlotProvider>
  );
}

function TableCellWrapper(
  props: VirtualizerItemOptions & {
    parent: View;
  } & HTMLAttributes<HTMLElement>
) {
  let { layoutInfo, virtualizer, parent, children } = props;
  let { isTableDroppable, dropState } = useTableContext();
  let isDropTarget = false;
  let isRootDroptarget = false;
  if (isTableDroppable) {
    assert(!!dropState);
    let key = parent.content.key;
    if (key) {
      isDropTarget = dropState.isDropTarget({
        type: 'item',
        dropPosition: 'on',
        key: key,
      });
    }
    isRootDroptarget = dropState.isDropTarget({ type: 'root' });
  }

  return (
    <VirtualizerItem
      layoutInfo={layoutInfo}
      virtualizer={virtualizer}
      parent={parent?.layoutInfo}
      // only when !layoutInfo.estimatedSize???
      className={cellWrapperClassname}
      data-droptarget={isDropTarget || isRootDroptarget}
    >
      {children}
    </VirtualizerItem>
  );
}

function TableCheckboxCell({ cell }: { cell: any }) {
  let ref = useRef<HTMLDivElement>(null);
  let { cosmeticConfig, state } = useTableContext();
  // The TableCheckbox should always render its disabled status if the row is disabled, regardless of disabledBehavior,
  // but the cell itself should not render its disabled styles if disabledBehavior="selection" because the row might have actions on it.
  let isSelectionDisabled = state.disabledKeys.has(cell.parentKey);
  let isDisabled = state.selectionManager.isDisabled(cell.parentKey);
  let { gridCellProps } = useTableCell(
    { node: cell, isVirtualized: true },
    state,
    ref
  );
  let { checkboxProps } = useTableSelectionCheckbox(
    { key: cell.parentKey },
    state
  );

  return (
    <div
      {...toDataAttributes(
        { ...cosmeticConfig, isDisabled },
        { trimBooleanKeys: true, omitFalsyValues: true }
      )}
      className={classNames(cellClassname, checkboxCellClassname)}
      ref={ref}
      {...gridCellProps}
    >
      <Checkbox {...checkboxProps} isDisabled={isSelectionDisabled} />
    </div>
  );
}

function TableSelectAllCell({ column }: { column: any }) {
  let ref = useRef<HTMLDivElement>(null);
  let { state } = useTableContext();
  let { columnHeaderProps } = useTableColumnHeader(
    { node: column, isVirtualized: true },
    state,
    ref
  );
  let { checkboxProps } = useTableSelectAllCheckbox(state);
  // FIXME
  // let styleProps = useSelectionCellStyleProps();

  return (
    <div
      className={classNames(
        cellClassname,
        checkboxCellClassname,
        headerCellClassname
      )}
      ref={ref}
      {...columnHeaderProps}
    >
      {state.selectionManager.selectionMode === 'single' ? (
        <VisuallyHidden>{checkboxProps['aria-label']}</VisuallyHidden>
      ) : (
        <Checkbox {...checkboxProps} />
      )}
    </div>
  );
}

function LoadingState() {
  let { state } = useTableContext();
  let stringFormatter = useLocalizedStringFormatter(localizedMessages);
  return (
    <CenteredWrapper>
      <ProgressCircle
        isIndeterminate
        aria-label={
          state.collection.size > 0
            ? stringFormatter.format('loadingMore')
            : stringFormatter.format('loading')
        }
      />
    </CenteredWrapper>
  );
}

function EmptyState() {
  let { renderEmptyState } = useTableContext();
  let emptyState = renderEmptyState ? renderEmptyState() : null;
  if (emptyState == null) {
    return null;
  }

  return <CenteredWrapper>{emptyState}</CenteredWrapper>;
}

function CenteredWrapper({ children }: PropsWithChildren) {
  let { state } = useTableContext();
  let rowProps = {
    'aria-rowindex':
      state.collection.headerRows.length + state.collection.size + 1,
  };

  return (
    <div role="row" {...rowProps} className={centeredWrapperClassname}>
      <div role="rowheader" aria-colspan={state.collection.columns.length}>
        {children}
      </div>
    </div>
  );
}
