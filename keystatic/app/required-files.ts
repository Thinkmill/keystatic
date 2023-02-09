import { assert, assertNever } from 'emery';
import { load } from 'js-yaml';
import { ComponentSchema, FormFieldWithFile } from '../DocumentEditor/component-blocks/api';
import { FormatInfo } from './path-utils';

export type RequiredFile = {
  path: (string | number)[];
  schema: FormFieldWithFile<any, unknown>;
  files: string[];
};

export function getRequiredFiles(value: unknown, schema: ComponentSchema) {
  const requiredFiles: RequiredFile[] = [];
  _getRequiredFiles(value, schema, [], requiredFiles);
  return requiredFiles;
}

function _getRequiredFiles(
  value: unknown,
  schema: ComponentSchema,
  propPath: (string | number)[],
  requiredFiles: RequiredFile[]
) {
  if (schema.kind === 'child' || schema.kind === 'relationship') {
    return;
  }
  if (schema.kind === 'form') {
    if ('serializeToFile' in schema && schema.serializeToFile) {
      if (schema.serializeToFile.kind === 'asset') {
        const extension = schema.serializeToFile.extension(value);
        const filename = propPath.join('/') + extension;
        requiredFiles.push({ path: propPath, schema, files: [filename] });
      }
      if (schema.serializeToFile.kind === 'multi') {
        const files = schema.serializeToFile.files(value);
        const basePath = propPath.join('/');
        const filenames = [
          basePath + schema.serializeToFile.primaryExtension,
          ...files.map(x => basePath + '/' + x),
        ];
        requiredFiles.push({ path: propPath, schema, files: filenames });
      }
    }
    return;
  }
  if (schema.kind === 'object') {
    for (const [key, val] of Object.entries(schema.fields)) {
      _getRequiredFiles((value as any)[key], val, [...propPath, key], requiredFiles);
    }
    return;
  }
  if (schema.kind === 'array') {
    for (const [index, val] of (value as unknown[]).entries()) {
      _getRequiredFiles(val, schema.element, [...propPath, index], requiredFiles);
    }
    return;
  }
  if (schema.kind === 'conditional') {
    _getRequiredFiles(
      (value as any).value,
      schema.values[(value as any).discriminant],
      [...propPath, 'value'],
      requiredFiles
    );
    return;
  }
}

export function parseSerializedFormField(
  value: unknown,
  file: RequiredFile,
  loadedBinaryFiles: Map<string, Uint8Array>
) {
  const serializationConfig = file.schema.serializeToFile!;
  if (serializationConfig.kind === 'asset') {
    const extension = serializationConfig.extension(value);
    const filepath = file.path.join('/') + extension;
    const binaryContents = loadedBinaryFiles.get(filepath);
    if (binaryContents) {
      const parsed = serializationConfig.parse({
        content: binaryContents,
        value,
      });
      return parsed;
    }
    return file.schema.defaultValue;
  }
  if (serializationConfig.kind === 'multi') {
    const rootPath = file.path.join('/');
    const mainFilepath = rootPath + serializationConfig.primaryExtension;
    const mainContents = loadedBinaryFiles.get(mainFilepath);
    const files = serializationConfig.files(value);
    const otherFiles = Object.fromEntries(
      files.flatMap(filename => {
        const contents = loadedBinaryFiles.get(rootPath + '/' + filename);
        if (contents) {
          return [[filename, contents]];
        }
        return [];
      })
    );
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
    return { loaded: formatInfo === 'json' ? JSON.parse(dataFile) : load(dataFile) };
  }
  const res = splitFrontmatter(data);
  assert(res !== null, 'frontmatter not found');
  return {
    loaded: formatInfo.frontmatter === 'json' ? JSON.parse(res.frontmatter) : load(res.frontmatter),
    extraFakeFile: {
      path: `${formatInfo.contentFieldKey}${formatInfo.contentFieldConfig.serializeToFile.primaryExtension}`,
      contents: res.content,
    },
  };
}
