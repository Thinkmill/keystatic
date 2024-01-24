import { BasicFormField } from '../../api';
import { FieldDataError } from '../error';
import {
  RequiredValidation,
  assertRequired,
  basicFormFieldWithSimpleReaderParse,
} from '../utils';
import { RelationshipInput } from '#field-ui/relationship';

export function relationship<IsRequired extends boolean | undefined>({
  label,
  collection,
  validation,
  description,
}: {
  label: string;
  collection: string;
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
        <RelationshipInput
          label={label}
          collection={collection}
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
