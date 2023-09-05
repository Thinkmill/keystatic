import { FieldPrimitive } from '@keystar/ui/field';
import { FormFieldInputProps } from '../../api';
import { EditorState } from 'prosemirror-state';
import { Editor } from './editor';
import { createEditorState } from './editor/editor-state';
import { EditorSchema } from './editor/schema';
import { markdocToProseMirror } from './editor/markdoc/parse';
import Markdoc from '@markdoc/markdoc';
import { proseMirrorToMarkdoc } from './editor/markdoc/serialize';

export { createEditorSchema } from './editor/schema';

export function getDefaultValue(schema: EditorSchema) {
  return createEditorState(schema.nodes.doc.createAndFill()!);
}

const textDecoder = new TextDecoder();
const textEncoder = new TextEncoder();

export function parseToEditorState(
  content: Uint8Array | undefined,
  schema: EditorSchema
) {
  const markdoc = textDecoder.decode(content);
  const doc = markdocToProseMirror(Markdoc.parse(markdoc), schema);
  return createEditorState(doc);
}

export function serializeFromEditorState(value: EditorState) {
  const markdocNode = proseMirrorToMarkdoc(value.doc);
  const markdoc = Markdoc.format(markdocNode);
  return textEncoder.encode(Markdoc.format(Markdoc.parse(markdoc)));
}
export function DocumentFieldInput(
  props: FormFieldInputProps<EditorState> & {
    label: string;
    description: string | undefined;
  }
) {
  return (
    <FieldPrimitive label={props.label} description={props.description}>
      <Editor value={props.value} onChange={props.onChange} />
    </FieldPrimitive>
  );
}
