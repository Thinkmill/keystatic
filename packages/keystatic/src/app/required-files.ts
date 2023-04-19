import { assert } from 'emery';
import { load } from 'js-yaml';
import { AssetFormField, ContentFormField, JsonValue } from '../form/api';
import { ReadonlyPropPath } from '../form/fields/document/DocumentEditor/component-blocks/utils';
import { FormatInfo } from './path-utils';

export type RequiredFile = {
  path: ReadonlyPropPath;
  schema: AssetFormField<any, any, any> | ContentFormField<any, any, any>;
  file: { filename: string; parent: string | undefined } | undefined;
};

const textDecoder = new TextDecoder();
const textEncoder = new TextEncoder();

function splitFrontmatter(data: Uint8Array) {
  const str = textDecoder.decode(data);
  const match = str.match(/^---(?:\r?\n([^]*?))?\r?\n---\r?\n?/);
  if (match) {
    const encoded = textEncoder.encode(match[0]);
    return {
      frontmatter: match[1] ?? '',
      content: data.slice(encoded.byteLength),
    };
  }
  return null;
}

export function loadDataFile(
  data: Uint8Array,
  formatInfo: FormatInfo
): {
  loaded: JsonValue;
  extraFakeFile?: {
    path: string;
    contents: Uint8Array;
  };
} {
  const parse = formatInfo.data === 'json' ? JSON.parse : load;
  if (!formatInfo.contentField) {
    const dataFile = textDecoder.decode(data);
    return {
      loaded: parse(dataFile),
    };
  }
  const res = splitFrontmatter(data);
  assert(res !== null, 'frontmatter not found');
  return {
    loaded: parse(res.frontmatter),
    extraFakeFile: {
      path: `${formatInfo.contentField.key}${formatInfo.contentField.config.contentExtension}`,
      contents: res.content,
    },
  };
}
