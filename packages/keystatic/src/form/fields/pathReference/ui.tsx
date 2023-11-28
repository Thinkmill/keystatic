import { Combobox, Item } from '@keystar/ui/combobox';
import { filter } from 'minimatch';
import { useReducer, useMemo, useState, useEffect } from 'react';
import { useTree } from '../../../app/shell/data';
import { FormFieldInputProps } from '../../api';

export function PathReferenceInput(
  props: FormFieldInputProps<string | null> & {
    label: string;
    description: string | undefined;
    pattern: string | undefined;
    validation: { isRequired?: boolean } | undefined;
  }
) {
  const match = useMemo(
    () => (props.pattern ? filter(props.pattern) : () => true),
    [props.pattern]
  );

  const [blurred, onBlur] = useReducer(() => true, false);
  const tree = useTree().current;
  const options = useMemo(() => {
    const files = tree.kind === 'loaded' ? [...tree.data.entries.values()] : [];
    return files.filter(val => match(val.path));
  }, [tree, match]);

  const _errorMessage =
    (props.forceValidation || blurred) &&
    props.validation?.isRequired &&
    props.value === null
      ? `${props.label} is required`
      : undefined;
  // this state & effect shouldn't really exist
  // it's here because react-aria/stately calls onSelectionChange with null
  // after selecting an item if we immediately remove the error message
  // so we delay it with an effect
  const [errorMessage, setErrorMessage] = useState(_errorMessage);

  useEffect(() => {
    setErrorMessage(_errorMessage);
  }, [_errorMessage]);

  return (
    <Combobox
      label={props.label}
      description={props.description}
      selectedKey={props.value}
      onSelectionChange={key => {
        if (typeof key === 'string' || key === null) {
          props.onChange(key);
        }
      }}
      onBlur={onBlur}
      isRequired={props.validation?.isRequired}
      errorMessage={errorMessage}
      autoFocus={props.autoFocus}
      defaultItems={options}
      width="auto"
    >
      {item => <Item key={item.path}>{item.path}</Item>}
    </Combobox>
  );
}
