import { validateFieldProps } from '@keystar/ui/field';

import { TextFieldProps } from './types';

export function validateTextFieldProps<T extends TextFieldProps>(props: T): T {
  return validateFieldProps(props);
}
