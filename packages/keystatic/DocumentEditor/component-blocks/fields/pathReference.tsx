import { Item } from '@react-stately/collections';
import { Combobox } from '@voussoir/combobox';
import { filter } from 'minimatch';
import { useMemo, useReducer } from 'react';
import { useTree } from '../../../app/shell/data';
import { BasicFormField } from '../api';
import { RequiredValidation } from './utils';

export function pathReference<IsRequired extends boolean | undefined>({
  label,
  pattern,
  validation,
}: {
  label: string;
  pattern?: string;
  validation?: { isRequired?: IsRequired };
} & RequiredValidation<IsRequired>): BasicFormField<
  string | (IsRequired extends true ? never : null),
  undefined
> {
  const match = pattern ? filter(pattern) : () => true;
  return {
    kind: 'form',
    Input({ value, onChange, autoFocus, forceValidation }) {
      const [blurred, onBlur] = useReducer(() => true, false);
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
          onBlur={onBlur}
          errorMessage={
            (forceValidation || blurred) &&
            validation?.isRequired &&
            value === null
              ? `${label} is required`
              : undefined
          }
          autoFocus={autoFocus}
          defaultItems={options}
          width="auto"
        >
          {item => <Item key={item.path}>{item.path}</Item>}
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
