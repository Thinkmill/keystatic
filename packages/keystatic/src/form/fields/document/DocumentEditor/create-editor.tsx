import {
  createEditor,
  Editor,
  NodeEntry,
  Path,
  Transforms,
  Text,
  Node,
} from 'slate';
import { ComponentBlock } from '../../../..';
import { DocumentFeatures } from './document-features';

import { withCodeBlock } from './code-block/with-code-block';
import { withComponentBlocks } from './component-blocks/with-component-blocks';
import { withDocumentFeaturesNormalization } from './document-features-normalization';
import { withLayouts } from './layouts/with-layouts';
import { withLink } from './link/with-link';
import { withList } from './lists/with-list';
import { withParagraphs } from './paragraphs';
import { withTable } from './table/with-table';
import { editorSchema, isBlock, Block } from './editor';

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

export function withBlocksSchema(editor: Editor): Editor {
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

function withVoidElements(editor: Editor): Editor {
  const { isVoid } = editor;
  editor.isVoid = node => {
    return node.type === 'divider' || node.type === 'image' || isVoid(node);
  };
  return editor;
}
