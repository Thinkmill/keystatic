import { Checkbox } from '@voussoir/checkbox';
import { Text } from '@voussoir/typography';
import { BasicFormField } from '../api';

export function checkbox({
  label,
  defaultValue = false,
  description,
}: {
  label: string;
  defaultValue?: boolean;
  description?: string;
}): BasicFormField<boolean> {
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
    defaultValue,
    validate(value) {
      return typeof value === 'boolean';
    },
  };
}
