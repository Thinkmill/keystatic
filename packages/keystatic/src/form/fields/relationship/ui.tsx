import { Item } from '@react-stately/collections';
import { Combobox } from '@keystar/ui/combobox';
import { useReducer, useMemo, useState, useEffect } from 'react';
import { useSlugsInCollection } from '../../../app/useSlugsInCollection';
import { FormFieldInputProps } from '../../api';

export function RelationshipInput(
  props: FormFieldInputProps<string | null> & {
    collection: string;
    validation: { isRequired?: boolean } | undefined;
    label: string;
    description: string | undefined;
  }
) {
  const [blurred, onBlur] = useReducer(() => true, false);
  const slugs = useSlugsInCollection(props.collection);
  const options = useMemo(() => {
    return slugs.map(slug => ({ slug }));
  }, [slugs]);

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
      autoFocus={props.autoFocus}
      defaultItems={options}
      isRequired={props.validation?.isRequired}
      errorMessage={errorMessage}
      width="auto"
    >
      {item => <Item key={item.slug}>{item.slug}</Item>}
    </Combobox>
  );
}
