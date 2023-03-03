import { assert, assertNever } from 'emery';
import { load } from 'js-yaml';
import {
  ComponentSchema,
  FormFieldWithFile,
} from '../DocumentEditor/component-blocks/api';
import {
  ReadonlyPropPath,
  traverseProps,
} from '../DocumentEditor/component-blocks/utils';
import { FormatInfo } from './path-utils';
import { getSlugFromState } from './utils';

export type RequiredFile = {
  path: ReadonlyPropPath;
  schema: FormFieldWithFile<any, unknown, unknown>;
  file: { filename: string; parent: string | undefined } | undefined;
};

export function getPropPathPortion(
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

export function getRequiredFiles(
  rootValue: unknown,
  rootSchema: ComponentSchema
) {
  const requiredFiles: RequiredFile[] = [];
  traverseProps(rootSchema, rootValue, (schema, val, propPath) => {
    if (schema.kind === 'form') {
      if ('serializeToFile' in schema && schema.serializeToFile) {
        if (schema.serializeToFile.kind === 'asset') {
          const filename = schema.serializeToFile.filename(
            val,
            getPropPathPortion(propPath, rootSchema, rootValue)
          );
          const files: string[] = [];
          if (filename) {
            files.push(filename);
          }
          requiredFiles.push({
            path: propPath,
            schema,
            file: filename
              ? { filename, parent: schema.serializeToFile.directory }
              : undefined,
          });
        }
        if (schema.serializeToFile.kind === 'multi') {
          const basePath = getPropPathPortion(propPath, rootSchema, rootValue);
          requiredFiles.push({
            path: propPath,
            schema,
            file: {
              filename: basePath + schema.serializeToFile.primaryExtension,
              parent: undefined,
            },
          });
        }
      }
    }
  });
  return requiredFiles;
}

export function parseSerializedFormField(
  value: unknown,
  file: {
    path: ReadonlyPropPath;
    schema: FormFieldWithFile<any, unknown, unknown>;
  },
  loadedBinaryFiles: Map<string, Uint8Array>,
  mode: 'read' | 'edit',
  basePath: string,
  slug: string | undefined,
  rootValue: unknown,
  rootSchema: ComponentSchema
) {
  const serializationConfig = file.schema.serializeToFile!;

  if (serializationConfig.kind === 'asset') {
    const suggestedFilenamePrefix = getPropPathPortion(
      file.path,
      rootSchema,
      rootValue
    );
    const filepath = serializationConfig.filename(
      value,
      suggestedFilenamePrefix
    );
    if (
      mode === 'read' &&
      !serializationConfig.reader.requiresContentInReader
    ) {
      return serializationConfig.reader.parseToReader({
        value,
        suggestedFilenamePrefix,
      });
    }
    const content = filepath
      ? loadedBinaryFiles.get(
          `${
            serializationConfig.directory
              ? `${serializationConfig.directory}${
                  slug === undefined ? '' : `/${slug}`
                }`
              : basePath
          }/${filepath}`
        )
      : undefined;

    const parsed = (
      mode === 'read' && serializationConfig.reader.requiresContentInReader
        ? serializationConfig.reader.parseToReader
        : serializationConfig.parse
    )({ content, value, suggestedFilenamePrefix });
    return parsed;
  }
  if (serializationConfig.kind === 'multi') {
    const rootPath = `${basePath}/${getPropPathPortion(
      file.path,
      rootSchema,
      rootValue
    )}`;
    const mainFilepath = rootPath + serializationConfig.primaryExtension;
    if (mode === 'read') {
      if (serializationConfig.reader.requiresContentInReader) {
        const mainContents = loadedBinaryFiles.get(mainFilepath);
        return serializationConfig.reader.parseToReader({
          value,
          primary: mainContents,
        });
      }
      return serializationConfig.reader.parseToReader({ value });
    }
    const mainContents = loadedBinaryFiles.get(mainFilepath);

    const otherFiles = new Map<string, Uint8Array>();
    const otherDirectories = new Map<string, Map<string, Uint8Array>>();

    for (const [filename] of loadedBinaryFiles) {
      if (filename.startsWith(rootPath + '/')) {
        const relativePath = filename.slice(rootPath.length + 1);
        otherFiles.set(relativePath, loadedBinaryFiles.get(filename)!);
      }
    }
    for (const dir of serializationConfig.directories ?? []) {
      const dirFiles = new Map<string, Uint8Array>();
      const start = `${dir}${slug === undefined ? '' : `/${slug}`}/`;
      for (const [filename, val] of loadedBinaryFiles) {
        if (filename.startsWith(start)) {
          const relativePath = filename.slice(start.length);
          dirFiles.set(relativePath, val);
        }
      }
      if (dirFiles.size) {
        otherDirectories.set(dir, dirFiles);
      }
    }

    return serializationConfig.parse({
      value,
      primary: mainContents,
      other: otherFiles,
      external: otherDirectories,
      slug,
    });
  }
  assertNever(serializationConfig);
}

const textDecoder = new TextDecoder();
const textEncoder = new TextEncoder();

function splitFrontmatter(data: Uint8Array) {
  const str = textDecoder.decode(data);
  const match = str.match(/^(---\r?\n([^]*?)\r?\n---\r?\n)/);
  if (match) {
    const encoded = textEncoder.encode(match[1]);
    return {
      frontmatter: match[2],
      content: data.slice(encoded.byteLength),
    };
  }
  return null;
}

export function loadDataFile(data: Uint8Array, formatInfo: FormatInfo) {
  if (typeof formatInfo === 'string') {
    const dataFile = textDecoder.decode(data);
    return {
      loaded: formatInfo === 'json' ? JSON.parse(dataFile) : load(dataFile),
    };
  }
  const res = splitFrontmatter(data);
  assert(res !== null, 'frontmatter not found');
  return {
    loaded:
      formatInfo.frontmatter === 'json'
        ? JSON.parse(res.frontmatter)
        : load(res.frontmatter),
    extraFakeFile: {
      path: `${formatInfo.contentFieldKey}${formatInfo.contentFieldConfig.serializeToFile.primaryExtension}`,
      contents: res.content,
    },
  };
}
