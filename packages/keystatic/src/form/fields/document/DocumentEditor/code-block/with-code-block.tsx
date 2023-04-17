import {
  Editor,
  Transforms,
  Element,
  Text as SlateText,
  Range,
  Point,
  NodeEntry,
} from 'slate';
import { Block, isBlock } from '../editor';
import { DocumentFeatures } from '../document-features';
import { getAncestorComponentChildFieldDocumentFeatures } from '../utils';
import { ComponentBlock } from '../../../../api';
import { aliasesToCanonicalName } from './languages';

const codeBlockShortcutPattern = /^```(\w+)? ?$/;

export function withCodeBlock(
  documentFeatures: DocumentFeatures,
  componentBlocks: Record<string, ComponentBlock>,
  editor: Editor
): Editor {
  const { insertBreak, normalizeNode, insertText } = editor;

  function codeBlockShortcut(block: NodeEntry<Block> | undefined): boolean {
    if (
      block?.[0].type !== 'paragraph' ||
      block[0].children.length !== 1 ||
      block[0].children[0].type !== undefined
    ) {
      return false;
    }

    const match = codeBlockShortcutPattern.exec(block[0].children[0].text);
    if (!match) {
      return false;
    }
    const locationDocumentFeatures =
      getAncestorComponentChildFieldDocumentFeatures(
        editor,
        documentFeatures,
        componentBlocks
      );
    if (
      locationDocumentFeatures &&
      (locationDocumentFeatures.kind === 'inline' ||
        !locationDocumentFeatures.documentFeatures.formatting.blockTypes.code)
    ) {
      return false;
    }

    // so that this starts a new undo group
    editor.history.undos.push({
      operations: [],
      selectionBefore: editor.selection,
    });
    Transforms.select(editor, block[1]);
    Transforms.delete(editor);
    Transforms.wrapNodes(
      editor,
      {
        type: 'code',
        ...(match[1]
          ? {
              language:
                aliasesToCanonicalName.get(match[1].toLowerCase()) ?? match[1],
            }
          : {}),
        children: [],
      },
      { match: node => node.type === 'paragraph' }
    );
    return true;
  }

  editor.insertBreak = () => {
    const block = Editor.above(editor, {
      match: isBlock,
    });
    if (block?.[0].type === 'code' && SlateText.isText(block[0].children[0])) {
      const text = block[0].children[0].text;
      if (
        text[text.length - 1] === '\n' &&
        editor.selection &&
        Range.isCollapsed(editor.selection) &&
        Point.equals(Editor.end(editor, block[1]), editor.selection.anchor)
      ) {
        insertBreak();
        Transforms.setNodes(editor, { type: 'paragraph', children: [] });
        Transforms.delete(editor, {
          distance: 1,
          at: { path: [...block[1], 0], offset: text.length - 1 },
        });
        return;
      }
      editor.insertText('\n');
      return;
    }
    if (
      editor.selection &&
      Range.isCollapsed(editor.selection) &&
      codeBlockShortcut(block)
    ) {
      return;
    }
    insertBreak();
  };

  editor.insertText = text => {
    insertText(text);
    if (
      text === ' ' &&
      editor.selection &&
      Range.isCollapsed(editor.selection)
    ) {
      codeBlockShortcut(
        Editor.above(editor, {
          match: isBlock,
        })
      );
    }
  };
  editor.normalizeNode = ([node, path]) => {
    if (node.type === 'code' && Element.isElement(node)) {
      for (const [index, childNode] of node.children.entries()) {
        if (!SlateText.isText(childNode)) {
          if (editor.isVoid(childNode)) {
            Transforms.removeNodes(editor, { at: [...path, index] });
          } else {
            Transforms.unwrapNodes(editor, { at: [...path, index] });
          }
          return;
        }
        const marks = Object.keys(childNode).filter(x => x !== 'text');
        if (marks.length) {
          Transforms.unsetNodes(editor, marks, { at: [...path, index] });
          return;
        }
      }
    }
    normalizeNode([node, path]);
  };

  return editor;
}
