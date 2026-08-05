import {
  Button as AriaButton,
  Cell as AriaCell,
  Checkbox as AriaCheckbox,
  Column as AriaColumn,
  ColumnResizer,
  ResizableTableContainer,
  Row as AriaRow,
  Table as AriaTable,
  TableBody as AriaTableBody,
  TableHeader as AriaTableHeader,
  TableLoadMoreItem as AriaTableLoadMoreItem,
  type CellRenderProps,
  type ColumnRenderProps,
} from 'react-aria-components/Table';
import {
  TableLayout,
  type TableLayoutProps,
  Virtualizer,
} from 'react-aria-components/Virtualizer';
import {
  createContext,
  type ForwardedRef,
  type ReactElement,
  type ReactNode,
  forwardRef,
  useContext,
  useMemo,
} from 'react';
import { VisuallyHidden } from 'react-aria/VisuallyHidden';
import { useLocalizedStringFormatter } from 'react-aria/useLocalizedStringFormatter';

import { CheckboxIndicator } from '@keystar/ui/checkbox';
import { Icon } from '@keystar/ui/icon';
import { gripVerticalIcon } from '@keystar/ui/icon/icons/gripVerticalIcon';
import { ProgressCircle } from '@keystar/ui/progress';
import {
  type BaseStyleProps,
  classNames,
  toDataAttributes,
  useStyleProps,
} from '@keystar/ui/style';

import localizedMessages from './l10n';
import {
  CellContents,
  SortIndicator,
  bodyClassname,
  cellClassname,
  centeredWrapperClassname,
  checkboxCellClassname,
  columnResizerClassname,
  dragCellClassname,
  headerCellClassname,
  headerClassname,
  rowClassname,
  tableClassname,
} from './styles';
import type {
  CellProps,
  ColumnProps,
  RowProps,
  TableBodyProps,
  TableHeaderProps,
  TableLoadMoreItemProps,
  TableProps,
} from './types';

const DEFAULT_HEADER_HEIGHT = 36;
const ROW_HEIGHTS = { compact: 28, regular: 36, spacious: 44 } as const;

const TableViewContext = createContext({
  density: 'regular' as NonNullable<TableProps['density']>,
  overflowMode: 'truncate' as NonNullable<TableProps['overflowMode']>,
});

export function TableView(props: TableProps) {
  let {
    density = 'regular',
    prominence = 'default',
    overflowMode = 'truncate',
    onAction,
    onRowAction,
    onResize,
    onResizeEnd,
    onResizeStart,
    ...otherProps
  } = props;
  let styleProps = useStyleProps(props);
  let { layout, layoutOptions } = useMemo(() => {
    let layoutOptions: TableLayoutProps = {
      rowHeight: overflowMode === 'wrap' ? undefined : ROW_HEIGHTS[density],
      estimatedRowHeight:
        overflowMode === 'wrap' ? ROW_HEIGHTS[density] : undefined,
      headingHeight:
        overflowMode === 'wrap' ? undefined : DEFAULT_HEADER_HEIGHT,
      estimatedHeadingHeight:
        overflowMode === 'wrap' ? DEFAULT_HEADER_HEIGHT : undefined,
    };
    return { layout: new TableLayout(layoutOptions), layoutOptions };
  }, [density, overflowMode]);

  return (
    <TableViewContext.Provider value={{ density, overflowMode }}>
      <ResizableTableContainer
        {...styleProps}
        {...toDataAttributes({ density, overflowMode, prominence })}
        className={classNames(tableClassname, styleProps.className)}
        onResize={onResize}
        onResizeEnd={onResizeEnd}
        onResizeStart={onResizeStart}
      >
        <Virtualizer
          layout={layout}
          layoutOptions={layoutOptions}
          shouldObserveItemSize={overflowMode === 'wrap'}
        >
          <AriaTable
            {...otherProps}
            className={bodyClassname}
            onRowAction={onAction ?? onRowAction}
            style={{ height: '100%', overflow: 'auto', width: '100%' }}
          />
        </Virtualizer>
      </ResizableTableContainer>
    </TableViewContext.Provider>
  );
}

function TableHeader<T>(
  props: TableHeaderProps<T>,
  forwardedRef: ForwardedRef<HTMLDivElement | HTMLTableSectionElement>
) {
  let styleProps = useStyleProps(props);
  return (
    <AriaTableHeader
      {...props}
      {...styleProps}
      ref={forwardedRef}
      className={classNames(headerClassname, styleProps.className)}
    />
  );
}

const _TableHeader = forwardRef(TableHeader) as <T>(
  props: TableHeaderProps<T> & {
    ref?: ForwardedRef<HTMLDivElement | HTMLTableSectionElement>;
  }
) => ReactElement;
export { _TableHeader as TableHeader };

function ColumnImpl(
  props: ColumnProps,
  forwardedRef: ForwardedRef<HTMLDivElement | HTMLTableCellElement>
) {
  let {
    align,
    allowsResizing,
    children,
    hideHeader,
    maxWidth,
    minWidth,
    showDivider,
    width,
    ...otherProps
  } = props;
  let { density, overflowMode } = useContext(TableViewContext);
  let styleProps = useStyleProps(otherProps as BaseStyleProps);
  let stringFormatter = useLocalizedStringFormatter(localizedMessages);

  return (
    <AriaColumn
      {...otherProps}
      {...styleProps}
      maxWidth={maxWidth}
      minWidth={minWidth}
      width={width}
      {...toDataAttributes({
        align,
        density,
        hideHeader: hideHeader || undefined,
        overflowMode,
        showDivider: showDivider || undefined,
      })}
      ref={forwardedRef}
      className={classNames(headerCellClassname, styleProps.className)}
    >
      {states => (
        <>
          {hideHeader ? (
            <VisuallyHidden>
              {resolveColumnChildren(children, states)}
            </VisuallyHidden>
          ) : (
            resolveColumnChildren(children, states)
          )}
          {states.allowsSorting && <SortIndicator />}
          {allowsResizing && (
            <ColumnResizer
              aria-label={stringFormatter.format('resizeColumn')}
              className={columnResizerClassname}
            />
          )}
        </>
      )}
    </AriaColumn>
  );
}

export const Column = forwardRef(ColumnImpl);

function TableBody<T>(
  props: TableBodyProps<T>,
  forwardedRef: ForwardedRef<HTMLDivElement | HTMLTableSectionElement>
) {
  let { renderEmptyState, ...otherProps } = props;
  let styleProps = useStyleProps(props);
  return (
    <AriaTableBody
      {...otherProps}
      {...styleProps}
      ref={forwardedRef}
      renderEmptyState={
        renderEmptyState
          ? states => (
              <div className={centeredWrapperClassname}>
                {renderEmptyState(states)}
              </div>
            )
          : undefined
      }
    />
  );
}

const _TableBody = forwardRef(TableBody) as <T>(
  props: TableBodyProps<T> & {
    ref?: ForwardedRef<HTMLDivElement | HTMLTableSectionElement>;
  }
) => ReactElement;
export { _TableBody as TableBody };

function Row<T>(
  props: RowProps<T>,
  forwardedRef: ForwardedRef<HTMLDivElement | HTMLTableRowElement>
) {
  let styleProps = useStyleProps(props);
  return (
    <AriaRow
      {...props}
      {...styleProps}
      ref={forwardedRef}
      className={classNames(rowClassname, styleProps.className)}
    />
  );
}

const _Row = forwardRef(Row) as <T>(
  props: RowProps<T> & {
    ref?: ForwardedRef<HTMLDivElement | HTMLTableRowElement>;
  }
) => ReactElement;
export { _Row as Row };

function CellImpl(
  props: CellProps,
  forwardedRef: ForwardedRef<HTMLDivElement | HTMLTableCellElement>
) {
  let { align, children, hideHeader, showDivider, ...otherProps } = props;
  let { density, overflowMode } = useContext(TableViewContext);
  let styleProps = useStyleProps(props);
  return (
    <AriaCell
      {...otherProps}
      {...styleProps}
      {...toDataAttributes({
        align,
        density,
        hideHeader: hideHeader || undefined,
        overflowMode,
        showDivider: showDivider || undefined,
      })}
      ref={forwardedRef}
      className={classNames(cellClassname, styleProps.className)}
    >
      {states => (
        <CellContents>{resolveCellChildren(children, states)}</CellContents>
      )}
    </AriaCell>
  );
}

export const Cell = forwardRef(CellImpl);

export function TableSelectionColumn(props: Omit<ColumnProps, 'children'>) {
  return (
    <Column
      {...props}
      width={36}
      UNSAFE_className={checkboxCellClassname}
      textValue="Select"
    >
      <AriaCheckbox slot="selection">
        {({ isIndeterminate }) => (
          <CheckboxIndicator isIndeterminate={isIndeterminate} />
        )}
      </AriaCheckbox>
    </Column>
  );
}

export function TableSelectionCell() {
  return (
    <AriaCell className={classNames(cellClassname, checkboxCellClassname)}>
      <AriaCheckbox slot="selection">
        <CheckboxIndicator />
      </AriaCheckbox>
    </AriaCell>
  );
}

export function TableDragColumn(props: Omit<ColumnProps, 'children'>) {
  return (
    <Column
      {...props}
      width={20}
      UNSAFE_className={dragCellClassname}
      textValue="Drag"
    />
  );
}

export function TableDragCell() {
  let stringFormatter = useLocalizedStringFormatter(localizedMessages);
  return (
    <AriaCell className={classNames(cellClassname, dragCellClassname)}>
      <AriaButton slot="drag" aria-label={stringFormatter.format('drag')}>
        <Icon src={gripVerticalIcon} color="neutral" />
      </AriaButton>
    </AriaCell>
  );
}

export function TableLoadMoreItem(props: TableLoadMoreItemProps) {
  let stringFormatter = useLocalizedStringFormatter(localizedMessages);
  let {
    children,
    isLoading,
    'aria-label': ariaLabel = stringFormatter.format('loadingMore'),
    ...otherProps
  } = props;
  let styleProps = useStyleProps(props);
  return (
    <AriaTableLoadMoreItem
      {...otherProps}
      {...styleProps}
      isLoading={isLoading}
    >
      {children ??
        (isLoading ? (
          <div className={centeredWrapperClassname}>
            <ProgressCircle isIndeterminate aria-label={ariaLabel} />
          </div>
        ) : null)}
    </AriaTableLoadMoreItem>
  );
}

function resolveColumnChildren(
  children: ColumnProps['children'],
  states: ColumnRenderProps
) {
  return typeof children === 'function'
    ? (children as (states: ColumnRenderProps) => ReactNode)(states)
    : children;
}

function resolveCellChildren(
  children: CellProps['children'],
  states: CellRenderProps
) {
  return typeof children === 'function'
    ? (children as (states: CellRenderProps) => ReactNode)(states)
    : children;
}
