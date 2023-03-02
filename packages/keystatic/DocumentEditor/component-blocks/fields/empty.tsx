import { BasicFormField } from '../api';

export function empty(): BasicFormField<null, undefined> {
  return {
    kind: 'form',
    Input() {
      return null;
    },
    options: undefined,
    defaultValue: null,
    validate(value) {
      return value === null || value === undefined;
    },
  };
}
