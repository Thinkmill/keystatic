import Markdoc, {
  Config as MarkdocConfig,
  Node as MarkdocNode,
} from '@markdoc/markdoc';

import { ContentFormField } from '../../api';
import { DocumentFieldInput } from './ui';
import { EditorState } from 'prosemirror-state';
import { createEditorState } from './editor/editor-state';
import { EditorSchema, createEditorSchema } from './editor/schema';
import { proseMirrorToMarkdoc } from './editor/markdoc/serialize';
import { markdocToProseMirror } from './editor/markdoc/parse';

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

/**
 * @deprecated This is experimental and buggy, use at your own risk.
 */
export function __experimental_markdoc_field({
  label,
  description,
  config,
}: {
  label: string;
  description?: string;
  config: MarkdocConfig;
}): __experimental_markdoc_field.Field {
  let schema: undefined | EditorSchema;
  let getSchema = () => {
    if (!schema) {
      schema = createEditorSchema(config);
    }
    return schema;
  };
  return {
    kind: 'form',
    formKind: 'content',
    defaultValue() {
      return createEditorState(getSchema().nodes.doc.createAndFill()!);
    },
    Input(props) {
      return (
        <DocumentFieldInput
          description={description}
          label={label}
          {...props}
        />
      );
    },

    parse: (_, { content }) => {
      const markdoc = textDecoder.decode(content);
      const doc = markdocToProseMirror(Markdoc.parse(markdoc), getSchema());
      return createEditorState(doc);
    },
    contentExtension: '.mdoc',
    validate(value) {
      return value;
    },
    serialize(value) {
      const markdocNode = proseMirrorToMarkdoc(value.doc);
      const markdoc = Markdoc.format(markdocNode);
      return {
        content: textEncoder.encode(Markdoc.format(Markdoc.parse(markdoc))),
        external: new Map(),
        other: new Map(),
        value: undefined,
      };
    },
    reader: {
      parse: (_, { content }) => {
        const text = textDecoder.decode(content);
        return { ast: Markdoc.parse(text) };
      },
    },
  };
}

export declare namespace __experimental_markdoc_field {
  type Field = ContentFormField<EditorState, EditorState, { ast: MarkdocNode }>;
}
