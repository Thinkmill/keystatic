import { SpectrumPickerProps } from '@react-types/select';
import { ActionButtonProps } from '@keystar/ui/button';

import { FieldProps } from '@keystar/ui/field';
import { BaseStyleProps } from '@keystar/ui/style';

export type PickerProps<T> = {
  /**
   * Alignment of the menu, relative to the input target.
   * @default 'start'
   */
  align?: 'start' | 'end';
  /** Whether the element should receive focus on render. */
  autoFocus?: boolean;
  /**
   * Direction the menu will render relative to the Picker.
   * @default 'bottom'
   */
  direction?: 'bottom' | 'top';
  /** Width of the menu. */
  menuWidth?: number; // TODO: accept dimension token?
  /**
   * Whether the menu should automatically flip direction when space is limited.
   * @default true
   */
  shouldFlip?: boolean;
} & SpectrumPickerProps<T> &
  FieldProps &
  Pick<ActionButtonProps, 'prominence'> &
  BaseStyleProps;
