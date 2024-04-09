import { history } from 'prosemirror-history';
import { keymap } from 'prosemirror-keymap';
import { Mark, Node } from 'prosemirror-model';
import { EditorState, Selection } from 'prosemirror-state';
import { tableEditing } from 'prosemirror-tables';

import { tokenSchema } from '@keystar/ui/style';

import { autocompleteDecoration } from './autocomplete/decoration';
import { codeBlockSyntaxHighlighting } from './code-block-highlighting';
import { keymapForSchema } from './commands/keymap';
import { dropCursor } from './dropcursor';
import { gapCursor } from './gapcursor';
import { imageDropPlugin } from './images';
import { inputRules } from './inputrules/inputrules';
import {
  enterInputRulesForSchema,
  inputRulesForSchema,
} from './inputrules/rules';
import { keydownHandler } from './keydown';
import { pasteLinks } from './links';
import { markdocClipboard } from './markdoc/clipboard';
import { nodeInSelectionDecorations } from './node-in-selection';
import { placeholderPlugin } from './placeholder';
import { tableCellMenuPlugin } from './popovers/table';
import { reactNodeViews } from './react-node-views';
import { getEditorSchema } from './schema';
import { ySyncPlugin, yCursorPlugin, yUndoPlugin } from 'y-prosemirror';
import { Awareness } from 'y-protocols/awareness.js';
import * as Y from 'yjs';

const cursorBuilder = (user: any) => {
  const cursor = document.createElement('span');
  cursor.classList.add('ProseMirror-yjs-cursor');
  cursor.style.borderColor = user.color;
  const userDiv = document.createElement('div');
  userDiv.style.backgroundColor = user.color;
  userDiv.insertBefore(document.createTextNode(user.name), null);
  cursor.insertBefore(userDiv, null);
  return cursor;
};

export function createEditorState(
  doc: Node,
  selection?: Selection,
  storedMarks?: readonly Mark[] | null,
  yXmlFragment?: Y.XmlFragment,
  awareness?: Awareness
) {
  const schema = getEditorSchema(doc.type.schema);
  return EditorState.create({
    selection,
    storedMarks,
    plugins: [
      pasteLinks(schema),
      imageDropPlugin(schema),
      keydownHandler(),
      ...(yXmlFragment && awareness
        ? [
            ySyncPlugin(yXmlFragment),
            yCursorPlugin(awareness, {
              cursorBuilder,
              awarenessStateFilter(userClientId, clientId, awarenessState) {
                const localState = awareness.getLocalState();
                return (
                  userClientId !== clientId &&
                  awarenessState.location === localState?.location &&
                  awarenessState.branch === localState?.branch
                );
              },
            }),
            yUndoPlugin(),
          ]
        : [history()]),
      dropCursor({
        color: tokenSchema.color.alias.borderSelected,
        width: 2,
      }),
      inputRules({
        rules: inputRulesForSchema(schema),
        enterRules: enterInputRulesForSchema(schema),
      }),
      gapCursor(),
      keymap(keymapForSchema(schema, !!(yXmlFragment && awareness))),
      markdocClipboard(),
      nodeInSelectionDecorations(),
      placeholderPlugin('Start writing or press "/" for commands…'),
      reactNodeViews(doc.type.schema),
      autocompleteDecoration(),
      tableEditing(),
      tableCellMenuPlugin(),
      codeBlockSyntaxHighlighting(),
    ],
    doc,
  });
}
