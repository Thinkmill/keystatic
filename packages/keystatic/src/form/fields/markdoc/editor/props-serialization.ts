import { ComponentSchema } from '../../../api';
import { serializeProps } from '../../../serialize-props';
import { useMemo } from 'react';
import { parseProps } from '../../../parse-props';
import { formatFormDataError } from '../../../error-formatting';

export function deserializeProps(
  fields: Record<string, ComponentSchema>,
  value: unknown,
  state: {
    slug: string | undefined;
    extraFiles: ReadonlyMap<string, Uint8Array>;
    otherFiles: ReadonlyMap<string, ReadonlyMap<string, Uint8Array>>;
  }
) {
  try {
    return parseProps(
      { kind: 'object', fields },
      value as any,
      [],
      [],
      (schema, value) => {
        if (schema.formKind === 'asset') {
          const filename = schema.filename(value, {
            slug: state.slug,
            suggestedFilenamePrefix: undefined,
          });
          return schema.parse(value, {
            asset: filename
              ? schema.directory
                ? state.otherFiles.get(schema.directory)?.get(filename)
                : state.extraFiles.get(filename)
              : undefined,
            slug: state.slug,
          });
        }

        if (schema.formKind === 'assets') {
          // TODO: unlike content fields, implementing this is realistic
          // there are few things to work out in terms of where extra files are stored though
          // and i think multiline strings in Markdoc attributes might be broken
          throw new Error('Not implemented');
        }

        if (schema.formKind === 'content') {
          throw new Error('Not implemented');
        }
        return schema.parse(value, undefined);
      },
      false
    );
  } catch (err) {
    throw new Error(formatFormDataError(err));
  }
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
      contents: x.contents,
    })),
  };
}

export function deserializeValue(
  value: {
    value: unknown;
    extraFiles: {
      path: string;
      parent: string | undefined;
      contents: Uint8Array;
    }[];
  },
  schema: Record<string, ComponentSchema>
) {
  const files = new Map<string, Uint8Array>();
  const extraFiles = new Map<string, Map<string, Uint8Array>>();

  for (const file of value.extraFiles) {
    if (file.parent) {
      if (!extraFiles.has(file.parent)) {
        extraFiles.set(file.parent, new Map());
      }
      extraFiles.get(file.parent)!.set(file.path, file.contents);
    } else {
      files.set(file.path, file.contents);
    }
  }

  return deserializeProps(schema, value.value, {
    slug: undefined,
    extraFiles: files,
    otherFiles: extraFiles,
  }) as Record<string, unknown>;
}

export function internalToSerialized(
  fields: Record<string, ComponentSchema>,
  value: {
    value: unknown;
    extraFiles: {
      path: string;
      parent: string | undefined;
      contents: Uint8Array;
    }[];
  },
  state: {
    slug: string | undefined;
    extraFiles: Map<string, Uint8Array>;
    otherFiles: Map<string, Map<string, Uint8Array>>;
  }
): Record<string, unknown> {
  const deserialized = deserializeValue(value, fields);
  const serialized = serializeProps(
    deserialized,
    { kind: 'object', fields },
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

export const useDeserializedValue: typeof deserializeValue =
  function useDeserializedValue(value, schema): Record<string, unknown> {
    return useMemo(() => deserializeValue(value, schema), [schema, value]);
  };
