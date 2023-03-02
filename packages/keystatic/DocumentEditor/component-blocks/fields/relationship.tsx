import { Item } from '@react-stately/collections';
import { Combobox } from '@voussoir/combobox';
import { useMemo, useReducer } from 'react';
import { useSlugsInCollection } from '../../../app/useSlugsInCollection';
import { BasicFormField } from '../api';
import { RequiredValidation } from './utils';

export function relationship<IsRequired extends boolean | undefined>({
  label,
  collection,
  validation,
}: {
  label: string;
  collection: string;
  validation?: { isRequired?: IsRequired };
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
      return (
        <Combobox
          label={label}
          selectedKey={value}
          onSelectionChange={key => {
            if (typeof key === 'string' || key === null) {
              onChange(key);
            }
          }}
          onBlur={onBlur}
          autoFocus={autoFocus}
          defaultItems={options}
          errorMessage={
            (forceValidation || blurred) &&
            validation?.isRequired &&
            value === null
              ? `${label} is required`
              : undefined
          }
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
