import {
  FocusableProps,
  RangeInputBase,
  TextInputDOMEvents,
  ValueBase,
} from '@react-types/shared';

import { FieldProps } from '@keystar/ui/field';

export type NumberFieldProps = {
  /**
   * A custom aria-label for the decrement button. If not provided, the
   * localized string "Decrement" is used.
   */
  decrementAriaLabel?: string;
  /**
   * A custom aria-label for the increment button. If not provided, the
   * localized string "Increment" is used.
   */
  incrementAriaLabel?: string;
  /**
   * Formatting options for the value displayed in the number field.
   * This also affects what characters are allowed to be typed by the user.
   */
  formatOptions?: Intl.NumberFormatOptions;
  /** Whether to hide the increment and decrement buttons. */
  hideStepper?: boolean;
} & ValueBase<number> &
  RangeInputBase<number> &
  FieldProps &
  FocusableProps &
  TextInputDOMEvents;
