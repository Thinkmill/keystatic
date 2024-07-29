import { load } from 'js-yaml';
import { JsonYamlValue } from '../form/api';
import { FormatInfo } from './path-utils';

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
  formatInfo: FormatInfo,
  requireFrontmatter = false
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
  if (requireFrontmatter && !res) {
    throw new Error('Frontmatter not found');
  }
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
