import { warning } from 'emery';

import { TextFieldProps } from './types';

export function validateTextFieldProps<T extends TextFieldProps>(props: T): T {
  // warn if `placeholder` is used without a `description` present
  warning(
    !props.placeholder || !!props.description,
    'Placeholder text is not accessible. Use the `description` prop to provide information that will aid user input.'
  );

  // add `validationState` when `errorMessage` is provided. used by
  // "@react-aria/*" hooks to determine aria attributes.
  if ('errorMessage' in props) {
    return Object.assign({}, { validationState: 'invalid' as const }, props);
  }

  return props;
}
