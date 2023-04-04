import { BasicFormField } from '../../api';
import { RequiredValidation } from '../utils';
import { PathReferenceInput } from './ui';

export function pathReference<IsRequired extends boolean | undefined>({
  label,
  pattern,
  validation,
  description,
}: {
  label: string;
  pattern?: string;
  validation?: { isRequired?: IsRequired };
  description?: string;
} & RequiredValidation<IsRequired>): BasicFormField<
  string | (IsRequired extends true ? never : null)
> {
  return {
    kind: 'form',
    Input(props) {
      return (
        <PathReferenceInput
          label={label}
          pattern={pattern}
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
