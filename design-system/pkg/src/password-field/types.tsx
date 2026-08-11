import { TextFieldProps } from '@keystar/ui/text-field';

export type PasswordFieldType = 'password' | 'text';

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
} & Omit<TextFieldProps, 'endElement' | 'startElement' | 'type'>;
