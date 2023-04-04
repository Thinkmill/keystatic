import { BasicFormField } from '../../api';
import { RequiredValidation } from '../utils';
import { RelationshipInput } from './ui';

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
  string | (IsRequired extends true ? never : null)
> {
  return {
    kind: 'form',
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
    defaultValue: null as any,
    validate: val =>
      typeof val === 'string' ||
      (validation?.isRequired ? false : val === null),
  };
}
