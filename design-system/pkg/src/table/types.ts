import type {
  CellProps as AriaCellProps,
  ColumnProps as AriaColumnProps,
  RowProps as AriaRowProps,
  TableBodyProps as AriaTableBodyProps,
  TableHeaderProps as AriaTableHeaderProps,
  TableLoadMoreItemProps as AriaTableLoadMoreItemProps,
  TableProps as AriaTableProps,
} from 'react-aria-components/Table';
import type { ColumnSize } from 'react-stately/useTableState';
import type { Key } from '@react-types/shared';

import type { BaseStyleProps } from '@keystar/ui/style';

export type TableCosmeticConfig = {
  density?: 'compact' | 'regular' | 'spacious';
  overflowMode?: 'wrap' | 'truncate';
  prominence?: 'default' | 'low';
};

export interface TableProps
  extends Omit<AriaTableProps, 'className' | 'style'>,
    TableCosmeticConfig,
    BaseStyleProps {
  /** Alias for RAC's `onRowAction`. */
  onAction?: (key: Key) => void;
  onResizeStart?: (widths: Map<Key, ColumnSize>) => void;
  onResize?: (widths: Map<Key, ColumnSize>) => void;
  onResizeEnd?: (widths: Map<Key, ColumnSize>) => void;
}

export interface TableHeaderProps<T>
  extends Omit<AriaTableHeaderProps<T>, 'className' | 'style'>,
    BaseStyleProps {}

export interface TableBodyProps<T>
  extends Omit<AriaTableBodyProps<T>, 'className' | 'style'>,
    BaseStyleProps {}

export type ColumnProps = Omit<AriaColumnProps, 'className' | 'style'> &
  Omit<BaseStyleProps, 'width' | 'minWidth' | 'maxWidth'> & {
    align?: 'start' | 'center' | 'end';
    showDivider?: boolean;
    hideHeader?: boolean;
    allowsResizing?: boolean;
  };

export interface RowProps<T>
  extends Omit<AriaRowProps<T>, 'className' | 'style'>,
    BaseStyleProps {}

export interface CellProps
  extends Omit<AriaCellProps, 'className' | 'style'>,
    BaseStyleProps {
  align?: 'start' | 'center' | 'end';
  showDivider?: boolean;
  hideHeader?: boolean;
}

export interface TableLoadMoreItemProps
  extends Omit<AriaTableLoadMoreItemProps, 'className' | 'style'>,
    BaseStyleProps {
  'aria-label'?: string;
}
