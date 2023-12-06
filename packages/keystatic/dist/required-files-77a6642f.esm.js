import { assert } from 'emery';
import { load } from 'js-yaml';

const textDecoder = new TextDecoder();
const textEncoder = new TextEncoder();
function splitFrontmatter(data) {
  const str = textDecoder.decode(data);
  const match = str.match(/^---(?:\r?\n([^]*?))?\r?\n---\r?\n?/);
  if (match) {
    var _match$;
    const encoded = textEncoder.encode(match[0]);
    return {
      frontmatter: (_match$ = match[1]) !== null && _match$ !== void 0 ? _match$ : '',
      content: data.slice(encoded.byteLength)
    };
  }
  return null;
}
function loadDataFile(data, formatInfo) {
  const parse = formatInfo.data === 'json' ? JSON.parse : load;
  if (!formatInfo.contentField) {
    const dataFile = textDecoder.decode(data);
    return {
      loaded: parse(dataFile)
    };
  }
  const res = splitFrontmatter(data);
  assert(res !== null, 'frontmatter not found');
  return {
    loaded: parse(res.frontmatter),
    extraFakeFile: {
      path: `${formatInfo.contentField.key}${formatInfo.contentField.config.contentExtension}`,
      contents: res.content
    }
  };
}

export { loadDataFile as l };
