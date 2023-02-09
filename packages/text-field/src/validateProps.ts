import { warning } from 'emery';

import { TextFieldProps } from './types';

export function validateProps(props: TextFieldProps) {
  warning(
    !props.placeholder,
    'Placeholder text is not accessible. Use the `description` prop to provide information that will aid user input.'
  );
}
