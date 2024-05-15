import { classNames, css, tokenSchema, transition } from '@keystar/ui/style';
import { fileCodeIcon } from '@keystar/ui/icon/icons/fileCodeIcon';
import { heading1Icon } from '@keystar/ui/icon/icons/heading1Icon';
import { heading2Icon } from '@keystar/ui/icon/icons/heading2Icon';
import { heading3Icon } from '@keystar/ui/icon/icons/heading3Icon';
import { heading4Icon } from '@keystar/ui/icon/icons/heading4Icon';
import { heading5Icon } from '@keystar/ui/icon/icons/heading5Icon';
import { heading6Icon } from '@keystar/ui/icon/icons/heading6Icon';
import { imageIcon } from '@keystar/ui/icon/icons/imageIcon';
import { listIcon } from '@keystar/ui/icon/icons/listIcon';
import { listOrderedIcon } from '@keystar/ui/icon/icons/listOrderedIcon';
import { quoteIcon } from '@keystar/ui/icon/icons/quoteIcon';
import { tableIcon } from '@keystar/ui/icon/icons/tableIcon';
import { separatorHorizontalIcon } from '@keystar/ui/icon/icons/separatorHorizontalIcon';
import {
  DOMOutputSpec,
  NodeSpec,
  MarkSpec,
  Schema,
  NodeType,
  MarkType,
  AttributeSpec,
} from 'prosemirror-model';
import { classes } from './utils';
import {
  InsertMenuItem,
  WithInsertMenuNodeSpec,
} from './autocomplete/insert-menu';
import { setBlockType, wrapIn } from 'prosemirror-commands';
import { insertNode, insertTable } from './commands/misc';
import { toggleList } from './lists';
import { independentForGapCursor } from './gapcursor/gapcursor';
import { WithReactNodeViewSpec } from './react-node-views';
import { ContentComponent } from '../../../../content-components';
import { getCustomMarkSpecs, getCustomNodeSpecs } from './custom-components';
import { EditorConfig } from '../config';
import { toSerialized } from './props-serialization';
import { getInitialPropsValue } from '../../../initial-values';
import { getUploadedFileObject } from '../../image/ui';
import { base64UrlEncode, base64UrlDecode } from '#base64';

const blockElementSpacing = css({
  marginBlock: '1em',
});

const paragraphDOM: DOMOutputSpec = ['p', { class: blockElementSpacing }, 0];
const blockquoteDOM: DOMOutputSpec = [
  'blockquote',
  {
    class: classNames(
      classes.blockParent,
      css({
        [`&.${classes.nodeInSelection}, &.${classes.nodeSelection}`]: {
          borderColor: tokenSchema.color.alias.borderSelected,
        },
      })
    ),
  },
  0,
];
const dividerDOM: DOMOutputSpec = [
  'hr',
  {
    contenteditable: 'false',
    class: css({
      cursor: 'pointer',
      [`&.${classes.nodeInSelection}, &.${classes.nodeSelection}`]: {
        backgroundColor: tokenSchema.color.alias.borderSelected,
      },
    }),
  },
];
const codeDOM: DOMOutputSpec = [
  'pre',
  { spellcheck: 'false' },
  ['code', {}, 0],
];
const hardBreakDOM: DOMOutputSpec = ['br'];

const olDOM: DOMOutputSpec = ['ol', {}, 0];
const ulDOM: DOMOutputSpec = ['ul', {}, 0];
const liDOM: DOMOutputSpec = ['li', {}, 0];

export type EditorNodeSpec = NodeSpec &
  WithInsertMenuNodeSpec &
  WithReactNodeViewSpec;

const inlineContent = `(text | inline_component | hard_break)*`;

const levelsMeta = [
  { description: 'Use this for a top level heading', icon: heading1Icon },
  { description: 'Use this for key sections', icon: heading2Icon },
  { description: 'Use this for sub-sections', icon: heading3Icon },
  { description: 'Use this for deep headings', icon: heading4Icon },
  { description: 'Use this for grouping list items', icon: heading5Icon },
  { description: 'Use this for low-level headings', icon: heading6Icon },
];

const cellAttrs: Record<string, AttributeSpec> = {
  colspan: { default: 1 },
  rowspan: { default: 1 },
};

const tableCellClass = css({
  borderBottom: `1px solid ${tokenSchema.color.alias.borderIdle}`,
  borderInlineEnd: `1px solid ${tokenSchema.color.alias.borderIdle}`,
  boxSizing: 'border-box',
  margin: 0,
  padding: tokenSchema.size.space.regular,
  position: 'relative',
  textAlign: 'start',
  verticalAlign: 'top',

  '&.selectedCell': {
    backgroundColor: tokenSchema.color.alias.backgroundSelected,
    '& *::selection': {
      backgroundColor: 'transparent',
    },
  },
  '&.selectedCell::after': {
    border: `1px solid ${tokenSchema.color.alias.borderSelected}`,
    position: 'absolute',
    top: -1,
    left: -1,
    content: '""',
    height: '100%',
    width: '100%',
  },
});
const tableHeaderClass = css(tableCellClass, {
  backgroundColor: tokenSchema.color.scale.slate3,
  fontWeight: tokenSchema.typography.fontWeight.semibold,
});

const nodeSpecs = {
  doc: {
    content: 'block+',
  },
  paragraph: {
    content: inlineContent,
    group: 'block',
    parseDOM: [{ tag: 'p' }, { tag: '[data-ignore-content]', ignore: true }],
    toDOM() {
      return paragraphDOM;
    },
  },
  text: {
    group: 'inline',
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
      description: 'Insert a quote or citation',
      icon: quoteIcon,
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
      description: 'A horizontal line to separate content',
      icon: separatorHorizontalIcon,
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
      description: 'Display code with syntax highlighting',
      icon: fileCodeIcon,
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
      description: 'Insert an unordered list',
      icon: listIcon,
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
      description: 'Insert an ordered list',
      icon: listOrderedIcon,
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
  table: {
    content: 'table_row+',
    insertMenu: {
      label: 'Table',
      description: 'Insert a table',
      icon: tableIcon,
      command: insertTable,
    },
    tableRole: 'table',
    isolating: true,
    group: 'block',
    parseDOM: [{ tag: 'table' }],
    toDOM() {
      return [
        'table',
        {
          class: css({
            width: '100%',
            tableLayout: 'fixed',
            position: 'relative',
            borderSpacing: 0,
            borderInlineStart: `1px solid ${tokenSchema.color.alias.borderIdle}`,
            borderTop: `1px solid ${tokenSchema.color.alias.borderIdle}`,

            '&:has(.selectedCell) *::selection': {
              backgroundColor: 'transparent',
            },

            // stop content from bouncing around when widgets are added
            '.ProseMirror-widget + *': {
              marginTop: 0,
            },
          }),
        },
        ['tbody', 0],
      ];
    },
  },
  table_row: {
    content: '(table_cell | table_header)*',
    tableRole: 'row',
    allowGapCursor: false,
    parseDOM: [{ tag: 'tr' }],
    toDOM() {
      return ['tr', 0];
    },
  },
  table_cell: {
    content: 'block+',
    tableRole: 'cell',
    isolating: true,
    attrs: cellAttrs,
    parseDOM: [{ tag: 'td' }],
    toDOM() {
      return ['td', { class: tableCellClass }, 0];
    },
  },
  table_header: {
    content: 'block+',
    tableRole: 'header_cell',
    attrs: cellAttrs,
    isolating: true,
    parseDOM: [{ tag: 'th' }],
    toDOM() {
      return ['th', { class: tableHeaderClass }, 0];
    },
  },
  image: {
    content: '',
    group: 'inline inline_component',
    inline: true,
    attrs: {
      src: {},
      filename: {},
      alt: { default: '' },
      title: { default: '' },
    },
    insertMenu: {
      label: 'Image',
      description: 'Insert an image',
      icon: imageIcon,
      command: nodeType => {
        return (state, dispatch, view) => {
          if (dispatch && view) {
            (async () => {
              const file = await getUploadedFileObject('image/*');
              if (!file) return;
              view.dispatch(
                view.state.tr.replaceSelectionWith(
                  nodeType.createChecked({
                    src: new Uint8Array(await file.arrayBuffer()),
                    filename: file.name,
                  })
                )
              );
            })();
          }
          return true;
        };
      },
    },
    nodeView(node) {
      const blob = new Blob([node.attrs.src], {
        type: node.attrs.filename.endsWith('.svg')
          ? 'image/svg+xml'
          : undefined,
      });
      const dom = document.createElement('img');
      dom.src = URL.createObjectURL(blob);
      dom.alt = node.attrs.alt;
      dom.title = node.attrs.title;
      dom.dataset.filename = node.attrs.filename;
      dom.classList.add(
        css({
          boxSizing: 'border-box',
          borderRadius: tokenSchema.size.radius.regular,
          display: 'inline-block',
          maxHeight: tokenSchema.size.scale[3600],
          maxWidth: '100%',
          transition: transition('box-shadow'),
          '&::selection': {
            backgroundColor: 'transparent',
          },
        })
      );
      return {
        dom,
        destroy() {
          URL.revokeObjectURL(dom.src);
        },
      };
    },
    toDOM(node) {
      return [
        'img',
        {
          src: `data:${
            node.attrs.filename.endsWith('.svg')
              ? 'image/svg+xml'
              : 'application/octet-stream'
          };base64,${base64UrlEncode(node.attrs.src)}`,
          alt: node.attrs.alt,
          title: node.attrs.title,
          'data-filename': node.attrs.filename,
        },
      ];
    },
    parseDOM: [
      {
        tag: 'img[src][data-filename]',
        getAttrs(node) {
          if (typeof node === 'string') return false;
          const src = node.getAttribute('src');
          const filename = node.getAttribute('data-filename');
          if (!src?.startsWith('data:') || !filename) return false;
          const srcAsUint8Array = base64UrlDecode(
            src.replace(/^data:[a-z/-]+;base64,/, '')
          );
          return {
            src: srcAsUint8Array,
            filename,
            alt: node.getAttribute('alt') ?? '',
            title: node.getAttribute('title') ?? '',
          };
        },
      },
    ],
  },
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
  nodes: Partial<{
    [_ in keyof typeof nodeSpecs]: NodeType;
  }> & { paragraph: {}; doc: {}; text: {}; heading: NodeType };
  marks: Partial<{
    [_ in keyof typeof markSpecs]: MarkType;
  }>;
  config: EditorConfig;
  components: Record<string, ContentComponent>;
  insertMenuItems: InsertMenuItem[];
};

export function createEditorSchema(
  config: EditorConfig,
  components: Record<string, ContentComponent>,
  isMDX: boolean
) {
  const nodeSpecsWithCustomNodes: Record<string, EditorNodeSpec> = {
    doc: nodeSpecs.doc,
    paragraph: nodeSpecs.paragraph,
    text: nodeSpecs.text,
    hard_break: nodeSpecs.hard_break,
    ...getCustomNodeSpecs(components),
  };
  if (config.blockquote) {
    nodeSpecsWithCustomNodes.blockquote = nodeSpecs.blockquote;
  }
  if (config.divider) {
    nodeSpecsWithCustomNodes.divider = nodeSpecs.divider;
  }
  if (config.codeBlock) {
    nodeSpecsWithCustomNodes.code_block = {
      ...nodeSpecs.code_block,
      attrs: {
        ...nodeSpecs.code_block.attrs,
        props: {
          default: toSerialized(
            getInitialPropsValue({
              kind: 'object',
              fields: config.heading.schema,
            }),
            config.heading.schema
          ),
        },
      },
    };
  }
  if (config.orderedList) {
    nodeSpecsWithCustomNodes.ordered_list = nodeSpecs.ordered_list;
  }
  if (config.unorderedList) {
    nodeSpecsWithCustomNodes.unordered_list = nodeSpecs.unordered_list;
  }
  if (config.orderedList || config.unorderedList) {
    nodeSpecsWithCustomNodes.list_item = nodeSpecs.list_item;
  }
  if (config.heading.levels.length) {
    nodeSpecsWithCustomNodes.heading = {
      attrs: {
        level: { default: config.heading.levels[0] },
        props: {
          default: toSerialized(
            getInitialPropsValue({
              kind: 'object',
              fields: config.heading.schema,
            }),
            config.heading.schema
          ),
        },
      },
      content: inlineContent,
      group: 'block',
      parseDOM: config.heading.levels.map(level => ({
        tag: 'h' + level,
        attrs: { level },
      })),
      defining: true,
      toDOM(node) {
        return ['h' + node.attrs.level, 0];
      },
      insertMenu: config.heading.levels.map((level, index) => ({
        ...levelsMeta[index],
        label: 'Heading ' + level,
        command: type => setBlockType(type, { level }),
      })),
    };
  }
  if (config.table) {
    nodeSpecsWithCustomNodes.table = nodeSpecs.table;
    nodeSpecsWithCustomNodes.table_row = nodeSpecs.table_row;
    if (isMDX) {
      nodeSpecsWithCustomNodes.table_cell = {
        ...nodeSpecs.table_cell,
        content: 'paragraph',
      };
    } else {
      nodeSpecsWithCustomNodes.table_cell = nodeSpecs.table_cell;
    }
    nodeSpecsWithCustomNodes.table_header = nodeSpecs.table_header;
  }
  if (config.image) {
    nodeSpecsWithCustomNodes.image = nodeSpecs.image;
  }

  const markSpecsWithCustomMarks = {
    ...getCustomMarkSpecs(components),
  };
  if (config.link) {
    markSpecsWithCustomMarks.link = markSpecs.link;
  }
  if (config.italic) {
    markSpecsWithCustomMarks.italic = markSpecs.italic;
  }
  if (config.bold) {
    markSpecsWithCustomMarks.bold = markSpecs.bold;
  }
  if (config.strikethrough) {
    markSpecsWithCustomMarks.strikethrough = markSpecs.strikethrough;
  }
  if (config.code) {
    markSpecsWithCustomMarks.code = markSpecs.code;
  }

  const schema = new Schema({
    nodes: nodeSpecsWithCustomNodes,
    marks: markSpecsWithCustomMarks,
  });

  const nodes = schema.nodes as EditorSchema['nodes'];
  const marks = schema.marks as EditorSchema['marks'];

  const editorSchema: EditorSchema = {
    schema,
    marks,
    nodes,
    config,
    components,
    insertMenuItems: [],
  };
  schemaToEditorSchema.set(schema, editorSchema);

  const insertMenuItems: Omit<InsertMenuItem, 'id'>[] = [];
  for (const node of Object.values(schema.nodes)) {
    const insertMenuSpec = (node.spec as EditorNodeSpec).insertMenu;
    if (insertMenuSpec) {
      if (Array.isArray(insertMenuSpec)) {
        for (const item of insertMenuSpec) {
          insertMenuItems.push({
            label: item.label,
            description: item.description,
            icon: item.icon,
            command: item.command(node, editorSchema),
            forToolbar: item.forToolbar,
          });
        }
      } else {
        insertMenuItems.push({
          label: insertMenuSpec.label,
          description: insertMenuSpec.description,
          icon: insertMenuSpec.icon,
          command: insertMenuSpec.command(node, editorSchema),
          forToolbar: insertMenuSpec.forToolbar,
        });
      }
    }
  }

  // TODO: keep "bullet list" and "ordered list" together
  editorSchema.insertMenuItems = insertMenuItems
    .sort((a, b) => a.label.localeCompare(b.label))
    .map((item, i) => ({ ...item, id: i.toString() }));

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
