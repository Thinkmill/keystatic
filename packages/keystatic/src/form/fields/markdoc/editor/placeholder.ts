import { Plugin } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';

import { classes } from './utils';

export function placeholderPlugin(text: string) {
  return new Plugin({
    props: {
      decorations(state) {
        let doc = state.doc;
        if (
          doc.childCount === 1 &&
          doc.firstChild?.isTextblock &&
          doc.firstChild.content.size === 0
        ) {
          return DecorationSet.create(doc, [
            Decoration.node(0, doc.firstChild.nodeSize, {
              class: classes.placeholder,
              'data-placeholder': text,
            }),
          ]);
        }
      },
    },
  });
}
