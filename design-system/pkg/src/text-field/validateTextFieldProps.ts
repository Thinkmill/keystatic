import { warning } from 'emery';

import { validateFieldProps } from '@keystar/ui/field';

import { TextFieldProps } from './types';

export function validateTextFieldProps<T extends TextFieldProps>(props: T): T {
  // warn if `placeholder` is used without a `description` present
  warning(
    !props.placeholder || !!props.description,
    'Placeholder text is not accessible. Use the `description` prop to provide information that will aid user input.'
  );

  return validateFieldProps(props);
}
