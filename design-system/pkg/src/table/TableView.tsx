import { HTMLAttributes, ReactNode, useRef } from 'react';

import { useFocusRing } from '@react-aria/focus';
import { useHover } from '@react-aria/interactions';
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
import { mergeProps } from '@react-aria/utils';
import { TableState, useTableState } from '@react-stately/table';

import { Checkbox } from '@keystar/ui/checkbox';
import { Text } from '@keystar/ui/typography';
import { isReactText } from '@keystar/ui/utils';

import { ColumnProps, TableProps } from './types';
import {
  SortIndicator,
  useBodyStyleProps,
  useCellStyleProps,
  useHeadStyleProps,
  useRowHeaderStyleProps,
  useRowStyleProps,
  useSelectionCellStyleProps,
  useTableStyleProps,
} from './styles';

export function TableView<T extends object>(props: TableProps<T>) {
  let ref = useRef<HTMLDivElement>(null);
  // @ts-ignore FIXME: Resolve the disparity between the types of TableView and useTableState.
  let state = useTableState({
    ...props,
    showSelectionCheckboxes: props.selectionMode === 'multiple',
  });

  let { collection } = state;
  let { gridProps } = useTable(props, state, ref);
  let styleProps = useTableStyleProps(props);
  let rows = [...collection.body.childNodes];

  return (
    <div {...gridProps} {...styleProps} ref={ref}>
      <TableHead>
        {collection.headerRows.map(headerRow => (
          <TableHeaderRow key={headerRow.key} item={headerRow} state={state}>
            {[...headerRow.childNodes].map(column =>
              column.props.isSelectionCell ? (
                <TableSelectAllCell
                  key={column.key}
                  column={column}
                  state={state}
                />
              ) : (
                <TableColumnHeader
                  key={column.key}
                  column={column}
                  state={state}
                />
              )
            )}
          </TableHeaderRow>
        ))}
      </TableHead>

      <TableBody>
        {!rows.length && props.renderEmptyState ? (
          <div role="row" aria-rowindex={2}>
            <div role="rowheader" aria-colspan={collection.columnCount}>
              {props.renderEmptyState()}
            </div>
          </div>
        ) : (
          rows.map(row => (
            <TableRow
              key={row.key}
              item={row}
              state={state}
              hasAction={!!props.onRowAction}
            >
              {[...row.childNodes].map(cell =>
                cell.props.isSelectionCell ? (
                  <TableCheckboxCell key={cell.key} cell={cell} state={state} />
                ) : (
                  <TableCell
                    key={cell.key}
                    cell={cell}
                    state={state}
                    overflowMode={props.overflowMode}
                  />
                )
              )}
            </TableRow>
          ))
        )}
      </TableBody>
    </div>
  );
}

// Styled components
// ------------------------------

function TableHead({ children }: HTMLAttributes<HTMLElement>) {
  let { rowGroupProps } = useTableRowGroup();
  let styleProps = useHeadStyleProps();

  return (
    <div {...rowGroupProps} {...styleProps}>
      {children}
    </div>
  );
}
function TableBody({ children }: HTMLAttributes<HTMLElement>) {
  let { rowGroupProps } = useTableRowGroup();
  let styleProps = useBodyStyleProps();

  return (
    <div {...rowGroupProps} {...styleProps}>
      {children}
    </div>
  );
}

function TableHeaderRow<T>({
  item,
  state,
  children,
}: {
  item: any;
  children: ReactNode;
  state: TableState<T>;
}) {
  let ref = useRef<HTMLDivElement>(null);
  let { rowProps } = useTableHeaderRow({ node: item }, state, ref);
  let styleProps = useRowHeaderStyleProps();

  return (
    <div {...rowProps} {...styleProps} ref={ref}>
      {children}
    </div>
  );
}

function TableColumnHeader<T>({
  column,
  state,
}: {
  column: any;
  state: TableState<T>;
}) {
  let ref = useRef<HTMLDivElement>(null);
  let { columnHeaderProps } = useTableColumnHeader(
    { node: column },
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

      {isReactText(column.rendered) ? (
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

function TableRow<T>({
  item,
  children,
  state,
  hasAction,
}: {
  item: any;
  children: ReactNode;
  state: TableState<T>;
  hasAction: boolean;
}) {
  let ref = useRef<HTMLDivElement>(null);
  let allowsInteraction =
    state.selectionManager.selectionMode !== 'none' || hasAction;
  let isDisabled = !allowsInteraction || state.disabledKeys.has(item.key);
  let { rowProps, isPressed } = useTableRow({ node: item }, state, ref);
  // The row should show the focus background style when any cell inside it is focused.
  // If the row itself is focused, then it should have a blue focus indicator on the left.
  let { isFocusVisible: isFocusWithin, focusProps: focusWithinProps } =
    useFocusRing({ within: true });
  let { isFocusVisible, focusProps } = useFocusRing();
  let { hoverProps, isHovered } = useHover({ isDisabled });
  let styleProps = useRowStyleProps({
    isFocusVisible,
    isFocusWithin,
    isHovered,
    isPressed,
  });

  return (
    <div
      {...mergeProps(rowProps, focusWithinProps, focusProps, hoverProps)}
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
  state,
}: {
  cell: any;
  overflowMode: TableProps<T>['overflowMode'];
  state: TableState<T>;
}) {
  let ref = useRef<HTMLDivElement>(null);
  let { gridCellProps } = useTableCell({ node: cell }, state, ref);
  let { isFocusVisible, focusProps } = useFocusRing();
  let styleProps = useCellStyleProps(cell.column.props, { isFocusVisible });

  return (
    <div {...mergeProps(gridCellProps, focusProps)} {...styleProps} ref={ref}>
      {isReactText(cell.rendered) ? (
        <Text truncate={overflowMode === 'truncate'}>{cell.rendered}</Text>
      ) : (
        cell.rendered
      )}
    </div>
  );
}

function TableCheckboxCell<T>({
  cell,
  state,
}: {
  cell: any;
  state: TableState<T>;
}) {
  let ref = useRef<HTMLDivElement>(null);
  let { gridCellProps } = useTableCell({ node: cell }, state, ref);
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

function TableSelectAllCell<T>({
  column,
  state,
}: {
  column: any;
  state: TableState<T>;
}) {
  let ref = useRef<HTMLDivElement>(null);
  let { columnHeaderProps } = useTableColumnHeader(
    { node: column },
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
