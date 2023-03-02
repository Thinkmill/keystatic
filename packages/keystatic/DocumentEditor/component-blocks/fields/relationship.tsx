import { Item } from '@react-stately/collections';
import { Combobox } from '@voussoir/combobox';
import { useMemo } from 'react';
import { useSlugsInCollection } from '../../../app/useSlugsInCollection';
import { BasicFormField } from '../api';

export function relationship({
  label,
  collection,
}: {
  label: string;
  collection: string;
}): BasicFormField<string | null, undefined> {
  return {
    kind: 'form',
    Input({ value, onChange, autoFocus }) {
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
          autoFocus={autoFocus}
          defaultItems={options}
          width="auto"
        >
          {item => <Item key={item.slug}>{item.slug}</Item>}
        </Combobox>
      );
    },
    options: undefined,
    defaultValue: null,
    validate: val => typeof val === 'string' || val === null,
  };
}
