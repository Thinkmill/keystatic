import { TextFieldProps } from '@voussoir/text-field';

export type SearchFieldProps = {
  /** Handler that is called when the field is submitted. */
  onSubmit?: (value: string) => void;
  /** Handler that is called when the clear button is pressed. */
  onClear?: () => void;
} & Omit<TextFieldProps, 'pattern' | 'type'>;
