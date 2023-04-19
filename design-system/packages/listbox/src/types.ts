import { BaseStyleProps } from '@keystar-ui/style';
import { AriaLabellingProps, DOMProps } from '@keystar-ui/types';

import {
  AsyncLoadable,
  CollectionBase,
  FocusEvents,
  FocusStrategy,
  MultipleSelection,
} from '@react-types/shared';

export type ListBoxProps<T> = CollectionBase<T> & {
  /** Whether to auto focus the listbox or an option. */
  autoFocus?: boolean | FocusStrategy;
  /** Whether focus should wrap around when the end/start is reached. */
  shouldFocusWrap?: boolean;
} & AriaLabellingProps &
  AsyncLoadable &
  BaseStyleProps &
  DOMProps &
  FocusEvents &
  MultipleSelection;
