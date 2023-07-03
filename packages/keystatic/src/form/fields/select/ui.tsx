'use client';

import { Picker, Item } from '@keystar/ui/picker';

export function SelectFieldInput<Value extends string>(props: {
  value: Value;
  onChange: (value: Value) => void;
  autoFocus?: boolean;
  label: string;
  description?: string;
  options: readonly { label: string; value: Value }[];
}) {
  return (
    <Picker
      label={props.label}
      description={props.description}
      items={props.options}
      selectedKey={props.value}
      onSelectionChange={key => {
        props.onChange(key as Value);
      }}
      autoFocus={props.autoFocus}
    >
      {item => <Item key={item.value}>{item.label}</Item>}
    </Picker>
  );
}
