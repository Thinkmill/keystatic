import {
  AriaLabelingProps,
  CollectionBase,
  DOMProps,
  Expandable,
  MultipleSelection,
} from '@react-types/shared';
import { RefObject } from 'react';

import { BaseStyleProps } from '@voussoir/style';

export type NavTreeProps<T> = CollectionBase<T> & {
  /**
   * Whether focus should wrap around when the end/start is reached.
   * @default false
   */
  shouldFocusWrap?: boolean;
  /**
   * The ref attached to the scrollable body. Used to provided automatic
   * scrolling on item focus for non-virtualized trees.
   */
  scrollRef?: RefObject<HTMLElement>;
} & Expandable &
  MultipleSelection &
  DOMProps &
  AriaLabelingProps &
  BaseStyleProps;
