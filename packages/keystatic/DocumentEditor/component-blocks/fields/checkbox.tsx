import { Checkbox } from '@voussoir/checkbox';
import { BasicFormField } from '../../../dist/keystatic-core.cjs';

export function checkbox({
  label,
  defaultValue = false,
}: {
  label: string;
  defaultValue?: boolean;
}): BasicFormField<boolean, undefined> {
  return {
    kind: 'form',
    Input({ value, onChange, autoFocus }) {
      return (
        <Checkbox isSelected={value} onChange={onChange} autoFocus={autoFocus}>
          {label}
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
