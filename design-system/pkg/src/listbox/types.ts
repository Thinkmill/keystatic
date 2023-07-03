import { AriaListBoxOptions } from '@react-aria/listbox';
import { ListLayout } from '@react-stately/layout';
import { ListState } from '@react-stately/list';
import {
  AriaLabelingProps,
  AsyncLoadable,
  CollectionBase,
  DOMProps,
  FocusEvents,
  FocusStrategy,
  MultipleSelection,
} from '@react-types/shared';
import { HTMLAttributes, ReactNode } from 'react';

import { BaseStyleProps } from '@keystar/ui/style';

/** @private */
export type ListBoxBaseProps<T> = {
  autoFocus?: boolean | FocusStrategy;
  disallowEmptySelection?: boolean;
  domProps?: HTMLAttributes<HTMLElement>;
  focusOnPointerEnter?: boolean;
  isLoading?: boolean;
  layout: ListLayout<T>;
  onLoadMore?: () => void;
  onScroll?: () => void;
  renderEmptyState?: () => ReactNode;
  shouldFocusWrap?: boolean;
  shouldSelectOnPressUp?: boolean;
  shouldUseVirtualFocus?: boolean;
  state: ListState<T>;
  transitionDuration?: number;
} & AriaListBoxOptions<T> &
  AriaLabelingProps &
  BaseStyleProps &
  DOMProps;

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
