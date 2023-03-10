import { Item } from '@react-stately/collections';
import { Combobox } from '@voussoir/combobox';
import { useEffect, useMemo, useReducer, useState } from 'react';
import { useSlugsInCollection } from '../../../app/useSlugsInCollection';
import { BasicFormField } from '../api';
import { RequiredValidation } from './utils';

export function relationship<IsRequired extends boolean | undefined>({
  label,
  collection,
  validation,
  description,
}: {
  label: string;
  collection: string;
  validation?: { isRequired?: IsRequired };
  description?: string;
} & RequiredValidation<IsRequired>): BasicFormField<
  string | (IsRequired extends true ? never : null),
  undefined
> {
  return {
    kind: 'form',
    Input({ value, onChange, autoFocus, forceValidation }) {
      const [blurred, onBlur] = useReducer(() => true, false);
      const slugs = useSlugsInCollection(collection);
      const options = useMemo(() => {
        return slugs.map(slug => ({ slug }));
      }, [slugs]);

      const _errorMessage =
        (forceValidation || blurred) && validation?.isRequired && value === null
          ? `${label} is required`
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
          label={label}
          description={description}
          selectedKey={value}
          onSelectionChange={key => {
            if (typeof key === 'string' || key === null) {
              onChange(key);
            }
          }}
          onBlur={onBlur}
          autoFocus={autoFocus}
          defaultItems={options}
          errorMessage={errorMessage}
          width="auto"
        >
          {item => <Item key={item.slug}>{item.slug}</Item>}
        </Combobox>
      );
    },
    options: undefined,
    defaultValue: null as any,
    validate: val =>
      typeof val === 'string' ||
      (validation?.isRequired ? false : val === null),
  };
}
