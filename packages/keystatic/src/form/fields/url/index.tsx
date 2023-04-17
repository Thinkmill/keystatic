import { isValidURL } from '../document/DocumentEditor/isValidURL';
import { BasicFormField } from '../../api';
import { FieldDataError } from '../error';
import {
  RequiredValidation,
  assertRequired,
  basicFormFieldWithSimpleReaderParse,
} from '../utils';
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
  string | null,
  string | (IsRequired extends true ? never : null)
> {
  return basicFormFieldWithSimpleReaderParse({
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
    defaultValue() {
      return defaultValue ?? null;
    },
    parse(value) {
      if (value === undefined) {
        return null;
      }
      if (typeof value !== 'string') {
        throw new FieldDataError('Must be a string');
      }
      return value;
    },
    validate(value) {
      const message = validateUrl(validation, value, label);
      if (message !== undefined) {
        throw new FieldDataError(message);
      }
      assertRequired(value, validation, label);
      return value;
    },
    serialize(value) {
      return { value: value === null ? undefined : value };
    },
  });
}
