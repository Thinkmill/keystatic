import { BasicFormField } from '../../api';
import { SelectFieldInput } from './ui';

export function select<Option extends { label: string; value: string }>({
  label,
  options,
  defaultValue,
  description,
}: {
  label: string;
  options: readonly Option[];
  defaultValue: Option['value'];
  description?: string;
}): BasicFormField<Option['value']> & { options: readonly Option[] } {
  const optionValuesSet = new Set(options.map(x => x.value));
  if (!optionValuesSet.has(defaultValue)) {
    throw new Error(
      `A defaultValue of ${defaultValue} was provided to a select field but it does not match the value of one of the options provided`
    );
  }
  return {
    kind: 'form',
    Input(props) {
      return (
        <SelectFieldInput
          label={label}
          options={options}
          description={description}
          {...props}
        />
      );
    },
    options,
    defaultValue,
    validate(value) {
      return typeof value === 'string' && optionValuesSet.has(value);
    },
  };
}
