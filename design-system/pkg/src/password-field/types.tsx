import { AriaButtonProps } from '@react-types/button';
import {
  DOMAttributes,
  FocusableProps,
  TextInputDOMEvents,
  ValueBase,
} from '@react-types/shared';
import { InputHTMLAttributes, LabelHTMLAttributes } from 'react';

import { FieldProps } from '@keystar/ui/field';

export type PasswordFieldType = 'password' | 'text';

export type PasswordFieldAria = {
  /** Props for the password field's visible label element, if any. */
  labelProps: LabelHTMLAttributes<HTMLLabelElement>;
  /** Props for the input element. */
  inputProps: InputHTMLAttributes<HTMLInputElement>;
  /** Props for the reveal button. */
  revealButtonProps: AriaButtonProps;
  /** Props for the password field's description element, if any. */
  descriptionProps: DOMAttributes;
  /** Props for the password field's error message element, if any. */
  errorMessageProps: DOMAttributes;
};

export type PasswordFieldState = {
  /** The current value of the password field. */
  readonly value: string;
  /** Sets the value of the password field. */
  setValue(value: string): void;
  /** The current type of the password field. */
  readonly secureTextEntry: boolean;
  /** Sets the type of the password field. */
  setSecureTextEntry(isSecure: boolean): void;
  /** Toggles the type of the password field. */
  toggleSecureTextEntry(): void;
};

export type PasswordFieldProps = {
  /**
   * The input [autocomplete](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete#values) type.
   * @default
   * "current-password"
   */
  autoComplete?: 'new-password' | 'current-password' | (string & {});
  /**
   * Allow users to reveal the input text. When true, a button is displayed
   * that toggles secure text entry.
   * @default true
   */
  allowTextReveal?: boolean;
} & ValueBase<string> &
  FieldProps &
  FocusableProps &
  TextInputDOMEvents;
