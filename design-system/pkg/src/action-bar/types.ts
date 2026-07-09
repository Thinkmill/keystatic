import { BaseStyleProps } from '@keystar/ui/style';
import { DOMProps, ItemProps, Key } from '@react-types/shared';
import { ReactElement, ReactNode } from 'react';

type ItemElement<T> = ReactElement<ItemProps<T>> | null;

export type ActionBarProps<T> = {
  children: ItemElement<T> | ItemElement<T>[] | ((item: T) => ItemElement<T>);
  items?: Iterable<T>;
  disabledKeys?: Iterable<Key>;
  selectedItemCount: number | 'all';
  onClearSelection: () => void;
  isEmphasized?: boolean;
  onAction?: (key: Key) => void;
  buttonLabelBehavior?: 'show' | 'collapse' | 'hide';
} & DOMProps &
  BaseStyleProps;

export type ActionBarContainerProps = {
  children: ReactNode;
} & DOMProps &
  BaseStyleProps;
