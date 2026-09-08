import { FieldProps, validateFieldProps } from '@keystar/ui/field';

export function validateTextFieldProps<T extends FieldProps>(props: T): T {
  return validateFieldProps(props);
}
