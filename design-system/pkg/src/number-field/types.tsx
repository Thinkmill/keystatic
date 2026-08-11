import type { NumberFieldProps as AriaNumberFieldProps } from 'react-aria-components/NumberField';
import { ValidationState } from '@react-types/shared';

import { FieldProps } from '@keystar/ui/field';
import { BaseStyleProps } from '@keystar/ui/style';

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
  /** Whether the field is valid or invalid. */
  validationState?: ValidationState;
} & Omit<AriaNumberFieldProps, 'children' | 'className' | 'style'> &
  FieldProps &
  BaseStyleProps;
