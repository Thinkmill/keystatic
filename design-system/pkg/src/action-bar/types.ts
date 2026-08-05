import { BaseStyleProps } from '@keystar/ui/style';
import { DOMProps, Key } from '@react-types/shared';
import { ReactElement, ReactNode } from 'react';
import type { ActionGroupItemProps } from '@keystar/ui/action-group';

type ItemElement = ReactElement<ActionGroupItemProps> | null;

export type ActionBarProps<T extends object> = {
  children: ItemElement | ItemElement[] | ((item: T) => ItemElement);
  items?: Iterable<T>;
  disabledKeys?: Iterable<Key>;
  selectedItemCount: number | 'all';
  onClearSelection: () => void;
  isEmphasized?: boolean;
  onAction?: (key: Key) => void;
  buttonLabelBehavior?: 'show' | 'hide';
} & DOMProps &
  BaseStyleProps;

export type ActionBarContainerProps = {
  children: ReactNode;
} & DOMProps &
  BaseStyleProps;
