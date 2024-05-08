import { Field, FieldProps } from '@keystar/ui/field';
import { useState } from 'react';

import {
  ComponentBlock,
  DocumentElement,
  FormFieldInputProps,
} from '../../api';
import { useEntryLayoutSplitPaneContext } from '../../../app/entry-form';
import { DocumentEditor, Editor } from './DocumentEditor';
import { DocumentFeatures } from './DocumentEditor/document-features';
import { createDocumentEditorForNormalization } from './DocumentEditor/create-editor';
import type { Descendant } from 'slate';
import { format, parse } from '#markdoc';
import { toMarkdocDocument } from './markdoc/to-markdoc';

let i = 0;

function newKey() {
  return i++;
}

const encoder = new TextEncoder();

export function serializeMarkdoc(
  value: DocumentElement[],
  opts: { slug: string | undefined },
  componentBlocks: Record<string, ComponentBlock>,
  documentFeatures: DocumentFeatures
) {
  const { extraFiles, node } = toMarkdocDocument(value as any as Descendant[], {
    componentBlocks,
    documentFeatures,
    slug: opts.slug,
  });

  const other = new Map<string, Uint8Array>();
  const external = new Map<string, Map<string, Uint8Array>>();
  for (const file of extraFiles) {
    if (file.parent === undefined) {
      other.set(file.path, file.contents);
      continue;
    }
    if (!external.has(file.parent)) {
      external.set(file.parent, new Map());
    }
    external.get(file.parent)!.set(file.path, file.contents);
  }

  return {
    content: encoder.encode(format(parse(format(node)))),
    other,
    external,
    value: undefined,
  };
}

export function normalizeDocumentFieldChildren(
  documentFeatures: DocumentFeatures,
  componentBlocks: Record<string, ComponentBlock>,
  document: Descendant[]
) {
  const editor = createDocumentEditorForNormalization(
    documentFeatures,
    componentBlocks
  );
  editor.children = document;
  Editor.normalize(editor, { force: true });
  return editor.children;
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
