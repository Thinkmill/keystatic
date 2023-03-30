import { BasicFormField } from '../api';

export function empty(): BasicFormField<null> {
  return {
    kind: 'form',
    Input() {
      return null;
    },
    defaultValue: null,
    validate(value) {
      return value === null || value === undefined;
    },
  };
}
