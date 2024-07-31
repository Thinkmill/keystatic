import { transformProps } from './props-value';
import { ReadonlyPropPath } from './fields/document/DocumentEditor/component-blocks/utils';
import { getSlugFromState } from '../app/utils';
import { ComponentSchema } from '..';

export function serializeProps(
  rootValue: unknown,
  rootSchema: ComponentSchema,
  // note you might have a slug without a slug field when serializing props inside a component block or etc. in the editor
  slugField: string | undefined,
  slug: string | undefined,
  shouldSuggestFilenamePrefix: boolean
) {
  const extraFiles: {
    path: string;
    parent: string | undefined;
    contents: Uint8Array;
  }[] = [];
  return {
    value: transformProps(rootSchema, rootValue, {
      form(schema, value, propPath) {
        if (propPath.length === 1 && slugField === propPath[0]) {
          if (schema.formKind !== 'slug') {
            throw new Error('slugField is a not a slug field');
          }
          return schema.serializeWithSlug(value).value;
        }
        if (schema.formKind === 'asset') {
          const { asset, value: forYaml } = schema.serialize(value, {
            suggestedFilenamePrefix: shouldSuggestFilenamePrefix
              ? getPropPathPortion(propPath, rootSchema, rootValue)
              : undefined,
            slug,
          });
          if (asset) {
            extraFiles.push({
              path: asset.filename,
              contents: asset.content,
              parent: schema.directory,
            });
          }
          return forYaml;
        }
        if (schema.formKind === 'content' || schema.formKind === 'assets') {
          let other: ReadonlyMap<string, Uint8Array>, external, forYaml;
          if (schema.formKind === 'content') {
            const out = schema.serialize(value, { slug });
            if (out.content) {
              extraFiles.push({
                path:
                  getPropPathPortion(propPath, rootSchema, rootValue) +
                  schema.contentExtension,
                contents: out.content,
                parent: undefined,
              });
            }
            ({ value: forYaml, other, external } = out);
          } else {
            const out = schema.serialize(value, { slug });
            ({ value: forYaml, other, external } = out);
          }

          for (const [key, contents] of other) {
            extraFiles.push({
              path:
                getPropPathPortion(propPath, rootSchema, rootValue) + '/' + key,
              contents,
              parent: undefined,
            });
          }
          const allowedDirectories = new Set(schema.directories);
          for (const [directory, contents] of external) {
            if (!allowedDirectories.has(directory)) {
              throw new Error(
                `Invalid directory ${directory} in content field serialization`
              );
            }
            for (const [filename, fileContents] of contents) {
              extraFiles.push({
                path: filename,
                contents: fileContents,
                parent: directory,
              });
            }
          }
          return forYaml;
        }
        return schema.serialize(value).value;
      },
      object(_schema, value) {
        return Object.fromEntries(
          Object.entries(value).filter(([_, val]) => val !== undefined)
        );
      },
      array(_schema, value) {
        return value.map(val => (val === undefined ? null : val));
      },
      conditional(_schema, value) {
        if (value.value === undefined) {
          return { discriminant: value.discriminant } as any;
        }
        return value;
      },
      child() {
        return undefined as any;
      },
    }),
    extraFiles,
  };
}

function getPropPathPortion(
  path: ReadonlyPropPath,
  schema: ComponentSchema,
  value: unknown
): string {
  const end: (string | number)[] = [];
  for (const portion of path) {
    if (schema.kind === 'array') {
      value = (value as any)[portion];
      if (schema.slugField && schema.element.kind === 'object') {
        const slug = getSlugFromState(
          { schema: schema.element.fields, slugField: schema.slugField },
          value as Record<string, unknown>
        );
        end.push(slug);
      } else {
        end.push(portion);
      }
      schema = schema.element;
      continue;
    }
    end.push(portion);
    if (schema.kind === 'object') {
      value = (value as any)[portion];
      schema = schema.fields[portion];
      continue;
    }
    if (schema.kind === 'conditional') {
      if (portion === 'discriminant') {
        schema = schema.discriminant;
      } else if (portion === 'value') {
        schema = schema.values[(value as any).discriminant];
      }
      value = (value as any)[portion];
      continue;
    }
    throw new Error(`unexpected ${schema.kind}`);
  }
  return end.join('/');
}
