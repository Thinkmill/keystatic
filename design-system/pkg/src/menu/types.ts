import type {
  MenuProps as AriaMenuProps,
  MenuTriggerProps as AriaMenuTriggerProps,
} from 'react-aria-components/Menu';
import type {
  Alignment,
  AriaLabelingProps,
  DOMProps,
} from '@react-types/shared';

import type { ReactElement } from 'react';

import type { BaseStyleProps } from '@keystar/ui/style';
import type { ActionButtonProps } from '@keystar/ui/button';

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
} & Omit<AriaMenuTriggerProps, 'trigger'>;

export type ActionMenuProps<T> = {
  /** Whether the element should receive focus on render. */
  autoFocus?: boolean;
  /** Whether the button is disabled. */
  isDisabled?: boolean;
  /** Handler that is called when an item is selected. */
} & Pick<
  AriaMenuProps<T>,
  'children' | 'dependencies' | 'disabledKeys' | 'items' | 'onAction'
> &
  Omit<MenuTriggerProps, 'children'> &
  Pick<ActionButtonProps, 'prominence'> &
  BaseStyleProps &
  DOMProps &
  AriaLabelingProps;
