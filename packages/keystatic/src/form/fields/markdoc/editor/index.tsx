import { EditorView } from 'prosemirror-view';
import { EditorState } from 'prosemirror-state';
import { Ref, forwardRef, useId, useMemo } from 'react';
import { Box } from '@keystar/ui/layout';
import { useProseStyleProps } from '@keystar/ui/typography';
import {
  breakpointQueries,
  css,
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
import { EditorFooter } from './editor-footer';

const contentStyles = css({
  flex: 1,
  height: 'auto',
  minHeight: tokenSchema.size.scale[2000],
  minWidth: 0,
  outline: 0,
  padding: tokenSchema.size.space.medium,

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
  const styleProps = useProseStyleProps({
    size: entryLayoutPane === 'main' ? 'medium' : 'regular',
    UNSAFE_className: contentStyles,
    ...toDataAttributes({ layout: entryLayoutPane, container: containerSize }),
  });

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
            {...styleProps}
            role="textbox"
            aria-multiline="true"
            id={getContentId(id)}
            data-keystatic-editor="content"
          />
          <EditorFooter />
        </Box>
        <NodeViews state={value} />
        <CellMenuPortal />
        <EditorPopoverDecoration state={value} />
        <AutocompleteDecoration />
      </ProseMirrorEditor>
    </EditorContextProvider>
  );
});
