import Markdoc, {
  Config as MarkdocConfig,
  Node as MarkdocNode,
} from '@markdoc/markdoc';

import { ContentFormField } from '../../api';
import { DocumentFieldInput } from './ui';
import { EditorSchema, createEditorSchema } from './editor/schema';
import { syntaxOnlyMarkdocValidate } from './utils';

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
      return '';
    },
    Input(props) {
      return (
        <DocumentFieldInput
          description={description}
          label={label}
          editorSchema={getSchema()}
          {...props}
        />
      );
    },

    parse: (_, { content }) => {
      const text = textDecoder.decode(content);
      const parsed = Markdoc.parse(text);
      for (const node of parsed.walk()) {
        if (node.type === 'em' || node.type === 'strong') {
          delete node.attributes.marker;
        }
      }
      const syntaxErrors = syntaxOnlyMarkdocValidate(parsed);
      if (syntaxErrors.length) {
        return text;
      }
      return Markdoc.format(parsed);
    },
    contentExtension: '.mdoc',
    validate(value) {
      return value;
    },
    serialize(value) {
      return {
        content: textEncoder.encode(value),
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
  type Field = ContentFormField<string, string, { ast: MarkdocNode }>;
}
