import { Item } from '@react-stately/collections';
import { Picker } from '@voussoir/picker';
import { BasicFormField } from '../api';

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
}): BasicFormField<Option['value'], readonly Option[]> {
  const optionValuesSet = new Set(options.map(x => x.value));
  if (!optionValuesSet.has(defaultValue)) {
    throw new Error(
      `A defaultValue of ${defaultValue} was provided to a select field but it does not match the value of one of the options provided`
    );
  }
  return {
    kind: 'form',
    Input({ value, onChange, autoFocus }) {
      return (
        <Picker
          label={label}
          description={description}
          items={options}
          selectedKey={value}
          onSelectionChange={key => {
            onChange(key as Option['value']);
          }}
          autoFocus={autoFocus}
        >
          {item => <Item key={item.value}>{item.label}</Item>}
        </Picker>
      );
    },
    options,
    defaultValue,
    validate(value) {
      return typeof value === 'string' && optionValuesSet.has(value);
    },
  };
}
