import { FieldProps } from './types';

/**
 * Add `validationState` when `errorMessage` is provided. Used by
 * "@react-aria/*" hooks to determine aria attributes.
 */
export function validateFieldProps<T extends FieldProps>(props: T): T {
  if (props.errorMessage) {
    return Object.assign({}, { validationState: 'invalid' as const }, props);
  }

  return props;
}
