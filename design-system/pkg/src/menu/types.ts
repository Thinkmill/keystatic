import {
  AriaMenuProps,
  MenuTriggerProps as _MenuTriggerProps,
} from '@react-types/menu';
import {
  Alignment,
  AriaLabelingProps,
  CollectionBase,
  DOMProps,
  DisabledBehavior,
} from '@react-types/shared';
import { Key, ReactElement } from 'react';

import { BaseStyleProps } from '@keystar/ui/style';
import { ActionButtonProps } from '@keystar/ui/button';

export type MenuProps<T> = {
  /** Whether `disabledKeys` applies to all interactions, or only selection. */
  disabledBehavior?: DisabledBehavior;
} & AriaMenuProps<T> &
  BaseStyleProps;

export type MenuTriggerProps = {
  /** The  trigger element and `Menu`. */
  children: ReactElement[];
  /**
   * Alignment of the menu relative to the trigger.
   * @default 'start'
   */
  align?: Alignment;
  /**
   * Where the Menu opens relative to its trigger.
   * @default 'bottom'
   */
  direction?: 'bottom' | 'top' | 'left' | 'right' | 'start' | 'end';
  /**
   * Whether the menu should automatically flip direction when space is limited.
   * @default true
   */
  shouldFlip?: boolean;
  /**
   * Whether the Menu closes when a selection is made.
   * @default true
   */
  closeOnSelect?: boolean;
} & _MenuTriggerProps;

export type ActionMenuProps<T> = {
  /** Whether the button is disabled. */
  isDisabled?: boolean;
  /** Whether the button should be displayed with a [quiet style](https://spectrum.adobe.com/page/action-button/#Quiet). */
  isQuiet?: boolean;
  /** Whether the element should receive focus on render. */
  autoFocus?: boolean;
  /** Handler that is called when an item is selected. */
  onAction?: (key: Key) => void;
} & CollectionBase<T> &
  Omit<MenuTriggerProps, 'children'> &
  Pick<ActionButtonProps, 'prominence'> &
  BaseStyleProps &
  DOMProps &
  AriaLabelingProps;
