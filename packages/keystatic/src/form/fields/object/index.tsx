import { ComponentSchema, ObjectField } from '../../api';

export function object<Fields extends Record<string, ComponentSchema>>(
  fields: Fields
): ObjectField<Fields> {
  return { kind: 'object', fields };
}
