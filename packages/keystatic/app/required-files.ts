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

export type RequiredFile = {
  path: ReadonlyPropPath;
  schema: FormFieldWithFile<any, unknown, unknown>;
  files: string[];
};

export function getRequiredFiles(value: unknown, schema: ComponentSchema) {
  const requiredFiles: RequiredFile[] = [];
  traverseProps(schema, value, (schema, val, propPath) => {
    if (schema.kind === 'form') {
      if ('serializeToFile' in schema && schema.serializeToFile) {
        if (schema.serializeToFile.kind === 'asset') {
          const filename = schema.serializeToFile.filename(
            value,
            propPath.join('/')
          );
          const files: string[] = [];
          if (filename) {
            files.push(filename);
          }
          requiredFiles.push({ path: propPath, schema, files });
        }
        if (schema.serializeToFile.kind === 'multi') {
          const basePath = propPath.join('/');
          const filenames = [
            basePath + schema.serializeToFile.primaryExtension,
          ];
          requiredFiles.push({ path: propPath, schema, files: filenames });
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
  mode: 'read' | 'edit'
) {
  const serializationConfig = file.schema.serializeToFile!;

  if (serializationConfig.kind === 'asset') {
    const suggestedFilenamePrefix = file.path.join('/');
    const filepath = serializationConfig.filename(value, file.path.join('/'));
    if (
      mode === 'read' &&
      !serializationConfig.reader.requiresContentInReader
    ) {
      return serializationConfig.reader.parseToReader({
        value,
        suggestedFilenamePrefix,
      });
    }
    const content = filepath ? loadedBinaryFiles.get(filepath) : undefined;

    const parsed = (
      mode === 'read' && serializationConfig.reader.requiresContentInReader
        ? serializationConfig.reader.parseToReader
        : serializationConfig.parse
    )({ content, value, suggestedFilenamePrefix });
    return parsed;
  }
  if (serializationConfig.kind === 'multi') {
    const rootPath = file.path.join('/');
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

    const otherFiles: Record<string, Uint8Array> = {};

    for (const [filename] of loadedBinaryFiles) {
      if (filename.startsWith(rootPath + '/')) {
        const relativePath = filename.slice(rootPath.length + 1);
        otherFiles[relativePath] = loadedBinaryFiles.get(filename)!;
      }
    }

    return serializationConfig.parse({
      value,
      primary: mainContents,
      other: otherFiles,
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
  console.log(res);
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
