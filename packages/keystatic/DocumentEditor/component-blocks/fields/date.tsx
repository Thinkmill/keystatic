import { TextField } from '@voussoir/text-field';
import { BasicFormField } from '../api';

export function date({
  label,
}: {
  label: string;
}): BasicFormField<string | null, undefined> {
  return {
    kind: 'form',
    Input({ value, onChange, autoFocus }) {
      return (
        <TextField
          label={label}
          type="date"
          onChange={val => {
            onChange(val === '' ? null : val);
          }}
          autoFocus={autoFocus}
          value={value === null ? '' : value}
        />
      );
    },
    options: undefined,
    defaultValue: null,
    validate(value) {
      return (
        value === null ||
        (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value))
      );
    },
  };
}
