import { isValidURL } from '../../../isValidURL';
import { BasicFormField } from '../../api';
import { RequiredValidation } from '../utils';
import { UrlFieldInput } from './ui';

export function validateUrl(
  validation: { isRequired?: boolean } | undefined,
  value: unknown,
  label: string
) {
  if (value !== null && (typeof value !== 'string' || !isValidURL(value))) {
    return `${label} is not a valid URL`;
  }

  if (validation?.isRequired && value === null) {
    return `${label} is required`;
  }
}

export function url<IsRequired extends boolean | undefined>({
  label,
  defaultValue = '',
  validation,
  description,
}: {
  label: string;
  defaultValue?: string;
  validation?: { isRequired?: IsRequired };
  description?: string;
} & RequiredValidation<IsRequired>): BasicFormField<
  string | (IsRequired extends true ? never : null)
> {
  return {
    kind: 'form',
    Input(props) {
      return (
        <UrlFieldInput
          label={label}
          description={description}
          validation={validation}
          {...props}
        />
      );
    },
    defaultValue,
    validate(val) {
      return validateUrl(validation, val, label) === undefined;
    },
  };
}
