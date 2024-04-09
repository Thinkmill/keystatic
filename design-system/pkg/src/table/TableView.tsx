import {
  CSSProperties,
  ForwardedRef,
  HTMLAttributes,
  Key,
  ReactElement,
  ReactNode,
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useMemo,
  useRef,
} from 'react';

import { FocusScope, useFocusRing } from '@react-aria/focus';
import { useLocale, useLocalizedStringFormatter } from '@react-aria/i18n';
import { useHover, usePress } from '@react-aria/interactions';
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
import { filterDOMProps, mergeProps } from '@react-aria/utils';
import {
  layoutInfoToStyle,
  ScrollView,
  setScrollLeft,
  useVirtualizer,
  VirtualizerItem,
} from '@react-aria/virtualizer';
import { VisuallyHidden } from '@react-aria/visually-hidden';
import { TableLayout } from '@react-stately/layout';
import {
  TableColumnLayout,
  TableState,
  useTableState,
} from '@react-stately/table';
import { ReusableView, useVirtualizerState } from '@react-stately/virtualizer';
import { GridNode } from '@react-types/grid';
import { ColumnSize } from '@react-types/table';

import { Checkbox } from '@keystar/ui/checkbox';
import { ProgressCircle } from '@keystar/ui/progress';
import { SlotProvider } from '@keystar/ui/slots';
import { classNames, css, tokenSchema } from '@keystar/ui/style';
import { TooltipTrigger, Tooltip } from '@keystar/ui/tooltip';
import { Text } from '@keystar/ui/typography';
import { isReactText } from '@keystar/ui/utils';

import localizedMessages from './l10n.json';
import {
  SortIndicator,
  tableViewClassList,
  useBodyStyleProps,
  useCellStyleProps,
  useHeadStyleProps,
  useHeaderWrapperStyleProps,
  useRowHeaderStyleProps,
  useRowStyleProps,
  useSelectionCellStyleProps,
  useTableStyleProps,
} from './styles';
import { ColumnProps, TableProps } from './types';

// Constants

const DEFAULT_HEADER_HEIGHT = 34;
const DEFAULT_HIDE_HEADER_CELL_WIDTH = 34;
const SELECTION_CELL_DEFAULT_WIDTH = 34;
const ROW_HEIGHTS = {
  compact: 26,
  regular: 34,
  spacious: 42,
} as const;

// Context

export interface TableContextValue<T> {
  state: TableState<T>;
  layout: TableLayout<T> & { state: TableState<T> };
  isEmpty: boolean;
}

// @ts-ignore FIXME: generics in context?
export const TableContext = createContext<TableContextValue<any>>(null);
export function useTableContext() {
  return useContext(TableContext);
}

export const VirtualizerContext = createContext(null);
export function useVirtualizerContext() {
  return useContext(VirtualizerContext);
}

// Main

export function TableView<T extends object>(props: TableProps<T>) {
  let domRef = useRef<HTMLDivElement>(null);
  let headerRef = useRef<HTMLDivElement>(null);
  let bodyRef = useRef<HTMLDivElement>(null);
  let { direction } = useLocale();
  let stringFormatter = useLocalizedStringFormatter(localizedMessages);

  let { density = 'regular', overflowMode } = props;

  // Renderers

  // This overrides collection view's renderWrapper to support DOM hierarchy.
  type View = ReusableView<GridNode<T>, ReactNode>;
  let renderWrapper = (
    parent: View,
    reusableView: View,
    children: View[],
    renderChildren: (views: View[]) => ReactElement[]
  ) => {
    let style = layoutInfoToStyle(
      reusableView.layoutInfo!,
      direction,
      parent && parent.layoutInfo
    );
    if (style.overflow === 'hidden') {
      style.overflow = 'visible'; // needed to support position: sticky
    }

    if (reusableView.viewType === 'rowgroup') {
      return (
        <TableBody key={reusableView.key} style={style}>
          {renderChildren(children)}
        </TableBody>
      );
    }

    if (reusableView.viewType === 'header') {
      return (
        <TableHead key={reusableView.key} style={style}>
          {renderChildren(children)}
        </TableHead>
      );
    }

    if (reusableView.viewType === 'row') {
      return (
        <TableRow
          key={reusableView.key}
          item={reusableView.content}
          style={style}
          hasAction={!!props.onRowAction}
        >
          {renderChildren(children)}
        </TableRow>
      );
    }

    if (reusableView.viewType === 'headerrow') {
      return (
        <TableHeaderRow
          key={reusableView.key}
          style={style}
          item={reusableView.content}
        >
          {renderChildren(children)}
        </TableHeaderRow>
      );
    }

    return (
      <VirtualizerItem
        key={reusableView.key}
        layoutInfo={reusableView.layoutInfo!}
        virtualizer={reusableView.virtualizer}
        parent={parent?.layoutInfo!}
        className={classNames(
          tableViewClassList.element('cell-wrapper'),
          css({ backgroundColor: tokenSchema.color.background.canvas })
        )}
      >
        {reusableView.rendered}
      </VirtualizerItem>
    );
  };

  let renderView = (type: string, item: GridNode<T>) => {
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

        return <TableCell cell={item} overflowMode={overflowMode} />;
      }
      case 'placeholder':
        return (
          <div
            role="gridcell"
            aria-colindex={(item.index ?? 0) + 1}
            aria-colspan={(item.colspan ?? 0) > 1 ? item.colspan : undefined}
          />
        );
      case 'column':
        if (item.props.isSelectionCell) {
          return <TableSelectAllCell column={item} />;
        }

        if (item.props.hideHeader) {
          return (
            <TooltipTrigger placement="top" trigger="focus">
              <TableColumnHeader column={item} />
              <Tooltip>{item.rendered}</Tooltip>
            </TooltipTrigger>
          );
        }

        return <TableColumnHeader column={item} />;
      case 'loader':
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
      case 'empty': {
        let emptyState = props.renderEmptyState
          ? props.renderEmptyState()
          : null;
        if (emptyState == null) {
          return null;
        }

        return <CenteredWrapper>{emptyState}</CenteredWrapper>;
      }
    }
  };

  let state = useTableState({
    ...props,
    showSelectionCheckboxes: props.selectionMode === 'multiple',
  });

  const getDefaultWidth = useCallback(
    ({
      props: { hideHeader, isSelectionCell },
    }: GridNode<T>): ColumnSize | null | undefined => {
      if (hideHeader) {
        return DEFAULT_HIDE_HEADER_CELL_WIDTH;
      } else if (isSelectionCell) {
        return SELECTION_CELL_DEFAULT_WIDTH;
      }
    },
    []
  );
  const getDefaultMinWidth = useCallback(
    ({
      props: { hideHeader, isSelectionCell },
    }: GridNode<T>): ColumnSize | null | undefined => {
      if (hideHeader) {
        return DEFAULT_HIDE_HEADER_CELL_WIDTH;
      } else if (isSelectionCell) {
        return SELECTION_CELL_DEFAULT_WIDTH;
      }

      return 75;
    },
    []
  );
  let columnLayout = useMemo(
    () =>
      new TableColumnLayout({
        getDefaultWidth,
        getDefaultMinWidth,
      }),
    [getDefaultWidth, getDefaultMinWidth]
  );

  let tableLayout = useMemo(
    () =>
      new TableLayout({
        // If props.rowHeight is auto, then use estimated heights, otherwise use fixed heights.
        rowHeight: overflowMode === 'wrap' ? undefined : ROW_HEIGHTS[density],
        estimatedRowHeight:
          overflowMode === 'wrap' ? ROW_HEIGHTS[density] : undefined,
        headingHeight:
          overflowMode === 'wrap' ? undefined : DEFAULT_HEADER_HEIGHT,
        estimatedHeadingHeight:
          overflowMode === 'wrap' ? DEFAULT_HEADER_HEIGHT : undefined,
        columnLayout,
        initialCollection: state.collection,
      }),
    // don't recompute when state.collection changes, only used for initial value
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [overflowMode, density, columnLayout]
  );

  // Use a proxy so that a new object is created for each render so that alternate instances aren't affected by mutation.
  // This can be thought of as equivalent to `{…tableLayout, tableState: state}`, but works with classes as well.
  let layout = useMemo(() => {
    let proxy = new Proxy(tableLayout, {
      get(target, prop, receiver) {
        return prop === 'tableState'
          ? state
          : Reflect.get(target, prop, receiver);
      },
    });
    return proxy as TableLayout<T> & { state: TableState<T> };
  }, [state, tableLayout]);

  let { gridProps } = useTable(
    { ...props, isVirtualized: true, layout },
    state,
    domRef
  );

  const isEmpty = state.collection.size === 0;

  return (
    <TableContext.Provider value={{ isEmpty, layout, state }}>
      <TableVirtualizer
        layout={layout}
        collection={state.collection}
        renderView={renderView}
        renderWrapper={renderWrapper}
        bodyRef={bodyRef}
        domRef={domRef}
        headerRef={headerRef}
        {...gridProps}
        {...props}
      />
    </TableContext.Provider>
  );
}

type View<T> = ReusableView<GridNode<T>, ReactNode>;
type TableVirtualizerProps<T extends object> = TableProps<T> & {
  collection: TableState<T>['collection'];
  layout: TableLayout<T> & { state: TableState<T> };
  domRef: React.RefObject<HTMLDivElement>;
  headerRef: React.RefObject<HTMLDivElement>;
  bodyRef: React.RefObject<HTMLDivElement>;
  renderView: (
    type: string,
    item: GridNode<T>
  ) => ReactElement | null | undefined;
  renderWrapper: (
    parent: View<T>,
    reusableView: View<T>,
    children: View<T>[],
    renderChildren: (views: View<T>[]) => ReactElement[]
  ) => ReactElement;
};

function TableVirtualizer<T extends object>(props: TableVirtualizerProps<T>) {
  let {
    layout,
    collection,
    // focusedKey,
    renderView,
    renderWrapper,
    domRef,
    bodyRef,
    headerRef,
    disallowEmptySelection: UNUSED_disallowEmptySelection,
    onRowAction: UNUSED_onRowAction,
    onSelectionChange: UNUSED_onSelectionChange,
    onSortChange: UNUSED_onSortChange,
    overflowMode: UNUSED_overflowMode,
    renderEmptyState: UNUSED_renderEmptyState,
    selectedKeys: UNUSED_selectedKeys,
    sortDescriptor: UNUSED_sortDescriptor,
    selectionMode,
    ...otherProps
  } = props;

  let { direction } = useLocale();
  let loadingState = collection.body.props.loadingState;
  let isLoading = loadingState === 'loading' || loadingState === 'loadingMore';
  let onLoadMore = collection.body.props.onLoadMore;

  let virtualizerState = useVirtualizerState<object, ReactNode, ReactNode>({
    layout,
    collection,
    renderView,
    renderWrapper,
    onVisibleRectChange(rect) {
      let bodyEl = bodyRef.current;
      if (bodyEl) {
        bodyEl.scrollTop = rect.y;
        setScrollLeft(bodyEl, direction, rect.x);
      }
    },
  });
  let styleProps = useTableStyleProps(props);

  // Sync the scroll position from the table body to the header container.
  let syncScroll = useCallback(() => {
    let bodyEl = bodyRef.current;
    let headerEl = headerRef.current;
    if (bodyEl && headerEl) {
      headerEl.scrollLeft = bodyEl.scrollLeft;
    }
  }, [bodyRef, headerRef]);

  let scrollToItem = useCallback(
    (key: Key) => {
      let item = collection.getItem(key);
      let column = collection.columns[0];
      let virtualizer = virtualizerState.virtualizer;

      virtualizer.scrollToItem(key, {
        duration: 0,
        // Prevent scrolling to the top when clicking on column headers.
        shouldScrollY: item?.type !== 'column',
        // Offset scroll position by width of selection cell
        // (which is sticky and will overlap the cell we're scrolling to).
        offsetX:
          column.props.isSelectionCell || column.props.isDragButtonCell
            ? layout.getColumnWidth(column.key)
            : 0,
      });

      // Sync the scroll positions of the column headers and the body so scrollIntoViewport can
      // properly decide if the column is outside the viewport or not
      syncScroll();
    },
    [collection, layout, syncScroll, virtualizerState.virtualizer]
  );
  let memoedVirtualizerProps = useMemo(
    () => ({
      scrollToItem,
      isLoading,
      onLoadMore,
    }),
    [scrollToItem, isLoading, onLoadMore]
  );
  let { virtualizerProps, scrollViewProps } = useVirtualizer(
    memoedVirtualizerProps,
    virtualizerState,
    domRef
  );
  let mergedProps = mergeProps(filterDOMProps(otherProps), virtualizerProps);

  const [headerView, bodyView] = virtualizerState.visibleViews;
  let headerHeight = layout.getLayoutInfo('header')?.rect.height || 0;

  let bodyStyleProps = useBodyStyleProps({ style: { flex: 1 } });

  return (
    <FocusScope>
      <div {...mergedProps} {...styleProps} ref={domRef}>
        <TableHeaderWrapper
          ref={headerRef}
          style={{
            height: headerHeight,
            willChange: virtualizerState.isScrolling
              ? 'scroll-position'
              : undefined,
          }}
        >
          {headerView}
        </TableHeaderWrapper>
        <ScrollView
          {...scrollViewProps}
          {...bodyStyleProps}
          role="presentation"
          innerStyle={{ overflow: 'visible' }}
          ref={bodyRef}
          contentSize={virtualizerState.contentSize}
          onScrollStart={virtualizerState.startScrolling}
          onScrollEnd={virtualizerState.endScrolling}
          onScroll={syncScroll}
        >
          {bodyView}
        </ScrollView>
      </div>
    </FocusScope>
  );
}

// Styled components
// ------------------------------

function TableHead({ children, style }: HTMLAttributes<HTMLElement>) {
  let { rowGroupProps } = useTableRowGroup();
  let styleProps = useHeadStyleProps({ style });

  return (
    <div {...rowGroupProps} {...styleProps}>
      {children}
    </div>
  );
}
function TableBody(props: HTMLAttributes<HTMLElement>) {
  let { rowGroupProps } = useTableRowGroup();

  return <div {...rowGroupProps} {...props} />;
}

const TableHeaderWrapper = forwardRef(function TableHeaderWrapper(
  props: {
    children: ReactNode;
    style: CSSProperties;
  },
  ref: ForwardedRef<HTMLDivElement>
) {
  let styleProps = useHeaderWrapperStyleProps(props);

  return (
    <div ref={ref} role="presentation" {...styleProps}>
      {props.children}
    </div>
  );
});

function TableHeaderRow(props: {
  children: ReactNode;
  item: any;
  style: CSSProperties;
}) {
  let ref = useRef<HTMLDivElement>(null);
  let { state } = useTableContext();
  let { rowProps } = useTableHeaderRow(
    { node: props.item, isVirtualized: true },
    state,
    ref
  );
  let styleProps = useRowHeaderStyleProps(props);

  return (
    <div {...rowProps} {...styleProps} ref={ref}>
      {props.children}
    </div>
  );
}

function TableColumnHeader<T>({ column }: { column: any }) {
  let ref = useRef<HTMLDivElement>(null);
  let { state } = useTableContext();
  let { columnHeaderProps } = useTableColumnHeader(
    { node: column, isVirtualized: true },
    state,
    ref
  );
  let { isFocusVisible, focusProps } = useFocusRing();
  let columnProps = column.props as ColumnProps<T>;
  let cellStyleProps = useCellStyleProps(columnProps, { isFocusVisible });

  return (
    <div
      {...mergeProps(columnHeaderProps, focusProps)}
      {...cellStyleProps}
      ref={ref}
    >
      {columnProps.allowsSorting && columnProps.align === 'end' && (
        <SortIndicator />
      )}

      {columnProps.hideHeader ? (
        <VisuallyHidden>{column.rendered}</VisuallyHidden>
      ) : isReactText(column.rendered) ? (
        <Text color="inherit" weight="semibold" truncate>
          {column.rendered}
        </Text>
      ) : (
        column.rendered
      )}

      {columnProps.allowsSorting && columnProps.align !== 'end' && (
        <SortIndicator />
      )}
    </div>
  );
}

function TableRow({
  children,
  hasAction,
  item,
  style,
}: {
  children: ReactNode;
  hasAction: boolean;
  item: any;
  style: CSSProperties;
}) {
  let ref = useRef<HTMLDivElement>(null);
  let { state } = useTableContext();
  let allowsInteraction =
    state.selectionManager.selectionMode !== 'none' || hasAction;
  let isDisabled = !allowsInteraction || state.disabledKeys.has(item.key);

  let { rowProps } = useTableRow(
    { node: item, isVirtualized: true },
    state,
    ref
  );
  // The row should show the focus background style when any cell inside it is focused.
  // If the row itself is focused, then it should have a blue focus indicator on the left.
  let { isFocusVisible: isFocusWithin, focusProps: focusWithinProps } =
    useFocusRing({ within: true });
  let { isFocusVisible, focusProps } = useFocusRing();
  let { hoverProps, isHovered } = useHover({ isDisabled });
  let { pressProps, isPressed } = usePress({ isDisabled });
  let styleProps = useRowStyleProps(
    { style },
    {
      isFocusVisible,
      isFocusWithin,
      isHovered,
      isPressed,
    }
  );

  return (
    <div
      {...mergeProps(
        rowProps,
        focusWithinProps,
        focusProps,
        hoverProps,
        pressProps
      )}
      {...styleProps}
      ref={ref}
    >
      {children}
    </div>
  );
}

function TableCell<T>({
  cell,
  overflowMode,
}: {
  cell: any;
  overflowMode: TableProps<T>['overflowMode'];
}) {
  let ref = useRef<HTMLDivElement>(null);
  let { state } = useTableContext();
  let { gridCellProps } = useTableCell(
    { node: cell, isVirtualized: true },
    state,
    ref
  );
  let { isFocusVisible, focusProps } = useFocusRing();
  let styleProps = useCellStyleProps(cell.column.props, { isFocusVisible });

  return (
    <div {...mergeProps(gridCellProps, focusProps)} {...styleProps} ref={ref}>
      <SlotProvider slots={{ text: { truncate: overflowMode === 'truncate' } }}>
        {isReactText(cell.rendered) ? (
          <Text>{cell.rendered}</Text>
        ) : (
          cell.rendered
        )}
      </SlotProvider>
    </div>
  );
}

function TableCheckboxCell({ cell }: { cell: any }) {
  let ref = useRef<HTMLDivElement>(null);
  let { state } = useTableContext();
  let { gridCellProps } = useTableCell(
    { node: cell, isVirtualized: true },
    state,
    ref
  );
  let { checkboxProps } = useTableSelectionCheckbox(
    { key: cell.parentKey },
    state
  );
  let styleProps = useSelectionCellStyleProps();

  return (
    <div {...styleProps} {...gridCellProps} ref={ref}>
      <Checkbox {...checkboxProps} />
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
  let styleProps = useSelectionCellStyleProps();

  return (
    <div {...styleProps} {...columnHeaderProps} ref={ref}>
      {state.selectionManager.selectionMode === 'single' ? (
        <Text visuallyHidden>{checkboxProps['aria-label']}</Text>
      ) : (
        <Checkbox {...checkboxProps} />
      )}
    </div>
  );
}

function CenteredWrapper({ children }: { children: ReactNode }) {
  let { state } = useTableContext();
  return (
    <div
      role="row"
      aria-rowindex={
        state.collection.headerRows.length + state.collection.size + 1
      }
      style={{
        alignItems: 'center',
        display: 'flex',
        height: '100%',
        justifyContent: 'center',
        width: '100%',
      }}
    >
      <div role="rowheader" aria-colspan={state.collection.columns.length}>
        {children}
      </div>
    </div>
  );
}
