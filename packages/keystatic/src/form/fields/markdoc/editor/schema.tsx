'use client';
import { css, tokenSchema } from '@keystar/ui/style';
import {
  DOMOutputSpec,
  NodeSpec,
  MarkSpec,
  Schema,
  NodeType,
  MarkType,
  Node,
  Slice,
  Fragment,
} from 'prosemirror-model';
import { classes, markdocIdentifierPattern, nodeWithBorder } from './utils';
import {
  InsertMenuItem,
  WithInsertMenuNodeSpec,
} from './autocomplete/insert-menu';
import { setBlockType, wrapIn } from 'prosemirror-commands';
import { insertNode } from './commands/misc';
import { toggleList } from './lists';
import { Config } from '@markdoc/markdoc';
import { attributeSchema } from './attributes/schema';
import { independentForGapCursor } from './gapcursor/gapcursor';
import { ReplaceAroundStep } from 'prosemirror-transform';

const blockElementSpacing = css({
  marginBlock: '1em',
});

const paragraphDOM: DOMOutputSpec = ['p', { class: blockElementSpacing }, 0];
const blockquoteDOM: DOMOutputSpec = [
  'blockquote',
  {
    class: `${classes.blockParent} ${css({
      marginInline: 0,
      paddingInline: tokenSchema.size.space.large,
      borderInlineStartStyle: 'solid',
      borderInlineStartWidth: tokenSchema.size.border.large,
      borderColor: tokenSchema.color.alias.borderIdle,
      [`&.${classes.nodeInSelection}, &.${classes.nodeSelection}`]: {
        borderColor: tokenSchema.color.alias.borderSelected,
      },
    })}`,
  },
  0,
];
const dividerDOM: DOMOutputSpec = [
  'hr',
  {
    contenteditable: 'false',
    class: css({
      marginBlock: '1em',
      backgroundColor: tokenSchema.color.border.neutral,
      [`&.${classes.nodeInSelection}, &.${classes.nodeSelection}`]: {
        outline: 0,
        backgroundColor: tokenSchema.color.alias.borderSelected,
      },
      border: 0,
      height: tokenSchema.size.border.large,
      padding: 0,
      cursor: 'pointer',
    }),
  },
];
const codeDOM: DOMOutputSpec = [
  'pre',
  {
    spellcheck: 'false',
    class: css({
      backgroundColor: tokenSchema.color.background.surface,
      borderRadius: tokenSchema.size.radius.medium,
      color: tokenSchema.color.foreground.neutralEmphasis,
      fontFamily: tokenSchema.typography.fontFamily.code,
      fontSize: '0.85em',
      lineHeight: tokenSchema.typography.lineheight.medium,
      maxWidth: '100%',
      overflow: 'auto',
      padding: tokenSchema.size.space.medium,
      code: {
        fontFamily: 'inherit',
      },
    }),
  },
  ['code', { class: css({ display: 'block', width: '100%' }) }, 0],
];
const hardBreakDOM: DOMOutputSpec = ['br'];

const listClass = `${blockElementSpacing} ${css({
  paddingInlineStart: tokenSchema.size.space.medium,
})}`;
const olDOM: DOMOutputSpec = ['ol', { class: listClass }, 0];
const ulDOM: DOMOutputSpec = ['ul', { class: listClass }, 0];
const liDOM: DOMOutputSpec = [
  'li',
  {
    class: css({
      'p,ul,ol': {
        marginBlock: 0,
      },
    }),
  },
  0,
];

export type EditorNodeSpec = NodeSpec & WithInsertMenuNodeSpec;

const inlineContent = `(text | (text hard_break) | attribute)*`;

const levels = [1, 2, 3, 4, 5, 6];

const nodeSpecs = {
  doc: {
    content: 'block+',
  },
  paragraph: {
    content: inlineContent,
    group: 'block',
    parseDOM: [{ tag: 'p' }],
    toDOM() {
      return paragraphDOM;
    },
  },
  text: {
    group: 'inline',
  },
  tag_attributes: {
    content: 'attribute*',
    selectable: false,
    defining: true,
    parseDOM: [{ tag: '[data-markdoc-attributes]' }],
    toDOM() {
      return [
        'div',
        {
          'data-markdoc-attributes': '1',
          class: css({
            display: 'block',
            backgroundColor: tokenSchema.color.background.surface,
            paddingInline: 0,
            borderBottom: `${tokenSchema.size.border.regular} solid ${tokenSchema.color.alias.borderIdle}`,
          }),
        },
        [
          'span',
          {
            'data-tag-name': 'true',
            class: css({
              '::before': {
                display: 'inline-block',
                width: 'auto',
                content: 'var(--tag-name)',
                verticalAlign: 'top',
                backgroundColor: tokenSchema.color.background.surfaceTertiary,
                paddingInline: tokenSchema.size.space.small,
                borderRight: `${tokenSchema.size.border.regular} solid ${tokenSchema.color.alias.borderIdle}`,
                borderBottom: `${tokenSchema.size.border.regular} solid ${tokenSchema.color.alias.borderIdle}`,
                borderEndEndRadius: tokenSchema.size.radius.small,
                [`.${classes.nodeSelection} > > &`]: {
                  borderColor: tokenSchema.color.alias.borderSelected,
                },
              },
            }),
          },
        ],
        [
          'span',
          {
            class: css({
              display: 'inline-block',
              padding: tokenSchema.size.space.small,
            }),
          },
          0,
        ],
      ];
    },
  },
  tag_slot: {
    attrs: {
      name: { default: 'children' },
    },
    content: 'block+',
    defining: true,
    toDOM(node) {
      if (node.attrs.name === 'children') {
        return [
          'div',
          { class: css({ borderTop: '2px solid green', paddingInline: -2 }) },
          0,
        ];
      }
      return [
        'div',
        {
          'data-slot': node.attrs.name,
          class: css({
            borderTop: '2px solid green',
            paddingInline: -2,
            '::before': {
              content: `attr(data-slot)`,
              display: 'inline-block',
            },
          }),
        },
        0,
      ];
    },
  },
  tag: {
    attrs: {
      name: {},
    },
    group: 'block',
    defining: true,
    [independentForGapCursor]: true,
    content: 'tag_attributes tag_slot* block*',
    parseDOM: [
      {
        tag: '[data-markdoc-tag]',
        getAttrs(node) {
          if (typeof node === 'string') return false;
          let name = node.getAttribute('data-markdoc-tag');
          if (name === null || !markdocIdentifierPattern.test(name)) {
            return false;
          }
          return { name };
        },
      },
    ],
    toDOM(node) {
      const element = document.createElement('div');
      element.dataset.markdocTag = node.attrs.name;
      element.style.setProperty('--tag-name', JSON.stringify(node.attrs.name));
      element.classList.add(
        css({
          marginBlock: '1em',
          overflow: 'hidden',
          '& > *': {
            paddingInline: tokenSchema.size.space.small,
          },
        })
      );
      element.classList.add(nodeWithBorder);
      return {
        dom: element,
        contentDOM: element,
      };
    },
  },
  blockquote: {
    content: 'block+',
    group: 'block',
    defining: true,
    parseDOM: [{ tag: 'blockquote' }],
    toDOM() {
      return blockquoteDOM;
    },
    insertMenu: {
      label: 'Blockquote',
      command: wrapIn,
    },
  },
  divider: {
    group: 'block',
    parseDOM: [{ tag: 'hr' }],
    toDOM() {
      return dividerDOM;
    },
    insertMenu: {
      label: 'Divider',
      command: insertNode,
    },
  },
  code_block: {
    content: 'text*',
    group: 'block',
    defining: true,
    [independentForGapCursor]: true,
    attrs: {
      language: { default: '' },
    },
    insertMenu: {
      label: 'Code block',
      command: setBlockType,
    },
    marks: '',
    code: true,
    parseDOM: [{ tag: 'pre', preserveWhitespace: 'full' }],
    toDOM() {
      return codeDOM;
    },
  },
  list_item: {
    content: 'block+',
    parseDOM: [{ tag: 'li' }],
    toDOM() {
      return liDOM;
    },
    defining: true,
  },
  unordered_list: {
    content: 'list_item+',
    group: 'block',
    parseDOM: [{ tag: 'ul' }],
    toDOM() {
      return ulDOM;
    },
    insertMenu: {
      label: 'Bullet list',
      command: toggleList,
    },
  },
  ordered_list: {
    content: 'list_item+',
    group: 'block',
    parseDOM: [{ tag: 'ol' }],
    toDOM() {
      return olDOM;
    },
    insertMenu: {
      label: 'Ordered list',
      command: toggleList,
    },
  },
  hard_break: {
    inline: true,
    group: 'inline',
    selectable: false,
    parseDOM: [{ tag: 'br' }],
    toDOM() {
      return hardBreakDOM;
    },
  },
  heading: {
    attrs: {
      level: { default: levels[0] },
    },
    content: inlineContent,
    group: 'block',
    parseDOM: levels.map(level => ({
      tag: 'h' + level,
      attrs: { level },
    })),
    defining: true,
    toDOM(node) {
      return ['h' + node.attrs.level, 0];
    },
    insertMenu: levels.map(level => ({
      label: 'Heading ' + level,
      command: type => setBlockType(type, { level }),
    })),
  },
  ...attributeSchema,
} satisfies Record<string, EditorNodeSpec>;

const italicDOM: DOMOutputSpec = ['em', 0];
const boldDOM: DOMOutputSpec = ['strong', 0];
const inlineCodeDOM: DOMOutputSpec = ['code', 0];
const strikethroughDOM: DOMOutputSpec = ['s', 0];

const markSpecs = {
  link: {
    attrs: {
      href: {},
      title: { default: '' },
    },
    inclusive: false,
    parseDOM: [
      {
        tag: 'a[href]',
        getAttrs(node) {
          if (typeof node === 'string') return false;
          const href = node.getAttribute('href');
          if (!href) return false;
          return {
            href,
            title: node.getAttribute('title') ?? '',
          };
        },
      },
    ],
    toDOM(node) {
      return [
        'a',
        {
          href: node.attrs.href,
          title: node.attrs.title === '' ? undefined : node.attrs.title,
        },
        0,
      ];
    },
  },
  italic: {
    shortcuts: ['Mod-i', 'Mod-I'],
    parseDOM: [
      { tag: 'i' },
      { tag: 'em' },
      { style: 'font-style=italic' },
      { style: 'font-style=normal', clearMark: m => m.type.name == 'italic' },
    ],
    toDOM() {
      return italicDOM;
    },
  },
  bold: {
    shortcuts: ['Mod-b', 'Mod-B'],
    parseDOM: [
      { tag: 'strong' },
      {
        tag: 'b',
        getAttrs: node =>
          typeof node === 'string'
            ? false
            : node.style.fontWeight != 'normal' && null,
      },
      { style: 'font-weight=400', clearMark: m => m.type.name == 'strong' },
      {
        style: 'font-weight',
        getAttrs: value =>
          typeof value === 'string'
            ? /^(bold(er)?|[5-9]\d{2,})$/.test(value) && null
            : false,
      },
    ],
    toDOM() {
      return boldDOM;
    },
  },
  strikethrough: {
    shortcuts: ['Mod-Shift-s', 'Mod-Shift-S'],
    parseDOM: [{ tag: 's' }],
    toDOM() {
      return strikethroughDOM;
    },
  },
  code: {
    shortcuts: ['Mod-`', 'Mod-Shift-M', 'Mod-E', 'Mod-e'],
    parseDOM: [{ tag: 'code' }],
    toDOM() {
      return inlineCodeDOM;
    },
  },
} satisfies Record<string, MarkSpec>;

export type EditorSchema = {
  schema: Schema;
  nodes: {
    [_ in keyof typeof nodeSpecs]: NodeType;
  };
  marks: {
    [_ in keyof typeof markSpecs]: MarkType;
  };
  markdocConfig: Config;
  insertMenuItems: InsertMenuItem[];
};

export function createEditorSchema(markdocConfig: Config) {
  const schema = new Schema({
    nodes: nodeSpecs,
    marks: markSpecs,
  });

  const nodes = schema.nodes as EditorSchema['nodes'];
  const marks = schema.marks as EditorSchema['marks'];

  const insertMenuItems: Omit<InsertMenuItem, 'id'>[] = [];
  for (const node of Object.values(schema.nodes)) {
    const insertMenuSpec = (node.spec as EditorNodeSpec).insertMenu;
    if (insertMenuSpec) {
      if (Array.isArray(insertMenuSpec)) {
        for (const item of insertMenuSpec) {
          insertMenuItems.push({
            label: item.label,
            command: item.command(node),
          });
        }
      } else {
        insertMenuItems.push({
          label: insertMenuSpec.label,
          command: insertMenuSpec.command(node),
        });
      }
    }
  }
  for (const [tagName, tagConfig] of Object.entries(markdocConfig.tags ?? {})) {
    const attributes: Node[] = [];
    for (const [attrName, attrConfig] of Object.entries(
      tagConfig.attributes ?? {}
    )) {
      if (attrConfig.required && attrConfig.default === undefined) {
        attributes.push(nodes.attribute.createAndFill({ name: attrName })!);
      }
    }
    const tag_attributes = nodes.tag_attributes.createChecked(null, attributes);
    const tagChildren = [tag_attributes];
    for (const [slotName, slotConfig] of Object.entries(
      tagConfig.slots ?? {}
    )) {
      if (slotConfig.required) {
        tagChildren.push(nodes.tag_slot.createAndFill({ name: slotName })!);
      }
    }
    const tag = nodes.tag.createChecked({ name: tagName }, tagChildren);

    const slice = new Slice(Fragment.fromArray([tag]), 0, 0);
    const childrenMatch = nodes.tag.contentMatch.edge(0).next;
    insertMenuItems.push({
      label: tagName,
      forToolbar: true,
      command: (state, dispatch) => {
        const { $from, $to } = state.selection;
        const blockRange = $from.blockRange($to);
        if (!blockRange) return false;
        if (
          blockRange.$from
            .node(-1)
            .contentMatchAt(blockRange.$from.index(-1))
            .matchType(nodes.tag) === null
        ) {
          return false;
        }

        let shouldKeepContent = !tagConfig.selfClosing;

        if (shouldKeepContent) {
          for (let i = blockRange.startIndex; i < blockRange.endIndex; i++) {
            const node = blockRange.parent.child(i);
            if (childrenMatch.matchType(node.type) === null) {
              shouldKeepContent = false;
              break;
            }
          }
        }

        if (dispatch) {
          const { tr } = state;
          if (shouldKeepContent) {
            tr.step(
              new ReplaceAroundStep(
                blockRange.start,
                blockRange.end,
                blockRange.start,
                blockRange.end,
                slice,
                tag.nodeSize - 1
              )
            );
          } else {
            tr.replaceRange(blockRange.start, blockRange.end, slice);
          }
          dispatch(tr);
        }
        return true;
      },
    });
  }
  const editorSchema: EditorSchema = {
    schema,
    marks,
    nodes,
    markdocConfig,
    insertMenuItems: insertMenuItems
      .sort((a, b) => a.label.localeCompare(b.label))
      .map((item, i) => ({ ...item, id: i.toString() })),
  };
  schemaToEditorSchema.set(schema, editorSchema);

  return editorSchema;
}

const schemaToEditorSchema = new WeakMap<Schema, EditorSchema>();

export function getEditorSchema(schema: Schema): EditorSchema {
  const editorSchema = schemaToEditorSchema.get(schema);
  if (!editorSchema) {
    throw new Error('No editor schema for schema');
  }
  return editorSchema;
}
