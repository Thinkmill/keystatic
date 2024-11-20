import { Fragment, Node } from 'prosemirror-model';
import Prism from '../../document/DocumentEditor/prism';
import { Decoration, DecorationAttrs, DecorationSet } from 'prosemirror-view';
import { css, tokenSchema } from '@keystar/ui/style';
import { weakMemoize } from './utils';
import { Plugin } from 'prosemirror-state';

type InlineDecorationSpec = {
  attrs: DecorationAttrs;
  from: number;
  to: number;
};

const emptyDecorations: InlineDecorationSpec[] = [];

function getDecorationsForIndividualNode(node: Node): InlineDecorationSpec[] {
  if (!node.type.spec.code || !node.childCount) return emptyDecorations;
  const text = node.content.child(0).text;
  if (!text) return emptyDecorations;
  let lang = node.attrs.language;
  if (typeof lang !== 'string') return emptyDecorations;
  lang = lang.trim();
  const spaceIndex = lang.indexOf(' ');
  if (spaceIndex !== -1) {
    lang = lang.slice(0, spaceIndex);
  }
  lang = lang.toLowerCase();
  if (!Object.prototype.hasOwnProperty.call(Prism.languages, lang)) {
    return emptyDecorations;
  }
  const prismLang = Prism.languages[lang];
  if (typeof prismLang !== 'object') return emptyDecorations;
  const decorations: InlineDecorationSpec[] = [];
  const tokens = Prism.tokenize(text, prismLang);
  function consumeTokens(start: number, tokens: (string | Prism.Token)[]) {
    for (const token of tokens) {
      const length = getPrismTokenLength(token);
      const end = start + length;

      if (typeof token !== 'string') {
        const className = styles.get(token.type);
        if (className) {
          decorations.push({
            attrs: { class: className },
            from: start,
            to: end,
          });
        }
        consumeTokens(
          start,
          Array.isArray(token.content) ? token.content : [token.content]
        );
      }

      start = end;
    }
  }
  consumeTokens(0, tokens);
  return decorations;
}

function getDecorationsForFragment(fragment: Fragment): InlineDecorationSpec[] {
  let start = 0;
  const allDecorations: InlineDecorationSpec[] = [];
  for (let i = 0; i < fragment.childCount; i++) {
    const node = fragment.child(i);
    const decorations = getDecorationsForNode(node);
    if (!decorations.length) {
      start += node.nodeSize;
      continue;
    }
    const textStart = start + 1;
    for (const decoration of decorations) {
      allDecorations.push({
        attrs: decoration.attrs,
        from: decoration.from + textStart,
        to: decoration.to + textStart,
      });
    }
    start += node.nodeSize;
  }
  return allDecorations;
}

export const getDecorationsForNode = weakMemoize(
  (node: Node): InlineDecorationSpec[] => {
    if (node.isTextblock) return getDecorationsForIndividualNode(node);
    return getDecorationsForFragment(node.content);
  }
);

export function codeBlockSyntaxHighlighting() {
  return new Plugin({
    props: {
      decorations(state) {
        const decorations = getDecorationsForNode(state.doc).map(decoration =>
          Decoration.inline(decoration.from, decoration.to, decoration.attrs)
        );
        return DecorationSet.create(state.doc, decorations);
      },
    },
  });
}

function getPrismTokenLength(token: Prism.Token | string): number {
  if (typeof token === 'string') {
    return token.length;
  } else if (Array.isArray(token.content)) {
    return token.content.reduce((l, t) => l + getPrismTokenLength(t), 0);
  } else {
    return getPrismTokenLength(token.content);
  }
}

const styles = new Map(
  [
    {
      types: ['comment', 'prolog', 'doctype', 'cdata'],
      style: {
        color: tokenSchema.color.foreground.neutralTertiary,
        fontStyle: 'italic',
      },
    },
    {
      types: ['atrule', 'attr-name', 'class-name', 'selector'],
      style: { color: tokenSchema.color.scale.amber11 },
    },
    {
      types: [
        'boolean',
        'constant',
        'inserted-sign',
        'entity',
        'inserted',
        'number',
        'regex',
        'symbol',
        'variable',
      ],
      style: { color: tokenSchema.color.scale.green11 },
    },
    {
      types: ['attr-value', 'builtin', 'char', 'constant', 'generics', 'url'],
      style: { color: tokenSchema.color.scale.pink11 },
    },
    {
      types: ['string'],
      style: { color: tokenSchema.color.scale.indigo9 },
    },
    {
      types: [
        'annotation',
        'deleted',
        'deleted-sign',
        'decorator',
        'important',
        'tag',
      ],
      style: { color: tokenSchema.color.scale.red11 },
    },
    {
      types: ['function', 'function-variable', 'operator'],
      style: { color: tokenSchema.color.scale.purple11 },
    },
    {
      types: ['tag', 'selector', 'keyword'],
      style: { color: tokenSchema.color.scale.indigo11 },
    },
    {
      types: ['punctuation'],
      style: { color: tokenSchema.color.foreground.neutralSecondary },
    },
  ].flatMap(style => {
    const className = css(style.style);
    return style.types.map(x => [x, className]);
  })
);
