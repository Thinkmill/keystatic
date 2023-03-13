import { Checkbox } from '@voussoir/checkbox';
import { Text } from '@voussoir/typography';
import { BasicFormField } from '../../../dist/keystatic-core.cjs';

export function checkbox({
  label,
  defaultValue = false,
  description,
}: {
  label: string;
  defaultValue?: boolean;
  description?: string;
}): BasicFormField<boolean, undefined> {
  return {
    kind: 'form',
    Input({ value, onChange, autoFocus }) {
      return (
        <Checkbox isSelected={value} onChange={onChange} autoFocus={autoFocus}>
          <Text>{label}</Text>
          {description && <Text slot="description">{description}</Text>}
        </Checkbox>
      );
    },
    options: undefined,
    defaultValue,
    validate(value) {
      return typeof value === 'boolean';
    },
  };
}
