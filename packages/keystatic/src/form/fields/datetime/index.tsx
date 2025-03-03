import { BasicFormField } from '../../api';
import { FieldDataError } from '../error';
import {
  RequiredValidation,
  assertRequired,
  basicFormFieldWithSimpleReaderParse,
} from '../utils';
import { DatetimeFieldInput } from '#field-ui/datetime';
import { validateDatetime } from './validateDatetime';

export function datetime<IsRequired extends boolean | undefined>({
  label,
  defaultValue,
  validation,
  description,
}: {
  label: string;
  defaultValue?: string | { kind: 'now' };
  validation?: { isRequired?: IsRequired; min?: string; max?: string };
  description?: string;
} & RequiredValidation<IsRequired>): BasicFormField<
  string | null,
  string | (IsRequired extends true ? never : null)
> {
  return basicFormFieldWithSimpleReaderParse({
    label,
    Input(props) {
      return (
        <DatetimeFieldInput
          validation={validation}
          label={label}
          description={description}
          {...props}
        />
      );
    },
    defaultValue() {
      if (defaultValue === undefined) {
        return null;
      }
      if (typeof defaultValue === 'string') {
        return new Date(defaultValue).toISOString();
      }
      if (defaultValue.kind === 'now') {
        return new Date().toISOString();
      }
      return null;
    },
    parse(value) {
      if (value === undefined) {
        return null;
      }
      if (value instanceof Date) {
        return value.toISOString();
      }
      if (typeof value !== 'string') {
        throw new FieldDataError('Must be a string or date');
      }
      return new Date(value).toISOString();
    },
    serialize(value) {
      if (value === null) return { value: undefined };
      return { value: new Date(value).toISOString() };
    },
    validate(value) {
      const message = validateDatetime(validation, value, label);
      if (message !== undefined) {
        throw new FieldDataError(message);
      }
      assertRequired(value, validation, label);
      return value;
    },
  });
}
