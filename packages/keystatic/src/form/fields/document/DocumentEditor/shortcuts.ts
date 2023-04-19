import { Range, Editor, Transforms, Path } from 'slate';
import { isBlock } from './editor';

export const shortcuts: Record<string, string> = {
  '...': '…',
  '-->': '→',
  '->': '→',
  '<-': '←',
  '<--': '←',
  '--': '–',
};

export function withShortcuts(editor: Editor): Editor {
  const { insertText } = editor;
  editor.insertText = text => {
    insertText(text);
    if (
      text === ' ' &&
      editor.selection &&
      Range.isCollapsed(editor.selection)
    ) {
      const selectionPoint = editor.selection.anchor;
      const ancestorBlock = Editor.above(editor, {
        match: isBlock,
      });
      if (ancestorBlock) {
        Object.keys(shortcuts).forEach(shortcut => {
          const pointBefore = Editor.before(editor, selectionPoint, {
            unit: 'character',
            distance: shortcut.length + 1,
          });
          if (
            pointBefore &&
            Path.isDescendant(pointBefore.path, ancestorBlock[1])
          ) {
            const range = { anchor: selectionPoint, focus: pointBefore };
            const str = Editor.string(editor, range);
            if (str.slice(0, shortcut.length) === shortcut) {
              editor.history.undos.push({
                operations: [],
                selectionBefore: editor.selection,
              });
              Transforms.select(editor, range);
              editor.insertText(shortcuts[shortcut] + ' ');
            }
          }
        });
      }
    }
  };
  return editor;
}
