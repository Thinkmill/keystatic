import { BaseStyleProps } from '@voussoir/style';

import {
  AriaLabelingProps,
  AsyncLoadable,
  CollectionBase,
  DOMProps,
  FocusEvents,
  FocusStrategy,
  MultipleSelection,
} from '@react-types/shared';
import { AriaListBoxOptions } from '@react-aria/listbox';
import { ListLayout } from '@react-stately/layout';
import { ListState } from '@react-stately/list';
import { HTMLAttributes, ReactNode } from 'react';

/** @private */
export type ListBoxBaseProps<T> = {
  layout: ListLayout<T>;
  state: ListState<T>;
  autoFocus?: boolean | FocusStrategy;
  shouldFocusWrap?: boolean;
  shouldSelectOnPressUp?: boolean;
  focusOnPointerEnter?: boolean;
  domProps?: HTMLAttributes<HTMLElement>;
  disallowEmptySelection?: boolean;
  shouldUseVirtualFocus?: boolean;
  transitionDuration?: number;
  isLoading?: boolean;
  onLoadMore?: () => void;
  renderEmptyState?: () => ReactNode;
  onScroll?: () => void;
} & AriaListBoxOptions<T> &
  DOMProps &
  AriaLabelingProps &
  BaseStyleProps;

export type ListBoxProps<T> = CollectionBase<T> & {
  /** Whether to auto focus the listbox or an option. */
  autoFocus?: boolean | FocusStrategy;
  /** Whether focus should wrap around when the end/start is reached. */
  shouldFocusWrap?: boolean;
} & AriaLabelingProps &
  AsyncLoadable &
  BaseStyleProps &
  DOMProps &
  FocusEvents &
  MultipleSelection;
