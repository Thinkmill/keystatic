import { Plugin } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';

import { classes } from './utils';

export function placeholderPlugin(text: string) {
  return new Plugin({
    props: {
      decorations(state) {
        if (
          state.doc.childCount === 1 &&
          state.doc.firstChild?.isTextblock &&
          state.doc.firstChild.content.size === 0
        ) {
          let placeholder = document.createElement('span');
          placeholder.className = classes.placeholder;
          placeholder.contentEditable = 'false'; // 1
          placeholder.textContent = text;

          return DecorationSet.create(state.doc, [
            Decoration.widget(1, bookendWithZeroWidthSpace(placeholder), {
              // undocumented prop on `WidgetViewDesc` that stops the decoration
              // from being wrapped with a contenteditable=false span.
              // note:
              //   1. we must add the contenteditable=false attr ourselves
              //   2. this is a private API and may break in future versions
              // see:
              //   - https://github.com/ProseMirror/prosemirror-view/blob/master/src/viewdesc.ts
              raw: true,
            }),
          ]);
        }
      },
    },
  });
}

// firefox bug where the cursor is hidden when beside `contenteditable=false`
// - https://discuss.prosemirror.net/t/firefox-contenteditable-false-cursor-bug/5016
// - https://bugzilla.mozilla.org/show_bug.cgi?id=1612076
function bookendWithZeroWidthSpace(element: HTMLElement) {
  let wrapper = document.createElement('span');
  wrapper.appendChild(document.createTextNode('\u200b'));
  wrapper.appendChild(element);
  wrapper.appendChild(document.createTextNode('\u200b'));
  return wrapper;
}
