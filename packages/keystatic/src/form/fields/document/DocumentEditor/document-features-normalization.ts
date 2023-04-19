import { Text, Transforms, Element, NodeEntry, Editor, Node } from 'slate';
import { DocumentFeatures } from './document-features';

export function areArraysEqual(a: readonly unknown[], b: readonly unknown[]) {
  return a.length === b.length && a.every((x, i) => x === b[i]);
}

export function normalizeTextBasedOnInlineMarksAndSoftBreaks(
  [node, path]: NodeEntry<Text>,
  editor: Editor,
  inlineMarks: DocumentFeatures['formatting']['inlineMarks'],
  softBreaks: boolean
): boolean {
  const marksToRemove = Object.keys(node).filter(
    x => x !== 'text' && x !== 'insertMenu' && (inlineMarks as any)[x] !== true
  );
  if (marksToRemove.length) {
    Transforms.unsetNodes(editor, marksToRemove, { at: path });
    return true;
  }
  if (!softBreaks) {
    const hasSoftBreaks = node.text.includes('\n');
    if (hasSoftBreaks) {
      const [parentNode] = Editor.parent(editor, path);
      if (parentNode.type !== 'code') {
        for (const position of Editor.positions(editor, { at: path })) {
          const character = (Node.get(editor, position.path) as Text).text[
            position.offset
          ];
          if (character === '\n') {
            Transforms.delete(editor, { at: position });
            return true;
          }
        }
      }
    }
  }

  return false;
}

export type DocumentFeaturesForNormalization = Omit<
  DocumentFeatures,
  'formatting'
> & {
  formatting: Omit<
    DocumentFeatures['formatting'],
    'inlineMarks' | 'softBreaks'
  >;
};

export function normalizeInlineBasedOnLinks(
  [node, path]: NodeEntry<Element>,
  editor: Editor,
  links: boolean
) {
  if (node.type === 'link' && !links) {
    Transforms.insertText(editor, ` (${node.href})`, {
      at: Editor.end(editor, path),
    });
    Transforms.unwrapNodes(editor, { at: path });
    return true;
  }
  return false;
}

export function normalizeElementBasedOnDocumentFeatures(
  [node, path]: NodeEntry<Element>,
  editor: Editor,
  {
    formatting,
    dividers,
    layouts,
    links,
    images,
    tables,
  }: DocumentFeaturesForNormalization
): boolean {
  if (
    (node.type === 'heading' &&
      (!formatting.headings.levels.length ||
        !formatting.headings.levels.includes(node.level))) ||
    (node.type === 'ordered-list' && !formatting.listTypes.ordered) ||
    (node.type === 'unordered-list' && !formatting.listTypes.unordered) ||
    (node.type === 'code' && !formatting.blockTypes.code) ||
    (node.type === 'blockquote' && !formatting.blockTypes.blockquote) ||
    (node.type === 'image' && !images) ||
    (node.type === 'table' && !tables) ||
    (node.type === 'layout' &&
      (layouts.length === 0 ||
        !layouts.some(layout => areArraysEqual(layout, node.layout))))
  ) {
    Transforms.unwrapNodes(editor, { at: path });
    return true;
  }
  if (
    (node.type === 'paragraph' || node.type === 'heading') &&
    ((!formatting.alignment.center && node.textAlign === 'center') ||
      (!formatting.alignment.end && node.textAlign === 'end') ||
      ('textAlign' in node &&
        node.textAlign !== 'center' &&
        node.textAlign !== 'end'))
  ) {
    Transforms.unsetNodes(editor, 'textAlign', { at: path });
    return true;
  }
  if (node.type === 'divider' && !dividers) {
    Transforms.removeNodes(editor, { at: path });
    return true;
  }

  return normalizeInlineBasedOnLinks([node, path], editor, links);
}

export function withDocumentFeaturesNormalization(
  documentFeatures: DocumentFeatures,
  editor: Editor
): Editor {
  const { normalizeNode } = editor;
  editor.normalizeNode = ([node, path]) => {
    if (Text.isText(node)) {
      normalizeTextBasedOnInlineMarksAndSoftBreaks(
        [node, path],
        editor,
        documentFeatures.formatting.inlineMarks,
        documentFeatures.formatting.softBreaks
      );
    } else if (Element.isElement(node)) {
      normalizeElementBasedOnDocumentFeatures(
        [node, path],
        editor,
        documentFeatures
      );
    }
    normalizeNode([node, path]);
  };
  return editor;
}
