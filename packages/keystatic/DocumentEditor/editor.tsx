import {
  Editor,
  NodeEntry,
  Path,
  Transforms,
  Text,
  Node,
  Element,
  createEditor,
  Descendant,
} from 'slate';
import { ComponentBlock } from '../src';
import { withCodeBlock } from './code-block/with-code-block';
import { withComponentBlocks } from './component-blocks/with-component-blocks';
import { DocumentFeatures } from './document-features';
import { withDocumentFeaturesNormalization } from './document-features-normalization';
import { withLayouts } from './layouts/with-layouts';
import { withLink } from './link/with-link';
import { withList } from './lists/with-list';
import { withParagraphs } from './paragraphs';
import { withTable } from './table/with-table';

export function createDocumentEditorForNormalization(
  documentFeatures: DocumentFeatures,
  componentBlocks: Record<string, ComponentBlock>
) {
  return _createDocumentEditor(
    createEditor(),
    documentFeatures,
    componentBlocks
  );
}

export function _createDocumentEditor(
  baseEditor: Editor,
  documentFeatures: DocumentFeatures,
  componentBlocks: Record<string, ComponentBlock>
) {
  return withBlocksSchema(
    withParagraphs(
      withLink(
        documentFeatures,
        componentBlocks,
        withList(
          withTable(
            withComponentBlocks(
              componentBlocks,
              documentFeatures,

              withVoidElements(
                withLayouts(
                  withCodeBlock(
                    documentFeatures,
                    componentBlocks,
                    withDocumentFeaturesNormalization(
                      documentFeatures,
                      baseEditor
                    )
                  )
                )
              )
            )
          )
        )
      )
    )
  );
}

function withVoidElements(editor: Editor): Editor {
  const { isVoid } = editor;
  editor.isVoid = node => {
    return node.type === 'divider' || node.type === 'image' || isVoid(node);
  };
  return editor;
}

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
    ...Block['type'][]
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

// a user land version of https://github.com/microsoft/TypeScript/issues/47920
function satisfies<Base>() {
  return function <Specific extends Base>(value: Specific) {
    return value;
  };
}

type EditorSchema = typeof editorSchema;

export const editorSchema = satisfies<
  Record<Block['type'] | 'editor', BlockContainerSchema | InlineContainerSchema>
>()({
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
    allowedChildren: [...paragraphLike, 'component-block'],
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
});

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

function withBlocksSchema(editor: Editor): Editor {
  const { normalizeNode } = editor;
  editor.normalizeNode = ([node, path]) => {
    if (!Text.isText(node) && node.type !== 'link') {
      const nodeType = Editor.isEditor(node) ? 'editor' : node.type;
      if (
        typeof nodeType !== 'string' ||
        editorSchema[nodeType] === undefined
      ) {
        Transforms.unwrapNodes(editor, { at: path });
        return;
      }
      const info = editorSchema[nodeType];

      if (
        info.kind === 'blocks' &&
        node.children.length !== 0 &&
        node.children.every(child => !isBlock(child))
      ) {
        Transforms.wrapNodes(
          editor,
          { type: info.blockToWrapInlinesIn, children: [] },
          { at: path, match: node => !isBlock(node) }
        );
        return;
      }
      let didUpdate = false;
      for (const [index, childNode] of [...node.children.entries()].reverse()) {
        const childPath = [...path, index];
        if (info.kind === 'inlines') {
          if (!Text.isText(childNode) && isBlock(childNode)) {
            handleNodeInInvalidPosition(editor, [childNode, childPath], path);
            didUpdate = true;
            continue;
          }
        } else {
          if (!isBlock(childNode)) {
            Transforms.wrapNodes(
              editor,
              { type: info.blockToWrapInlinesIn, children: [] },
              { at: childPath }
            );
            didUpdate = true;
            continue;
          }
          if (!info.allowedChildren.has(childNode.type)) {
            handleNodeInInvalidPosition(editor, [childNode, childPath], path);
            didUpdate = true;
            continue;
          }
        }
      }
      if (didUpdate) {
        return;
      }
    }
    normalizeNode([node, path]);
  };
  return editor;
}

function handleNodeInInvalidPosition(
  editor: Editor,
  [node, path]: NodeEntry<Block>,
  ancestorPath: Path
) {
  const nodeType = node.type;
  const childNodeInfo = editorSchema[nodeType];
  // the parent of a block will never be an inline so this casting is okay
  const ancestorNode = Node.get(editor, ancestorPath) as Block | Editor;

  const parentNodeType = Editor.isEditor(ancestorNode)
    ? 'editor'
    : ancestorNode.type;

  const parentNodeInfo = editorSchema[parentNodeType];

  if (!childNodeInfo || childNodeInfo.invalidPositionHandleMode === 'unwrap') {
    if (
      parentNodeInfo.kind === 'blocks' &&
      parentNodeInfo.blockToWrapInlinesIn
    ) {
      Transforms.setNodes(
        editor,
        {
          type: parentNodeInfo.blockToWrapInlinesIn,
          ...(Object.fromEntries(
            Object.keys(node)
              .filter(key => key !== 'type' && key !== 'children')
              .map(key => [key, null])
          ) as any), // the Slate types don't understand that null is allowed and it will unset properties with setNodes
        },
        { at: path }
      );
      return;
    }
    Transforms.unwrapNodes(editor, { at: path });
    return;
  }

  const info = editorSchema[ancestorNode.type || 'editor'];
  if (info?.kind === 'blocks' && info.allowedChildren.has(nodeType)) {
    if (ancestorPath.length === 0) {
      Transforms.moveNodes(editor, { at: path, to: [path[0] + 1] });
    } else {
      Transforms.moveNodes(editor, { at: path, to: Path.next(ancestorPath) });
    }
    return;
  }
  if (Editor.isEditor(ancestorNode)) {
    Transforms.moveNodes(editor, { at: path, to: [path[0] + 1] });
    Transforms.unwrapNodes(editor, { at: [path[0] + 1] });
    return;
  }
  handleNodeInInvalidPosition(editor, [node, path], ancestorPath.slice(0, -1));
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
