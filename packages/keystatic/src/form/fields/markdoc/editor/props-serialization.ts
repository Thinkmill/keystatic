import { fromUint8Array, toUint8Array } from 'js-base64';
import { ComponentSchema } from '../../../api';
import { transformProps } from '../../../props-value';
import { serializeProps } from '../../../serialize-props';

export function deserializeProps(
  schema: ComponentSchema,
  value: unknown,
  files: ReadonlyMap<string, Uint8Array>,
  otherFiles: ReadonlyMap<string, ReadonlyMap<string, Uint8Array>>,
  slug: string | undefined
) {
  return transformProps(schema, value, {
    form: (schema, value) => {
      if (schema.formKind === 'asset') {
        const filename = schema.filename(value, {
          slug,
          suggestedFilenamePrefix: undefined,
        });
        return schema.parse(value, {
          asset: filename
            ? schema.directory
              ? otherFiles.get(schema.directory)?.get(filename)
              : files.get(filename)
            : undefined,
          slug,
        });
      }

      if (schema.formKind === 'content') {
        throw new Error('Not implemented');
      }
      return schema.parse(value, undefined);
    },
  });
}

export function toSerialized(
  deserialized: unknown,
  schema: Record<string, ComponentSchema>
) {
  const serialized = serializeProps(
    deserialized,
    { kind: 'object', fields: schema },
    undefined,
    undefined,
    false
  );
  return {
    value: serialized.value,
    extraFiles: serialized.extraFiles.map(x => ({
      ...x,
      contents: fromUint8Array(x.contents),
    })),
  };
}

export function deserializeValue(
  value: {
    value: unknown;
    extraFiles: {
      path: string;
      parent: string | undefined;
      contents: string;
    }[];
  },
  schema: ComponentSchema
) {
  const files = new Map<string, Uint8Array>();
  const extraFiles = new Map<string, Map<string, Uint8Array>>();

  for (const file of value.extraFiles) {
    if (file.parent) {
      if (!extraFiles.has(file.parent)) {
        extraFiles.set(file.parent, new Map());
      }
      extraFiles.get(file.parent)!.set(file.path, toUint8Array(file.contents));
    } else {
      files.set(file.path, toUint8Array(file.contents));
    }
  }

  return deserializeProps(
    schema,
    value.value,
    files,
    extraFiles,
    undefined
  ) as Record<string, unknown>;
}

export function internalToSerialized(
  fields: Record<string, ComponentSchema>,
  value: {
    value: unknown;
    extraFiles: {
      path: string;
      parent: string | undefined;
      contents: string;
    }[];
  },
  state: {
    slug: string | undefined;
    extraFiles: Map<string, Uint8Array>;
    otherFiles: Map<string, Map<string, Uint8Array>>;
  }
): Record<string, unknown> {
  const schema = { kind: 'object' as const, fields };
  const deserialized = deserializeValue(value, schema);
  const serialized = serializeProps(
    deserialized,
    schema,
    undefined,
    state.slug,
    false
  );
  for (const file of serialized.extraFiles) {
    if (file.parent) {
      if (!state.otherFiles.has(file.parent)) {
        state.otherFiles.set(file.parent, new Map());
      }
      state.otherFiles.get(file.parent)!.set(file.path, file.contents);
    } else {
      state.extraFiles.set(file.path, file.contents);
    }
  }
  return serialized.value as Record<string, unknown>;
}
