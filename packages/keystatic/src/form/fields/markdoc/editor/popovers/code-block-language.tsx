import { Item } from '@react-stately/collections';
import { Combobox } from '@keystar/ui/combobox';
import { matchSorter } from 'match-sorter';
import { useMemo, useState } from 'react';
import {
  aliasesToCanonicalName,
  canonicalNameToLabel,
  labelToCanonicalName,
  languagesWithAliases,
  aliasesToLabel,
} from '../../../document/DocumentEditor/code-block/languages';

export function CodeBlockLanguageCombobox(props: {
  value: string;
  onChange: (value: string) => void;
}) {
  const labelForVal = props.value
    ? aliasesToLabel.get(props.value) ?? props.value
    : 'Plain text';
  const [inputValue, setInputValue] = useState(labelForVal);
  const [isFocused, setIsFocused] = useState(false);
  if (!isFocused && labelForVal !== inputValue) {
    setInputValue(labelForVal);
  }
  return (
    <Combobox
      aria-label="Language"
      width="scale.2000"
      allowsCustomValue // allow consumers to support other languages
      inputValue={inputValue}
      onInputChange={setInputValue}
      onFocus={() => {
        setIsFocused(true);
      }}
      onBlur={() => {
        setIsFocused(false);
      }}
      onSelectionChange={selection => {
        if (aliasesToCanonicalName.has(inputValue)) {
          selection = aliasesToCanonicalName.get(inputValue)!;
        }
        if (selection === null) {
          props.onChange(inputValue === '' ? 'plain' : inputValue);
        } else if (typeof selection === 'string') {
          props.onChange(selection);
          const label = canonicalNameToLabel.get(selection);
          if (label) {
            setInputValue(label);
          }
        }
      }}
      selectedKey={
        props.value ? aliasesToCanonicalName.get(props.value) ?? null : 'plain'
      }
      items={useMemo(
        () =>
          labelToCanonicalName.has(inputValue)
            ? languagesWithAliases
            : matchSorter(languagesWithAliases, inputValue, {
                keys: ['label', 'value', 'aliases'],
              }),
        [inputValue]
      )}
    >
      {item => <Item key={item.value}>{item.label}</Item>}
    </Combobox>
  );
}
