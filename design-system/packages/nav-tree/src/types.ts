import {
  AriaLabelingProps,
  CollectionBase,
  DOMProps,
  Expandable,
  MultipleSelection,
} from '@react-types/shared';
import { Key, RefObject } from 'react';

import { BaseStyleProps } from '@voussoir/style';

export type NavTreeProps<T> = CollectionBase<T> & {
  /**
   * Handler that is called when a user performs an action on the item. The
   * exact user event depends on the collection's `selectionBehavior` and
   * the interaction modality.
   */
  onAction: (key: Key) => void;
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
