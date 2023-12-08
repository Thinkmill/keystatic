import Markdoc, {
  Config as MarkdocConfig,
  Node as MarkdocNode,
} from '@markdoc/markdoc';

import { ContentFormField } from '../../api';
import {
  DocumentFieldInput,
  getDefaultValue,
  serializeFromEditorState,
  createEditorSchema,
  parseToEditorState,
} from '#field-ui/markdoc';
import type { EditorSchema } from './editor/schema';
import type { EditorState } from 'prosemirror-state';
import { ContentComponent, block } from '../../../content-components';
import { cloudImageSchema } from '../../../component-blocks/cloud-image-schema';
import {
  CloudImagePreviewForNewEditor,
  cloudImageToolbarIcon,
} from '#cloud-image-preview';

const textDecoder = new TextDecoder();

/**
 * @deprecated This is experimental and buggy, use at your own risk.
 */
export function __experimental_markdoc_field({
  label,
  description,
  config,
  components = {},
}: {
  label: string;
  description?: string;
  config: MarkdocConfig;
  components?: Record<string, ContentComponent>;
}): __experimental_markdoc_field.Field {
  let schema: undefined | EditorSchema;
  let getSchema = () => {
    if (!schema) {
      schema = createEditorSchema(config, components);
    }
    return schema;
  };
  return {
    kind: 'form',
    formKind: 'content',
    defaultValue() {
      return getDefaultValue(getSchema());
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

    parse: (_, { content, other, external, slug }) => {
      return parseToEditorState(content, getSchema(), other, external, slug);
    },
    contentExtension: '.mdoc',
    validate(value) {
      return value;
    },
    serialize(value) {
      return {
        ...serializeFromEditorState(value),
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

export function __experimental_markdoc_field_cloudImageBlock(args: {
  label: string;
}) {
  return block({
    label: args.label,
    schema: cloudImageSchema,
    NodeView: CloudImagePreviewForNewEditor,
    icon: cloudImageToolbarIcon,
  });
}

export declare namespace __experimental_markdoc_field {
  type Field = ContentFormField<EditorState, EditorState, { ast: MarkdocNode }>;
}
