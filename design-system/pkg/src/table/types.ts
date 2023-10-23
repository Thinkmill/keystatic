import { CollectionChildren, DOMProps } from '@react-types/shared';
import { TableProps as _TableProps } from '@react-types/table';
import { Key, ReactElement, ReactNode } from 'react';

import { BaseStyleProps } from '@keystar/ui/style';

type ColumnElement<T> = ReactElement<ColumnProps<T>>;
type ColumnRenderer<T> = (item: T) => ColumnElement<T>;

export type TableProps<T> = {
  /**
   * Sets the amount of vertical padding within each cell.
   * @default 'regular'
   */
  density?: 'compact' | 'regular' | 'spacious';
  /** Handler that is called when a user performs an action on a row. */
  onRowAction?: (key: Key) => void;
  /**
   * Sets the overflow behavior for the cell contents.
   * @default 'truncate'
   */
  overflowMode?: 'wrap' | 'truncate';
  /**
   * The visual prominence of the table.
   * @default 'default'
   */
  prominence?: 'default' | 'low';
  /** What should render when there is no content to display. */
  renderEmptyState?: () => JSX.Element;
} & _TableProps<T> &
  BaseStyleProps &
  DOMProps;

export interface ColumnProps<T> {
  /** Static child columns or content to render as the column header. */
  children: ReactNode | ColumnElement<T> | ColumnElement<T>[];
  /** The width of the column. */
  width?: number | string;
  /** The minimum width of the column. */
  minWidth?: number | string;
  /** The maximum width of the column. */
  maxWidth?: number | string;
  /**
   * The default width of the column.
   * @private
   */
  defaultWidth?: number | string;
  /**
   * Whether the column allows resizing.
   * @private
   */
  allowsResizing?: boolean;
  /** Whether the column allows sorting. */
  allowsSorting?: boolean;
  /** Whether a column is a [row header](https://www.w3.org/TR/wai-aria-1.1/#rowheader) and should be announced by assistive technology during row navigation. */
  isRowHeader?: boolean;
  /** A string representation of the column's contents, used for accessibility announcements. */
  textValue?: string;
  /**
   * The alignment of the column's contents relative to its allotted width.
   * @default 'start'
   */
  align?: 'start' | 'center' | 'end';
  /** Whether the column should render a divider between it and the next column. */
  showDivider?: boolean;
  /**
   * Whether the column should hide its header text. A tooltip with the column's header text
   * will be displayed when the column header is focused instead. Note that this prop is specifically for columns
   * that contain ActionButtons in place of text content.
   */
  hideHeader?: boolean;
}
export interface TableHeaderProps<T> {
  /** A list of table columns. */
  columns?: T[];
  /** A list of `Column(s)` or a function. If the latter, a list of columns must be provided using the `columns` prop. */
  children: ColumnElement<T> | ColumnElement<T>[] | ColumnRenderer<T>;
}

export interface TableBodyProps<T> {
  /** The contents of the table body. Supports static items or a function for dynamic rendering. */
  children: CollectionChildren<T>;
  /** A list of row objects in the table body used when dynamically rendering rows. */
  items?: Iterable<T>;
}
