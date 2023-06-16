'use client';
import { EditorState, Selection } from 'prosemirror-state';
import { history } from 'prosemirror-history';
import { keymap } from 'prosemirror-keymap';
import { inputRules } from './inputrules/inputrules';
import { Mark, Node } from 'prosemirror-model';
import { getEditorSchema } from './schema';
import { inputRulesForSchema } from './inputrules/rules';
import { keymapForSchema } from './commands/keymap';
import { markdocClipboard } from './markdoc/clipboard';
import { nodeInSelectionDecorations } from './node-in-selection';
import { autocompleteDecoration } from './autocomplete/decoration';
import { keydownHandler } from './keydown';
import { gapCursor } from './gapcursor';
import { attributes } from './attributes';
import { dropCursor } from './dropcursor';

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
      keydownHandler(),
      history(),
      dropCursor(),
      inputRules({
        rules: inputRulesForSchema(schema),
      }),
      attributes(),
      gapCursor(),
      keymap(keymapForSchema(schema)),
      markdocClipboard(),
      nodeInSelectionDecorations(),
      autocompleteDecoration(),
    ],
    doc,
  });
}
