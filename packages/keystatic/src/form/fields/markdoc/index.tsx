import { Node as MarkdocNode, parse } from '#markdoc';

import { ContentFormField } from '../../api';
import {
  DocumentFieldInput,
  getDefaultValue,
  serializeFromEditorState,
  createEditorSchema,
  parseToEditorState,
  parseToEditorStateMDX,
  serializeFromEditorStateMDX,
  createEditorStateFromYJS,
  prosemirrorToYXmlFragment,
} from '#field-ui/markdoc';
import type { EditorSchema } from './editor/schema';
import type { EditorState } from 'prosemirror-state';
import { ContentComponent } from '../../../content-components';
import {
  MDXEditorOptions,
  MarkdocEditorOptions,
  editorOptionsToConfig,
} from './config';
import { collectDirectoriesUsedInSchema } from '../../../app/tree-key';
import { object } from '../object';
import { fixPath } from '../../../app/path-utils';
import type { XmlFragment } from 'yjs';
import { createMarkdocConfig } from './markdoc-config';

const textDecoder = new TextDecoder();

export function markdoc({
  label,
  description,
  options = {},
  components = {},
  extension = 'mdoc',
}: {
  label: string;
  description?: string;
  options?: MarkdocEditorOptions;
  extension?: 'mdoc' | 'md';
  components?: Record<string, ContentComponent>;
}): markdoc.Field {
  let schema: undefined | EditorSchema;
  const config = editorOptionsToConfig(options);
  let getSchema = () => {
    if (!schema) {
      schema = createEditorSchema(config, components, false);
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
    contentExtension: `.${extension}`,
    validate(value) {
      return value;
    },
    directories: [
      ...collectDirectoriesUsedInSchema(
        object(
          Object.fromEntries(
            Object.entries(components).map(([name, component]) => [
              name,
              object(component.schema),
            ])
          )
        )
      ),
      ...(typeof config.image === 'object' &&
      typeof config.image.directory === 'string'
        ? [fixPath(config.image.directory)]
        : []),
    ],
    serialize(value, { slug }) {
      return {
        ...serializeFromEditorState(value, slug),
        value: undefined,
      };
    },
    reader: {
      parse: (_, { content }) => {
        const text = textDecoder.decode(content);
        return { node: parse(text) };
      },
    },
    collaboration: {
      toYjs(value) {
        return prosemirrorToYXmlFragment(value.doc);
      },
      fromYjs(yjsValue, awareness) {
        return createEditorStateFromYJS(
          getSchema(),
          yjsValue as XmlFragment,
          awareness
        );
      },
    },
  };
}

markdoc.createMarkdocConfig = createMarkdocConfig;

export declare namespace markdoc {
  type Field = ContentFormField<
    EditorState,
    EditorState,
    { node: MarkdocNode }
  >;
}

export function mdx({
  label,
  description,
  options = {},
  components = {},
  extension = 'mdx',
}: {
  label: string;
  description?: string;
  options?: MDXEditorOptions;
  extension?: 'mdx' | 'md';
  components?: Record<string, ContentComponent>;
}): mdx.Field {
  let schema: undefined | EditorSchema;
  const config = editorOptionsToConfig(options);
  let getSchema = () => {
    if (!schema) {
      schema = createEditorSchema(config, components, true);
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
      return parseToEditorStateMDX(content, getSchema(), other, external, slug);
    },
    contentExtension: `.${extension}`,
    validate(value) {
      return value;
    },
    directories: [
      ...collectDirectoriesUsedInSchema(
        object(
          Object.fromEntries(
            Object.entries(components).map(([name, component]) => [
              name,
              object(component.schema),
            ])
          )
        )
      ),
      ...(typeof config.image === 'object' &&
      typeof config.image.directory === 'string'
        ? [fixPath(config.image.directory)]
        : []),
    ],
    serialize(value, { slug }) {
      return {
        ...serializeFromEditorStateMDX(value, slug),
        value: undefined,
      };
    },
    reader: {
      parse: (_, { content }) => {
        const text = textDecoder.decode(content);
        return text;
      },
    },
    collaboration: {
      toYjs(value) {
        return prosemirrorToYXmlFragment(value.doc);
      },
      fromYjs(yjsValue, awareness) {
        return createEditorStateFromYJS(
          getSchema(),
          yjsValue as XmlFragment,
          awareness
        );
      },
    },
  };
}

export declare namespace mdx {
  type Field = ContentFormField<EditorState, EditorState, string>;
}
