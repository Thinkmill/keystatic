import { Field, FieldProps } from '@keystar/ui/field';
import { FormFieldInputProps } from '../../api';
import { EditorState } from 'prosemirror-state';
import { Editor } from './editor';
import { createEditorState } from './editor/editor-state';
import { EditorSchema } from './editor/schema';
import { markdocToProseMirror } from './editor/markdoc/parse';
import Markdoc from '@markdoc/markdoc';
import { proseMirrorToMarkdoc } from './editor/markdoc/serialize';
import { useEntryLayoutSplitPaneContext } from '../../../app/entry-form';

export { createEditorSchema } from './editor/schema';

export function getDefaultValue(schema: EditorSchema) {
  return createEditorState(schema.nodes.doc.createAndFill()!);
}

const textDecoder = new TextDecoder();
const textEncoder = new TextEncoder();

export function parseToEditorState(
  content: Uint8Array | undefined,
  schema: EditorSchema,
  files: ReadonlyMap<string, Uint8Array>
) {
  const markdoc = textDecoder.decode(content);
  const doc = markdocToProseMirror(Markdoc.parse(markdoc), schema, files);
  return createEditorState(doc);
}

export function serializeFromEditorState(value: EditorState) {
  const extraFiles = new Map<string, Uint8Array>();
  const markdocNode = proseMirrorToMarkdoc(value.doc, extraFiles);
  const markdoc = Markdoc.format(markdocNode);
  return {
    content: textEncoder.encode(Markdoc.format(Markdoc.parse(markdoc))),
    other: extraFiles,
  };
}
export function DocumentFieldInput(
  props: FormFieldInputProps<EditorState> & {
    label: string;
    description: string | undefined;
  }
) {
  let entryLayoutPane = useEntryLayoutSplitPaneContext();

  let fieldProps: FieldProps = {
    label: props.label,
    description: props.description,
  };
  if (entryLayoutPane === 'main') {
    fieldProps = {
      'aria-label': props.label,
    };
  }

  return (
    <Field
      height={entryLayoutPane === 'main' ? '100%' : undefined}
      {...fieldProps}
    >
      {inputProps => (
        <Editor {...inputProps} value={props.value} onChange={props.onChange} />
      )}
    </Field>
  );
}
