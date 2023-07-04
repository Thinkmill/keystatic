'use client';
import { FieldPrimitive } from '@keystar/ui/field';
import { DocumentEditor } from './DocumentEditor';
import {
  ComponentBlock,
  DocumentElement,
  FormFieldInputProps,
} from '../../api';
import { DocumentFeatures } from './DocumentEditor/document-features';
import { useState } from 'react';

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

  return (
    <FieldPrimitive label={props.label} description={props.description}>
      <DocumentEditor
        key={state.key}
        componentBlocks={props.componentBlocks}
        documentFeatures={props.documentFeatures}
        onChange={val => {
          setState(state => ({ key: state.key, value: val as any }));
          props.onChange(val as any);
        }}
        value={state.value as any}
      />
    </FieldPrimitive>
  );
}
