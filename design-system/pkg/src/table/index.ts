'use client';

import { Column } from '@react-stately/table';
import { ColumnProps } from './types';

export { TableView } from './TableView';

// Override TS for Column to support Keystar UI specific props.
const VoussoirColumn = Column as <T>(props: ColumnProps<T>) => JSX.Element;
export { VoussoirColumn as Column };

export { Cell, Row, TableBody, TableHeader } from '@react-stately/table';

export type { SortDescriptor, SortDirection } from '@react-types/shared';
