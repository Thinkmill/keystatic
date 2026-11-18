import { NumberField } from '@keystar/ui/number-field';
import { useReducer } from 'react';
import { validateNumber } from './validateNumber';
import { FormFieldInputProps } from '../../api';

// NumberField round-trips the committed value through its formatter, and
// Intl.NumberFormat defaults to `maximumFractionDigits: 3`, which would
// silently round stored values (e.g. 51.98771 -> 51.988). 20 is the largest
// value every supported engine accepts, and engines format the shortest
// round-trip representation, so 0.1 still displays as "0.1". Precision is
// then limited only by `step` (if given), not by display formatting.
// Hoisted so the object identity is stable across renders.
const formatOptions: Intl.NumberFormatOptions = { maximumFractionDigits: 20 };

export function NumberFieldInput(
  props: FormFieldInputProps<number | null> & {
    label: string;
    description: string | undefined;
    step: number | undefined;
    validation:
      | { isRequired?: boolean; min?: number; max?: number; step?: boolean }
      | undefined;
  }
) {
  const [blurred, onBlur] = useReducer(() => true, false);

  return (
    <NumberField
      label={props.label}
      description={props.description}
      isRequired={props.validation?.isRequired}
      errorMessage={
        props.forceValidation || blurred
          ? validateNumber(
              props.validation,
              props.value,
              props.step,
              props.label
            )
          : undefined
      }
      onBlur={onBlur}
      autoFocus={props.autoFocus}
      step={props.step}
      formatOptions={formatOptions}
      value={props.value === null ? undefined : props.value}
      onChange={val => {
        props.onChange((val === undefined ? null : val) as any);
      }}
    />
  );
}
