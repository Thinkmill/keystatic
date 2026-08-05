import type {
  GridListItemProps as AriaGridListItemProps,
  GridListLoadMoreItemProps as AriaGridListLoadMoreItemProps,
  GridListProps as AriaGridListProps,
} from 'react-aria-components/GridList';

import type { BaseStyleProps } from '@keystar/ui/style';

export interface ListViewProps<T>
  extends Omit<AriaGridListProps<T>, 'className' | 'style'>,
    BaseStyleProps {
  /** Sets the amount of vertical padding within each row. */
  density?: 'compact' | 'regular' | 'spacious';
  /** Sets the text behavior for row contents. */
  overflowMode?: 'truncate' | 'wrap';
  /** Whether selection is represented by a highlight or checkboxes. */
  selectionStyle?: 'highlight' | 'checkbox';
}

export interface ListViewItemProps<T = object>
  extends Omit<AriaGridListItemProps<T>, 'className' | 'style'>,
    BaseStyleProps {
  /** Whether this item leads to a child collection. */
  hasChildItems?: boolean;
}

export interface ListViewLoadMoreItemProps
  extends Omit<AriaGridListLoadMoreItemProps, 'className' | 'style'>,
    BaseStyleProps {
  /** Accessible label for the default loading indicator. */
  'aria-label'?: string;
}
