import { Plugin } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';

import { classes } from './utils';
import {
  defaultStringFormatter,
  KeystaticStringFormatter,
} from '../../../../app/l10n/default-formatter';

export function placeholderPlugin() {
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
            Decoration.widget(1, view => {
              // the formatter for the current locale is passed by useEditorView
              const stringFormatter: KeystaticStringFormatter =
                (view.props as any).stringFormatter ?? defaultStringFormatter;
              let placeholder = document.createElement('span');
              placeholder.className = classes.placeholder;
              placeholder.textContent = stringFormatter.format(
                'markdocEditorPlaceholder'
              );
              return placeholder;
            }),
          ]);
        }
      },
    },
  });
}
