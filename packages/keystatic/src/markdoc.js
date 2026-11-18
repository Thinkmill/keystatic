import { format as formatMarkdoc } from '@markdoc/markdoc/dist/index.mjs';

export * from '@markdoc/markdoc/dist/index.mjs';

const wordChar = /[\p{L}\p{N}]/u;

// Markdoc's formatter only escapes a leading *, # or > in text (and *, _ and ~
// inside strong, em and s) so text like "2026. A turning point", "- not a list"
// or "a *literal* word" would be read back as a list or emphasis
function escapeText(node, parentType, changed) {
  node.children.forEach((child, i) => {
    const { content } = child.attributes;
    if (child.type === 'text' && typeof content === 'string') {
      let escaped = content.replace(/\{%/g, '\\{%');
      if (!['strong', 'em', 's'].includes(node.type)) {
        escaped = escaped.replace(/[*_]/g, (char, index, str) => {
          const before = str[index - 1] ?? '';
          const after = str[index + 1] ?? '';
          // with spaces on both sides it can't open or close emphasis, and a _
          // between two word characters (snake_case) isn't emphasis either
          if (/\s/.test(before) && /\s/.test(after)) return char;
          if (char === '_' && wordChar.test(before) && wordChar.test(after)) {
            return char;
          }
          return '\\' + char;
        });
      }
      const prev = node.children[i - 1];
      if (
        node.type === 'inline' &&
        parentType !== 'heading' &&
        (!prev || prev.type === 'hardbreak' || prev.type === 'softbreak')
      ) {
        escaped = escaped
          .replace(/^[-+](?=\s|$)/, '\\$&')
          .replace(/^(\d{1,9})([.)])(?=\s|$)/, '$1\\$2');
      }
      if (escaped !== content) {
        changed.push([child, content]);
        child.attributes.content = escaped;
      }
    }
    escapeText(child, node.type, changed);
  });
}

export function format(ast, options) {
  const changed = [];
  escapeText(ast, undefined, changed);
  try {
    return formatMarkdoc(ast, options);
  } finally {
    for (const [node, content] of changed) node.attributes.content = content;
  }
}
