import { Picker, Item } from '@keystar/ui/picker';
import { useFieldContext } from '../context';

export function SelectFieldInput<Value extends string>(props: {
  value: Value;
  onChange: (value: Value) => void;
  autoFocus?: boolean;
  label: string;
  description?: string;
  options: readonly { label: string; value: Value }[];
}) {
  let fieldContext = useFieldContext();

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
      width={{
        mobile: 'auto',
        tablet: fieldContext.span === 12 ? 'alias.singleLineWidth' : 'auto',
      }}
    >
      {item => <Item key={item.value}>{item.label}</Item>}
    </Picker>
  );
}
