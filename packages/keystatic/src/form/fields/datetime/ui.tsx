//ui.tsx

import { TextField } from '@keystar/ui/text-field';
import { useReducer } from 'react';
import { validateDatetime } from './validateDatetime';
import { FormFieldInputProps } from '../../api';
import { useLocalizedString } from '../../../app/shell/i18n';

export function DatetimeFieldInput(
  props: FormFieldInputProps<string | null> & {
    label: string;
    description?: string;
    validation?: { isRequired?: boolean; min?: string; max?: string };
  }
) {
  const [blurred, onBlur] = useReducer(() => true, false);
  const stringFormatter = useLocalizedString();

  return (
    <TextField
      label={props.label}
      description={props.description}
      type="datetime-local"
      onChange={val => {
        props.onChange(val === '' ? null : val);
      }}
      autoFocus={props.autoFocus}
      value={props.value === null ? '' : props.value}
      onBlur={onBlur}
      isRequired={props.validation?.isRequired}
      errorMessage={
        blurred || props.forceValidation
          ? validateDatetime(
              props.validation,
              props.value,
              props.label,
              stringFormatter
            )
          : undefined
      }
    />
  );
}
