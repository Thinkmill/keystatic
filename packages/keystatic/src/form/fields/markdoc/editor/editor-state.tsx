import { EditorState, Selection } from 'prosemirror-state';
import { history } from 'prosemirror-history';
import { keymap } from 'prosemirror-keymap';
import { tableEditing } from 'prosemirror-tables';
import { inputRules } from './inputrules/inputrules';
import { Mark, Node } from 'prosemirror-model';
import { getEditorSchema } from './schema';
import {
  enterInputRulesForSchema,
  inputRulesForSchema,
} from './inputrules/rules';
import { keymapForSchema } from './commands/keymap';
import { markdocClipboard } from './markdoc/clipboard';
import { nodeInSelectionDecorations } from './node-in-selection';
import { autocompleteDecoration } from './autocomplete/decoration';
import { keydownHandler } from './keydown';
import { gapCursor } from './gapcursor';
import { attributes } from './attributes';
import { dropCursor } from './dropcursor';
import { codeBlockSyntaxHighlighting } from './code-block-highlighting';
import { reactNodeViews } from './react-node-views';
import { tableCellMenuPlugin } from './popovers/table';
import { pasteLinks } from './links';
import { imageDropPlugin } from './images';

export function createEditorState(
  doc: Node,
  selection?: Selection,
  storedMarks?: readonly Mark[] | null
) {
  const schema = getEditorSchema(doc.type.schema);
  return EditorState.create({
    selection,
    storedMarks,
    plugins: [
      pasteLinks(schema),
      imageDropPlugin(schema),
      keydownHandler(),
      history(),
      dropCursor(),
      inputRules({
        rules: inputRulesForSchema(schema),
        enterRules: enterInputRulesForSchema(schema),
      }),
      attributes(),
      gapCursor(),
      keymap(keymapForSchema(schema)),
      markdocClipboard(),
      nodeInSelectionDecorations(),
      reactNodeViews(doc.type.schema),
      autocompleteDecoration(),
      tableEditing(),
      tableCellMenuPlugin(),
      codeBlockSyntaxHighlighting(),
    ],
    doc,
  });
}
