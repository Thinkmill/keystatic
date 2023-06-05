import {
  AriaLabelingProps,
  CollectionBase,
  DOMProps,
  Expandable,
  MultipleSelection,
} from '@react-types/shared';

import { BaseStyleProps } from '@voussoir/style';

export type NavTreeProps<T> = CollectionBase<T> & {
  shouldFocusWrap?: boolean;
} & Expandable &
  MultipleSelection &
  DOMProps &
  AriaLabelingProps &
  BaseStyleProps;
