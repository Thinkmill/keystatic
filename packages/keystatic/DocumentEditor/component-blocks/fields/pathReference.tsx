import { Item } from '@react-stately/collections';
import { Combobox } from '@voussoir/combobox';
import { filter } from 'minimatch';
import { useMemo } from 'react';
import { useTree } from '../../../app/shell/data';
import { BasicFormField } from '../api';

export function pathReference({
  label,
  pattern,
}: {
  label: string;
  pattern?: string;
}): BasicFormField<string | null, undefined> {
  const match = pattern ? filter(pattern) : () => true;
  return {
    kind: 'form',
    Input({ value, onChange, autoFocus }) {
      const tree = useTree().current;
      const options = useMemo(() => {
        const files =
          tree.kind === 'loaded' ? [...tree.data.entries.values()] : [];
        return files.filter(val => match(val.path));
      }, [tree]);
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
          {item => <Item key={item.path}>{item.path}</Item>}
        </Combobox>
      );
    },
    options: undefined,
    defaultValue: null,
    validate: val => typeof val === 'string' || val === null,
  };
}
