import { BasicFormField } from '../../api';
import { MultiselectFieldInput } from './ui';

export function multiselect<Option extends { label: string; value: string }>({
  label,
  options,
  defaultValue = [],
  description,
}: {
  label: string;
  options: readonly Option[];
  defaultValue?: readonly Option['value'][];
  description?: string;
}): BasicFormField<readonly Option['value'][]> & {
  options: readonly Option[];
} {
  const valuesToOption = new Map(options.map(x => [x.value, x]));
  return {
    kind: 'form',
    Input(props) {
      return (
        <MultiselectFieldInput
          label={label}
          description={description}
          options={options}
          {...props}
        />
      );
    },
    options,
    defaultValue,
    validate(value) {
      return (
        Array.isArray(value) &&
        value.every(
          value => typeof value === 'string' && valuesToOption.has(value)
        )
      );
    },
  };
}
