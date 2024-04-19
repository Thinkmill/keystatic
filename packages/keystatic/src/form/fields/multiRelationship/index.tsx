import { BasicFormField } from '../../api';
import { FieldDataError } from '../error';
import { basicFormFieldWithSimpleReaderParse } from '../utils';
import { MultiRelationshipInput } from '#field-ui/multiRelationship';
import { isString } from 'emery';
import { validateMultiRelationshipLength } from './validate';

export function multiRelationship({
  label,
  collection,
  validation,
  description,
}: {
  label: string;
  collection: string;
  validation?: { length?: { min?: number; max?: number } };
  description?: string;
}): BasicFormField<string[]> {
  return basicFormFieldWithSimpleReaderParse({
    label,
    Input(props) {
      return (
        <MultiRelationshipInput
          label={label}
          collection={collection}
          description={description}
          validation={validation}
          {...props}
        />
      );
    },
    defaultValue() {
      return [];
    },
    parse(value) {
      if (value === undefined) {
        return [];
      }
      if (!Array.isArray(value) || !value.every(isString)) {
        throw new FieldDataError('Must be an array of strings');
      }
      return value;
    },
    validate(value) {
      const error = validateMultiRelationshipLength(validation, value);
      if (error) {
        throw new FieldDataError(error);
      }
      return value;
    },
    serialize(value) {
      return { value };
    },
  });
}
