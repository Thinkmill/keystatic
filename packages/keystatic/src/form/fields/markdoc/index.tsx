import { Node as MarkdocNode, parse } from '#markdoc';

import { AssetsFormField, ContentFormField } from '../../api';
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
import { FieldDataError } from '../error';

const textDecoder = new TextDecoder();
const textEncoder = new TextEncoder();

function getDirectoriesForEditorField(
  components: Record<string, ContentComponent>,
  config: MarkdocEditorOptions | MDXEditorOptions
) {
  return [
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
  ];
}

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
      const text = textDecoder.decode(content);
      return parseToEditorState(text, getSchema(), other, external, slug);
    },
    contentExtension: `.${extension}`,
    validate(value) {
      return value;
    },
    directories: getDirectoriesForEditorField(components, config),
    serialize(value, { slug }) {
      const out = serializeFromEditorState(value, slug);
      return {
        content: textEncoder.encode(out.content),
        external: out.external,
        other: out.other,
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

export declare namespace markdoc {
  type Field = ContentFormField<
    EditorState,
    EditorState,
    { node: MarkdocNode }
  >;
}

markdoc.createMarkdocConfig = createMarkdocConfig;

markdoc.inline = function inlineMarkdoc({
  label,
  description,
  options = {},
  components = {},
}: {
  label: string;
  description?: string;
  options?: MarkdocEditorOptions;
  components?: Record<string, ContentComponent>;
}): markdoc.inline.Field {
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
    formKind: 'assets',
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

    parse: (value, { other, external, slug }) => {
      if (value === undefined) {
        value = '';
      }
      if (typeof value !== 'string') {
        throw new FieldDataError('Must be a string');
      }
      return parseToEditorState(value, getSchema(), other, external, slug);
    },
    validate(value) {
      return value;
    },
    directories: getDirectoriesForEditorField(components, config),
    serialize(value, { slug }) {
      const out = serializeFromEditorState(value, slug);
      return {
        external: out.external,
        other: out.other,
        value: out.content,
      };
    },
    reader: {
      parse: value => {
        if (value === undefined) {
          value = '';
        }
        if (typeof value !== 'string') {
          throw new FieldDataError('Must be a string');
        }
        return { node: parse(value) };
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
};

export declare namespace markdoc.inline {
  export type Field = AssetsFormField<
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
      const text = textDecoder.decode(content);
      return parseToEditorStateMDX(text, getSchema(), other, external, slug);
    },
    contentExtension: `.${extension}`,
    validate(value) {
      return value;
    },
    directories: getDirectoriesForEditorField(components, config),
    serialize(value, { slug }) {
      const out = serializeFromEditorStateMDX(value, slug);
      return {
        content: textEncoder.encode(out.content),
        external: out.external,
        other: out.other,
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

mdx.inline = function mdx({
  label,
  description,
  options = {},
  components = {},
}: {
  label: string;
  description?: string;
  options?: MDXEditorOptions;
  components?: Record<string, ContentComponent>;
}): mdx.inline.Field {
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
    formKind: 'assets',
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

    parse: (value, { other, external, slug }) => {
      if (value === undefined) {
        value = '';
      }
      if (typeof value !== 'string') {
        throw new FieldDataError('Must be a string');
      }
      return parseToEditorStateMDX(value, getSchema(), other, external, slug);
    },
    validate(value) {
      return value;
    },
    directories: getDirectoriesForEditorField(components, config),
    serialize(value, { slug }) {
      const out = serializeFromEditorStateMDX(value, slug);
      return {
        external: out.external,
        other: out.other,
        value: out.content,
      };
    },
    reader: {
      parse: value => {
        if (value === undefined) {
          value = '';
        }
        if (typeof value !== 'string') {
          throw new FieldDataError('Must be a string');
        }
        return value;
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
};

export declare namespace mdx.inline {
  export type Field = AssetsFormField<EditorState, EditorState, string>;
}
