import {
  AriaLabelingProps,
  CollectionBase,
  DOMProps,
  Expandable,
} from '@react-types/shared';
import { Key, RefObject } from 'react';

import { BaseStyleProps } from '@keystar/ui/style';

// deviate from react-stately's types
type ControlledSelection = {
  /** The currently selected key in the collection. */
  selectedKey?: Key | null;
  /** Handler that is called when the selection changes. */
  onSelectionChange?: (key: Key) => any;
};

export type NavTreeProps<T> = CollectionBase<T> & {
  /**
   * Handler that is called when a user performs _any_ action on an item.
   * Generally prefer the more specific `onSelectionChange` and
   * `onExpandedChange` handlers.
   */
  onAction?: (key: Key) => any;
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
  ControlledSelection &
  DOMProps &
  AriaLabelingProps &
  BaseStyleProps;
