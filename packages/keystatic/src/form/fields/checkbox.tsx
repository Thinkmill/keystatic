import { Checkbox } from '@keystar-ui/checkbox';
import { Text } from '@keystar-ui/typography';
import { BasicFormField } from '../api';
import { FieldDataError } from './error';
import { basicFormFieldWithSimpleReaderParse } from './utils';

export function checkbox({
  label,
  defaultValue = false,
  description,
}: {
  label: string;
  defaultValue?: boolean;
  description?: string;
}): BasicFormField<boolean> {
  return basicFormFieldWithSimpleReaderParse({
    Input({ value, onChange, autoFocus }) {
      return (
        <Checkbox isSelected={value} onChange={onChange} autoFocus={autoFocus}>
          <Text>{label}</Text>
          {description && <Text slot="description">{description}</Text>}
        </Checkbox>
      );
    },
    defaultValue() {
      return defaultValue;
    },
    parse(value) {
      if (value === undefined) return defaultValue;
      if (typeof value !== 'boolean') {
        throw new FieldDataError('Must be a boolean');
      }
      return value;
    },
    validate(value) {
      return value;
    },
    serialize(value) {
      return { value };
    },
  });
}
