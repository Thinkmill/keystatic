import { EditorView } from 'prosemirror-view';
import { EditorState } from 'prosemirror-state';
import { Ref, forwardRef, useId, useMemo } from 'react';
import { Box } from '@keystar/ui/layout';
import { css } from '@emotion/css';
import {
  breakpointQueries,
  toDataAttributes,
  tokenSchema,
} from '@keystar/ui/style';
import { Toolbar } from './Toolbar';
import { prosemirrorStyles } from './utils';
import { EditorPopoverDecoration } from './popovers';
import { ProseMirrorEditable, ProseMirrorEditor } from './editor-view';
import { AutocompleteDecoration } from './autocomplete/decoration';
import { NodeViews } from './react-node-views';
import { CellMenuPortal } from './popovers/table';
import {
  EditorContextProvider,
  getContentId,
  getRootId,
  getToolbarId,
} from './context';
import { useEntryLayoutSplitPaneContext } from '../../../../app/entry-form';
import { useContentPanelSize } from '../../../../app/shell/context';

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
  fontSize: tokenSchema.typography.text.regular.size,
  lineHeight: 1.4,
  a: {
    color: tokenSchema.color.foreground.accent,
  },
  color: tokenSchema.color.foreground.neutral,
  '&[data-layout="main"]': {
    boxSizing: 'border-box',
    height: '100%',
    padding: 0,
    paddingTop: tokenSchema.size.space.medium,
    minHeight: 0,
    minWidth: 0,
    maxWidth: 800,
    marginInline: 'auto',

    [breakpointQueries.above.mobile]: {
      padding: tokenSchema.size.space.xlarge,
    },
    [breakpointQueries.above.tablet]: {
      padding: tokenSchema.size.space.xxlarge,
    },

    '&[data-container="wide"]': {
      padding: tokenSchema.size.scale[600],
    },
  },
});

export const Editor = forwardRef(function Editor(
  {
    value,
    onChange,
    ...props
  }: {
    value: EditorState;
    onChange: (state: EditorState) => void;
  },
  ref: Ref<{ view: EditorView | null }>
) {
  let entryLayoutPane = useEntryLayoutSplitPaneContext();
  const containerSize = useContentPanelSize();

  const id = useId();
  const editorContext = useMemo(() => ({ id }), [id]);
  return (
    <EditorContextProvider value={editorContext}>
      <ProseMirrorEditor value={value} onChange={onChange} ref={ref}>
        <Box
          id={getRootId(id)}
          data-keystatic-editor="root"
          data-layout={entryLayoutPane}
          backgroundColor="canvas"
          minWidth={0}
          UNSAFE_className={css(prosemirrorStyles, {
            '&[data-layout="main"]': {
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
            },
            '&:not([data-layout="main"])': {
              border: `${tokenSchema.size.border.regular} solid ${tokenSchema.color.border.neutral}`,
              borderRadius: tokenSchema.size.radius.medium,
            },
          })}
        >
          <Toolbar id={getToolbarId(id)} data-keystatic-editor="toolbar" />
          <ProseMirrorEditable
            {...props}
            role="textbox"
            aria-multiline="true"
            id={getContentId(id)}
            data-keystatic-editor="content"
            className={editableStyles}
            {...toDataAttributes({
              layout: entryLayoutPane,
              container: containerSize,
            })}
          />
        </Box>
        <NodeViews state={value} />
        <CellMenuPortal />
        <EditorPopoverDecoration state={value} />
        <AutocompleteDecoration />
      </ProseMirrorEditor>
    </EditorContextProvider>
  );
});
