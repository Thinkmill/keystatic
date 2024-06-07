import { load } from 'js-yaml';
import { AssetFormField, ContentFormField, JsonYamlValue } from '../form/api';
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
  loaded: JsonYamlValue;
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
  return {
    loaded: res === null ? {} : parse(res.frontmatter),
    extraFakeFile: {
      path: `${formatInfo.contentField.path.join('/')}${
        formatInfo.contentField.contentExtension
      }`,
      contents: res === null ? data : res.content,
    },
  };
}
