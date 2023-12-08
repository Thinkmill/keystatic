import { Field, FieldProps } from '@keystar/ui/field';
import { useState } from 'react';

import {
  ComponentBlock,
  DocumentElement,
  FormFieldInputProps,
} from '../../api';
import { useEntryLayoutSplitPaneContext } from '../../../app/entry-form';
import { DocumentEditor } from './DocumentEditor';
import { DocumentFeatures } from './DocumentEditor/document-features';

let i = 0;

function newKey() {
  return i++;
}

export function DocumentFieldInput(
  props: FormFieldInputProps<DocumentElement[]> & {
    label: string;
    description: string | undefined;
    componentBlocks: Record<string, ComponentBlock>;
    documentFeatures: DocumentFeatures;
  }
) {
  let entryLayoutPane = useEntryLayoutSplitPaneContext();
  const [state, setState] = useState<{
    key: number;
    value: (typeof props)['value'];
  }>(() => ({
    key: newKey(),
    value: props.value,
  }));

  if (state.value !== props.value) {
    setState({ key: newKey(), value: props.value });
  }

  let fieldProps: FieldProps = {
    label: props.label,
    labelElementType: 'span', // the editor element isn't an input, so we need to use a span for the label
    description: props.description,
  };
  if (entryLayoutPane === 'main') {
    fieldProps = {
      'aria-label': props.label,
      // `aria-description` is still in W3C Editor's Draft for ARIA 1.3.
    };
  }

  return (
    <Field
      height={entryLayoutPane === 'main' ? '100%' : undefined}
      {...fieldProps}
    >
      {inputProps => (
        <DocumentEditor
          {...inputProps}
          key={state.key}
          componentBlocks={props.componentBlocks}
          documentFeatures={props.documentFeatures}
          onChange={val => {
            setState(state => ({ key: state.key, value: val as any }));
            props.onChange(val as any);
          }}
          value={state.value as any}
        />
      )}
    </Field>
  );
}
