import { AriaMenuProps, SpectrumMenuTriggerProps } from '@react-types/menu';
import { DisabledBehavior } from '@react-types/shared';
import { ReactElement } from 'react';

import { BaseStyleProps } from '@voussoir/style';
import { ActionButtonProps } from '@voussoir/button';

export type MenuProps<T> = {
  /** Whether `disabledKeys` applies to all interactions, or only selection. */
  disabledBehavior?: DisabledBehavior;
} & AriaMenuProps<T> &
  BaseStyleProps;

export type MenuTriggerProps = {
  /** The  trigger element and `Menu`. */
  children: ReactElement[];
} & SpectrumMenuTriggerProps;

export type ActionMenuProps<T> = {
  /** Whether the element should receive focus on render. */
  autoFocus?: boolean; // override MenuProps
  /** Whether the button is disabled. */
  isDisabled?: boolean;
} & Omit<SpectrumMenuTriggerProps, 'trigger'> &
  MenuProps<T> &
  Pick<ActionButtonProps, 'prominence'>;
