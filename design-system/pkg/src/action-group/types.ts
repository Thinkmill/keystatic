import type { Key } from '@react-types/shared';
import type { AnchorHTMLAttributes, ReactElement, ReactNode } from 'react';

import type { BaseStyleProps } from '@keystar/ui/style';

export interface ActionGroupItemProps {
  id: Key;
  children: ReactNode;
  isDisabled?: boolean;
  textValue?: string;
  href?: string;
  target?: AnchorHTMLAttributes<HTMLAnchorElement>['target'];
  rel?: AnchorHTMLAttributes<HTMLAnchorElement>['rel'];
}

export interface ActionGroupProps<T = object> extends BaseStyleProps {
  children: ReactNode | ((item: T) => ReactNode);
  items?: Iterable<T>;
  density?: 'compact' | 'regular';
  isJustified?: boolean;
  isDisabled?: boolean;
  disabledKeys?: Iterable<Key>;
  orientation?: 'horizontal' | 'vertical';
  overflowMode?: 'wrap' | 'collapse';
  buttonLabelBehavior?: 'show' | 'hide';
  prominence?: 'low' | 'default';
  selectionMode?: 'none' | 'single' | 'multiple';
  selectedKeys?: Iterable<Key>;
  defaultSelectedKeys?: Iterable<Key>;
  disallowEmptySelection?: boolean;
  onSelectionChange?: (keys: Set<Key>) => void;
  onAction?: (key: Key) => void;
  summaryIcon?: ReactElement;
  /** The composite role. Use `group` when nesting within another toolbar. */
  role?: 'toolbar' | 'group';
  'aria-label'?: string;
  'aria-labelledby'?: string;
}
