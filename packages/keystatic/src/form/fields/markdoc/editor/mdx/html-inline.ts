import { DOMOutputSpec, MarkSpec, NodeSpec } from 'prosemirror-model';

type InlineHTMLTagConfig =
  | { kind: 'node' }
  | { kind: 'mark'; attributes: readonly string[] };

/**
 * Inline HTML elements that MDX authors write by hand which are round-tripped
 * as `mdxJsxTextElement`s instead of being dropped. Adding an entry here is
 * enough to give the tag a node/mark in the schema, parsing and serialization.
 */
export const inlineHTMLTags = {
  br: { kind: 'node' },
  small: { kind: 'mark', attributes: ['id', 'class'] },
} satisfies Record<string, InlineHTMLTagConfig>;

const prefix = 'html_';

export function inlineHTMLSchemaName(tag: string) {
  return `${prefix}${tag}`;
}

export function getInlineHTMLTagConfig(
  tag: string
): InlineHTMLTagConfig | undefined {
  return Object.hasOwn(inlineHTMLTags, tag)
    ? inlineHTMLTags[tag as keyof typeof inlineHTMLTags]
    : undefined;
}

/** The HTML tag a node/mark type name refers to, if it is an allowlisted one. */
export function inlineHTMLTagForSchemaName(name: string): string | undefined {
  if (!name.startsWith(prefix)) return undefined;
  const tag = name.slice(prefix.length);
  return getInlineHTMLTagConfig(tag) ? tag : undefined;
}

export function getInlineHTMLNodeSpecs(): Record<string, NodeSpec> {
  const specs: Record<string, NodeSpec> = {};
  for (const [tag, config] of Object.entries(inlineHTMLTags)) {
    if (config.kind !== 'node') continue;
    specs[inlineHTMLSchemaName(tag)] = {
      inline: true,
      group: 'inline',
      selectable: false,
      // the data attribute distinguishes these from nodes which render the same
      // element, e.g. hard_break also renders a <br>
      parseDOM: [{ tag: `${tag}[data-html-tag]`, priority: 60 }],
      toDOM(): DOMOutputSpec {
        return [tag, { 'data-html-tag': tag }];
      },
    };
  }
  return specs;
}

export function getInlineHTMLMarkSpecs(): Record<string, MarkSpec> {
  const specs: Record<string, MarkSpec> = {};
  for (const [tag, config] of Object.entries(inlineHTMLTags)) {
    if (config.kind !== 'mark') continue;
    const { attributes } = config;
    specs[inlineHTMLSchemaName(tag)] = {
      attrs: Object.fromEntries(
        attributes.map(name => [name, { default: '' }])
      ),
      parseDOM: [
        {
          tag,
          getAttrs(node) {
            if (typeof node === 'string') return false;
            return Object.fromEntries(
              attributes.map(name => [name, node.getAttribute(name) ?? ''])
            );
          },
        },
      ],
      toDOM(mark): DOMOutputSpec {
        const domAttrs: Record<string, string> = {};
        for (const name of attributes) {
          if (mark.attrs[name]) domAttrs[name] = mark.attrs[name];
        }
        return [tag, domAttrs, 0];
      },
    };
  }
  return specs;
}
