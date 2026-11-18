import { NumberField } from '@keystar/ui/number-field';
import { useReducer } from 'react';
import { validateInteger } from './validateInteger';
import { FormFieldInputProps } from '../../api';
import { useLocalizedString } from '../../../app/shell/i18n';

export function IntegerFieldInput(
  props: FormFieldInputProps<number | null> & {
    label: string;
    description: string | undefined;
    validation:
      | { isRequired?: boolean; min?: number; max?: number }
      | undefined;
  }
) {
  const [blurred, onBlur] = useReducer(() => true, false);
  const stringFormatter = useLocalizedString();

  return (
    <NumberField
      label={props.label}
      description={props.description}
      isRequired={props.validation?.isRequired}
      errorMessage={
        props.forceValidation || blurred
          ? validateInteger(
              props.validation,
              props.value,
              props.label,
              stringFormatter
            )
          : undefined
      }
      onBlur={onBlur}
      autoFocus={props.autoFocus}
      value={props.value === null ? undefined : props.value}
      onChange={val => {
        props.onChange((val === undefined ? null : val) as any);
      }}
    />
  );
}
