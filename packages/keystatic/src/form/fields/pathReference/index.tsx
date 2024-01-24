import { BasicFormField } from '../../api';
import { FieldDataError } from '../error';
import {
  RequiredValidation,
  assertRequired,
  basicFormFieldWithSimpleReaderParse,
} from '../utils';
import { PathReferenceInput } from '#field-ui/pathReference';

export function pathReference<IsRequired extends boolean | undefined>({
  label,
  pattern,
  validation,
  description,
}: {
  label: string;
  pattern?: string;
  validation?: { isRequired?: IsRequired };
  description?: string;
} & RequiredValidation<IsRequired>): BasicFormField<
  string | null,
  string | (IsRequired extends true ? never : null)
> {
  return basicFormFieldWithSimpleReaderParse({
    label,
    Input(props) {
      return (
        <PathReferenceInput
          label={label}
          pattern={pattern}
          description={description}
          validation={validation}
          {...props}
        />
      );
    },
    defaultValue() {
      return null;
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
      assertRequired(value, validation, label);
      return value;
    },
    serialize(value) {
      return { value: value === null ? undefined : value };
    },
  });
}
