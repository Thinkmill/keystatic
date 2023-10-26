import { Node, Element, Descendant } from 'slate';

export type Block = Exclude<Element, { type: 'link' }>;

type BlockContainerSchema = {
  kind: 'blocks';
  allowedChildren: ReadonlySet<Element['type']>;
  blockToWrapInlinesIn: TypesWhichHaveNoExtraRequiredProps;
  invalidPositionHandleMode: 'unwrap' | 'move';
};

type InlineContainerSchema = {
  kind: 'inlines';
  invalidPositionHandleMode: 'unwrap' | 'move';
};

type TypesWhichHaveNoExtraRequiredProps = {
  [Type in Block['type']]: {
    type: Type;
    children: Descendant[];
  } extends Block & { type: Type }
    ? Type
    : never;
}[Block['type']];

const tableCellChildren = [
  'paragraph',
  'code',
  'heading',
  'ordered-list',
  'unordered-list',
  'divider',
  'image',
] as const;

const blockquoteChildren = [...tableCellChildren, 'table'] as const;

const paragraphLike = [...blockquoteChildren, 'blockquote'] as const;

const insideOfLayouts = [...paragraphLike, 'component-block'] as const;

function blockContainer(args: {
  allowedChildren: readonly [
    TypesWhichHaveNoExtraRequiredProps,
    ...Block['type'][],
  ];
  invalidPositionHandleMode: 'unwrap' | 'move';
}): BlockContainerSchema {
  return {
    kind: 'blocks',
    allowedChildren: new Set(args.allowedChildren),
    blockToWrapInlinesIn: args.allowedChildren[0],
    invalidPositionHandleMode: args.invalidPositionHandleMode,
  };
}

function inlineContainer(args: {
  invalidPositionHandleMode: 'unwrap' | 'move';
}): InlineContainerSchema {
  return {
    kind: 'inlines',
    invalidPositionHandleMode: args.invalidPositionHandleMode,
  };
}

type EditorSchema = typeof editorSchema;

export const editorSchema = {
  editor: blockContainer({
    allowedChildren: [...insideOfLayouts, 'layout'],
    invalidPositionHandleMode: 'move',
  }),
  layout: blockContainer({
    allowedChildren: ['layout-area'],
    invalidPositionHandleMode: 'move',
  }),
  'layout-area': blockContainer({
    allowedChildren: insideOfLayouts,
    invalidPositionHandleMode: 'unwrap',
  }),
  blockquote: blockContainer({
    allowedChildren: blockquoteChildren,
    invalidPositionHandleMode: 'move',
  }),
  paragraph: inlineContainer({ invalidPositionHandleMode: 'unwrap' }),
  code: inlineContainer({ invalidPositionHandleMode: 'move' }),
  divider: inlineContainer({ invalidPositionHandleMode: 'move' }),
  heading: inlineContainer({ invalidPositionHandleMode: 'unwrap' }),
  'component-block': blockContainer({
    allowedChildren: ['component-block-prop', 'component-inline-prop'],
    invalidPositionHandleMode: 'move',
  }),
  'component-inline-prop': inlineContainer({
    invalidPositionHandleMode: 'unwrap',
  }),
  'component-block-prop': blockContainer({
    allowedChildren: insideOfLayouts,
    invalidPositionHandleMode: 'unwrap',
  }),
  'ordered-list': blockContainer({
    allowedChildren: ['list-item'],
    invalidPositionHandleMode: 'move',
  }),
  'unordered-list': blockContainer({
    allowedChildren: ['list-item'],
    invalidPositionHandleMode: 'move',
  }),
  'list-item': blockContainer({
    allowedChildren: ['list-item-content', 'ordered-list', 'unordered-list'],
    invalidPositionHandleMode: 'unwrap',
  }),
  'list-item-content': inlineContainer({ invalidPositionHandleMode: 'unwrap' }),
  image: inlineContainer({ invalidPositionHandleMode: 'move' }),
  table: blockContainer({
    invalidPositionHandleMode: 'move',
    allowedChildren: ['table-head', 'table-body'],
  }),
  'table-body': blockContainer({
    invalidPositionHandleMode: 'move',
    allowedChildren: ['table-row'],
  }),
  'table-row': blockContainer({
    invalidPositionHandleMode: 'move',
    allowedChildren: ['table-cell'],
  }),
  'table-cell': blockContainer({
    invalidPositionHandleMode: 'move',
    allowedChildren: tableCellChildren,
  }),
  'table-head': blockContainer({
    invalidPositionHandleMode: 'move',
    allowedChildren: ['table-row'],
  }),
} satisfies Record<
  Block['type'] | 'editor',
  BlockContainerSchema | InlineContainerSchema
>;

type InlineContainingType = {
  [Key in keyof EditorSchema]: {
    inlines: Key;
    blocks: never;
  }[EditorSchema[Key]['kind']];
}[keyof EditorSchema];

const inlineContainerTypes = new Set(
  Object.entries(editorSchema)
    .filter(([, value]) => value.kind === 'inlines')
    .map(([type]) => type)
);

export function isInlineContainer(
  node: Node
): node is Block & { type: InlineContainingType } {
  return node.type !== undefined && inlineContainerTypes.has(node.type);
}

const blockTypes: Set<string | undefined> = new Set(
  Object.keys(editorSchema).filter(x => x !== 'editor')
);

export function isBlock(node: Node): node is Block {
  return blockTypes.has(node.type);
}

// to print the editor schema in Graphviz if you want to visualize it
// function printEditorSchema(editorSchema: EditorSchema) {
//   return `digraph G {
//   concentrate=true;
//   ${Object.keys(editorSchema)
//     .map(key => {
//       let val = editorSchema[key];
//       if (val.kind === 'inlines') {
//         return `"${key}" -> inlines`;
//       }
//       if (val.kind === 'blocks') {
//         return `"${key}" -> {${[...val.allowedChildren].map(x => JSON.stringify(x)).join(' ')}}`;
//       }
//     })
//     .join('\n  ')}
// }`;
// }
