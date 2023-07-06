import { EditorView } from 'prosemirror-view';
import { EditorState } from 'prosemirror-state';
import { Ref, forwardRef } from 'react';
import { Box } from '@keystar/ui/layout';
import { css } from '@emotion/css';
import { tokenSchema } from '@keystar/ui/style';
import { Toolbar } from './Toolbar';
import { prosemirrorStyles } from './utils';
import { EditorPopoverDecoration } from './popovers';
import { ProseMirrorEditable, ProseMirrorEditor } from './editor-view';
import { AutocompleteDecoration } from './autocomplete/decoration';

const orderedListStyles = ['lower-roman', 'decimal', 'lower-alpha'];
const unorderedListStyles = ['square', 'disc', 'circle'];

let styles: any = {};

let listDepth = 10;

while (listDepth--) {
  let arr = Array.from({ length: listDepth });
  if (arr.length) {
    styles[arr.map(() => `ol`).join(' ')] = {
      listStyle: orderedListStyles[listDepth % 3],
    };
    styles[arr.map(() => `ul`).join(' ')] = {
      listStyle: unorderedListStyles[listDepth % 3],
    };
  }
}

const editableStyles = css({
  ...styles,
  outline: 0,
  flex: 1,
  minHeight: tokenSchema.size.scale[2000],
  padding: tokenSchema.size.space.medium,
  height: 'auto',
  minWidth: 0,
  fontFamily: tokenSchema.typography.fontFamily.base,
  fontSize: tokenSchema.fontsize.text.regular.size,
  lineHeight: 1.4,
  a: {
    color: tokenSchema.color.foreground.accent,
  },
  color: tokenSchema.color.foreground.neutral,
});

export const Editor = forwardRef(function Editor(
  props: {
    value: EditorState;
    onChange: (state: EditorState) => void;
  },
  ref: Ref<{ view: EditorView | null }>
) {
  return (
    <ProseMirrorEditor value={props.value} onChange={props.onChange} ref={ref}>
      <Box
        backgroundColor="canvas"
        border="neutral"
        borderRadius="medium"
        minWidth={0}
        UNSAFE_className={prosemirrorStyles}
      >
        <Toolbar />
        <ProseMirrorEditable className={editableStyles} />
      </Box>
      <EditorPopoverDecoration state={props.value} />
      <AutocompleteDecoration />
    </ProseMirrorEditor>
  );
});
