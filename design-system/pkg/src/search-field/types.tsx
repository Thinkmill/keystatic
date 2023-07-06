import { TextFieldProps } from '@keystar/ui/text-field';

export type SearchFieldProps = {
  /** Handler that is called when the field is submitted. */
  onSubmit?: (value: string) => void;
  /** Handler that is called when the clear button is pressed. */
  onClear?: () => void;
  /**
   * Whether to show the magnifying glass icon.
   * @default: true
   * */
  showIcon?: boolean;
} & Omit<TextFieldProps, 'pattern' | 'type'>;
