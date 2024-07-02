import Prism from './prism';
import {
  KeyboardEvent,
  ReactNode,
  useContext,
  useCallback,
  useMemo,
  createContext,
} from 'react';
import { isHotkey } from 'is-hotkey';
import {
  Editor,
  Node,
  Range,
  Transforms,
  createEditor,
  NodeEntry,
  Element,
  Text,
  Descendant,
  Path,
} from 'slate';
import { Editable, ReactEditor, Slate, useSlate, withReact } from 'slate-react';
import { EditableProps } from 'slate-react/dist/components/editable';

import {
  breakpointQueries,
  classNames,
  css,
  toDataAttributes,
  tokenSchema,
} from '@keystar/ui/style';
import { Prose } from '@keystar/ui/typography';

import { useEntryLayoutSplitPaneContext } from '../../../../app/entry-form';
import { useContentPanelSize } from '../../../../app/shell/context';
import { ComponentBlock } from '../../../api';
import { DocumentFeatures } from './document-features';
import { wrapLink } from './link/link';
import { clearFormatting, Mark, nodeTypeMatcher } from './utils';
import { Toolbar } from './Toolbar';
import { renderElement } from './render-element';
import { nestList, unnestList } from './lists/lists';
import { getPlaceholderTextForPropPath } from './component-blocks/utils';
import { renderLeaf } from './leaf';
import { ToolbarStateProvider, useDocumentEditorConfig } from './toolbar-state';
import { ActiveBlockPopoverProvider } from './primitives';
import {
  getCellPathInDirection,
  TableSelectionProvider,
} from './table/table-ui';
import { isBlock } from './editor';
import { _createDocumentEditor } from './create-editor';
import { withHistory } from 'slate-history';
import { withBlockMarkdownShortcuts } from './block-markdown-shortcuts';
import { withBlockquote } from './blockquote/with-blockquote';
import { withHeading } from './heading/with-heading';
import { withImages } from './image';
import { withInsertMenu } from './insert-menu';
import { withMarks } from './marks';
import { withPasting } from './pasting';
import { withShortcuts } from './shortcuts';
import { withSoftBreaks } from './soft-breaks';
import { getSelectedTableArea } from './table/with-table';

// the docs site needs access to Editor and importing slate would use the version from the content field
// so we're exporting it from here (note that this is not at all visible in the published version)
export { Editor } from 'slate';

const HOTKEYS: Record<string, Mark> = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
};

function isMarkActive(editor: Editor, mark: Mark) {
  const marks = Editor.marks(editor);
  if (marks?.[mark]) {
    return true;
  }
  // see the stuff about marks in toolbar-state for why this is here
  for (const entry of Editor.nodes(editor, { match: Text.isText })) {
    if (entry[0][mark]) {
      return true;
    }
  }
  return false;
}

const arrowKeyToDirection = new Map([
  ['ArrowUp', 'up' as const],
  ['ArrowDown', 'down' as const],
  ['ArrowLeft', 'left' as const],
  ['ArrowRight', 'right' as const],
]);

const getKeyDownHandler =
  (editor: Editor, documentFeatures: DocumentFeatures) =>
  (event: KeyboardEvent) => {
    if (event.defaultPrevented) return;
    for (const hotkey in HOTKEYS) {
      if (
        documentFeatures.formatting.inlineMarks[HOTKEYS[hotkey]] &&
        isHotkey(hotkey, event.nativeEvent)
      ) {
        event.preventDefault();
        const mark = HOTKEYS[hotkey];
        const isActive = isMarkActive(editor, mark);
        if (isActive) {
          Editor.removeMark(editor, mark);
        } else {
          Editor.addMark(editor, mark, true);
        }
        return;
      }
    }
    if (isHotkey('mod+\\', event.nativeEvent)) {
      clearFormatting(editor);
      return;
    }
    if (documentFeatures.links && isHotkey('mod+k', event.nativeEvent)) {
      event.preventDefault();
      wrapLink(editor, '');
      return;
    }
    if (event.key === 'Tab') {
      const didAction = event.shiftKey ? unnestList(editor) : nestList(editor);
      if (didAction) {
        event.preventDefault();
        return;
      }
    }

    if (event.key === 'Tab' && editor.selection) {
      const layoutArea = Editor.above(editor, {
        match: node =>
          node.type === 'layout-area' || node.type === 'table-cell',
      });
      if (layoutArea) {
        const layoutAreaToEnter = event.shiftKey
          ? Editor.before(editor, layoutArea[1], { unit: 'block' })
          : Editor.after(editor, layoutArea[1], { unit: 'block' });
        Transforms.setSelection(editor, {
          anchor: layoutAreaToEnter,
          focus: layoutAreaToEnter,
        });
        event.preventDefault();
      }
    }
    if (isHotkey('mod+a', event)) {
      const parentTable = Editor.above(editor, {
        match: nodeTypeMatcher('table'),
      });
      if (parentTable) {
        Transforms.select(editor, parentTable[1]);
        event.preventDefault();
        return;
      }
    }
    const direction = arrowKeyToDirection.get(event.key);
    const { selection } = editor;
    if (direction && selection) {
      const selectedTableArea = getSelectedTableArea(editor);
      if (selectedTableArea) {
        const focusCellPath = Editor.above(editor, {
          match: nodeTypeMatcher('table-cell'),
          at: selection.focus.path,
        })?.[1];
        const anchorCellPath = Editor.above(editor, {
          match: nodeTypeMatcher('table-cell'),
          at: selection.anchor.path,
        })?.[1];

        if (!focusCellPath || !anchorCellPath) return;
        const newCellPath = getCellPathInDirection(
          editor,
          focusCellPath,
          direction
        );
        if (newCellPath) {
          if (selectedTableArea.singleCell === 'not-selected') {
            if (direction !== 'up' && direction !== 'down') return;
            const [node, offset] = ReactEditor.toDOMPoint(
              editor,
              selection.focus
            );
            const blockElement = Editor.above(editor, {
              match: isBlock,
              at: selection.focus.path,
            });

            if (!blockElement) return;
            if (
              direction === 'up' &&
              blockElement[1].slice(focusCellPath.length).some(idx => idx !== 0)
            ) {
              return;
            }
            if (direction === 'down') {
              const [parentNode] = Editor.parent(editor, blockElement[1]);
              if (
                parentNode.children.length - 1 !==
                blockElement[1][blockElement[1].length - 1]
              ) {
                return;
              }
              for (const [node, path] of Node.ancestors(
                editor,
                blockElement[1],
                {
                  reverse: true,
                }
              )) {
                if (node.type === 'table-cell') break;
                const [parentNode] = Editor.parent(editor, path);
                if (parentNode.children.length - 1 === path[path.length - 1]) {
                  continue;
                }
                return;
              }
            }
            const domNodeForBlockElement = ReactEditor.toDOMNode(
              editor,
              blockElement[0]
            );
            const rangeOfWholeBlock = document.createRange();
            rangeOfWholeBlock.selectNodeContents(domNodeForBlockElement);
            const rectsOfRangeOfWholeBlock = Array.from(
              rangeOfWholeBlock.getClientRects()
            );
            const newRange = document.createRange();
            newRange.setStart(node, offset);
            newRange.setEnd(node, offset);
            const rangeRects = Array.from(newRange.getClientRects());
            const lastRangeRect = rangeRects[rangeRects.length - 1];
            const key = direction === 'up' ? 'top' : 'bottom';
            const expected =
              key === 'top'
                ? Math.min(...rectsOfRangeOfWholeBlock.map(x => x.top))
                : Math.max(...rectsOfRangeOfWholeBlock.map(x => x.bottom));
            if (lastRangeRect[key] === expected) {
              const focus = Editor[direction === 'up' ? 'end' : 'start'](
                editor,
                newCellPath
              );
              Transforms.select(editor, {
                focus,
                anchor: event.shiftKey ? selection.anchor : focus,
              });
              event.preventDefault();
            }

            return;
          }
          if (!event.shiftKey) return;

          if (Path.equals(newCellPath, anchorCellPath)) {
            Transforms.select(editor, newCellPath);
          } else {
            Transforms.select(editor, {
              anchor: selection.anchor,
              focus: Editor.start(editor, newCellPath),
            });
          }
          event.preventDefault();
        }
      }
    }
  };

export function createDocumentEditor(
  documentFeatures: DocumentFeatures,
  componentBlocks: Record<string, ComponentBlock>
) {
  return withPasting(
    withImages(
      withSoftBreaks(
        withInsertMenu(
          withShortcuts(
            withHeading(
              withBlockquote(
                withMarks(
                  documentFeatures,
                  componentBlocks,
                  withBlockMarkdownShortcuts(
                    documentFeatures,
                    componentBlocks,
                    _createDocumentEditor(
                      withHistory(withReact(createEditor())),
                      documentFeatures,
                      componentBlocks
                    )
                  )
                )
              )
            )
          )
        )
      )
    )
  );
}

export function DocumentEditor({
  onChange,
  value,
  componentBlocks,
  documentFeatures,
  ...props
}: {
  onChange: undefined | ((value: Descendant[]) => void);
  value: Descendant[];
  componentBlocks: Record<string, ComponentBlock>;
  documentFeatures: DocumentFeatures;
} & Omit<EditableProps, 'value' | 'onChange'>) {
  let entryLayoutPane = useEntryLayoutSplitPaneContext();
  const editor = useMemo(
    () => createDocumentEditor(documentFeatures, componentBlocks),
    [documentFeatures, componentBlocks]
  );

  return (
    <div
      data-layout={entryLayoutPane}
      className={classNames(
        css({
          backgroundColor: tokenSchema.color.background.canvas,
          minWidth: 0,

          '&[data-layout="main"]': {
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
          },
          '&:not([data-layout="main"])': {
            border: `${tokenSchema.size.border.regular} solid ${tokenSchema.color.border.neutral}`,
            borderRadius: tokenSchema.size.radius.medium,
          },
        }),
        'keystar-document-editor'
      )}
    >
      <DocumentEditorProvider
        componentBlocks={componentBlocks}
        documentFeatures={documentFeatures}
        editor={editor}
        value={value}
        onChange={value => {
          onChange?.(value);
          // this fixes a strange issue in Safari where the selection stays inside of the editor
          // after a blur event happens but the selection is still in the editor
          // so the cursor is visually in the wrong place and it inserts text backwards
          const selection = window.getSelection();
          if (selection && !ReactEditor.isFocused(editor)) {
            const editorNode = ReactEditor.toDOMNode(editor, editor);
            if (selection.anchorNode === editorNode) {
              ReactEditor.focus(editor);
            }
          }
        }}
      >
        {useMemo(
          () =>
            onChange !== undefined && (
              <Toolbar documentFeatures={documentFeatures} />
            ),
          [documentFeatures, onChange]
        )}

        <DocumentEditorEditable {...props} readOnly={onChange === undefined} />
        {
          // for debugging
          false && <Debugger />
        }
      </DocumentEditorProvider>
    </div>
  );
}

const IsInEditorContext = createContext(false);

export function useIsInDocumentEditor() {
  return useContext(IsInEditorContext);
}

// in a seperate function with the editor passed in to make react okay with it
function createKeyForEditor(_editor: Editor) {
  return Math.random().toString(36);
}

export function DocumentEditorProvider({
  children,
  editor,
  onChange,
  value,
  componentBlocks,
  documentFeatures,
}: {
  children: ReactNode;
  value: Descendant[];
  onChange: (value: Descendant[]) => void;
  editor: Editor;
  componentBlocks: Record<string, ComponentBlock>;
  documentFeatures: DocumentFeatures;
}) {
  const identity = useMemo(() => createKeyForEditor(editor), [editor]);
  return (
    <IsInEditorContext.Provider value>
      <Slate
        // this fixes issues with Slate crashing when a fast refresh occcurs
        key={identity}
        editor={editor}
        value={value}
        onChange={value => {
          onChange(value);
          // this fixes a strange issue in Safari where the selection stays inside of the editor
          // after a blur event happens but the selection is still in the editor
          // so the cursor is visually in the wrong place and it inserts text backwards
          const selection = window.getSelection();
          if (selection && !ReactEditor.isFocused(editor)) {
            const editorNode = ReactEditor.toDOMNode(editor, editor);
            if (selection.anchorNode === editorNode) {
              ReactEditor.focus(editor);
            }
          }
        }}
      >
        <TableSelectionProvider>
          <ToolbarStateProvider
            componentBlocks={componentBlocks}
            editorDocumentFeatures={documentFeatures}
          >
            {children}
          </ToolbarStateProvider>
        </TableSelectionProvider>
      </Slate>
    </IsInEditorContext.Provider>
  );
}

function getPrismTokenLength(token: Prism.Token | string): number {
  if (typeof token === 'string') {
    return token.length;
  } else if (Array.isArray(token.content)) {
    return token.content.reduce((l, t) => l + getPrismTokenLength(t), 0);
  } else {
    return getPrismTokenLength(token.content);
  }
}

export function DocumentEditorEditable(props: EditableProps) {
  const containerSize = useContentPanelSize();
  const entryLayoutPane = useEntryLayoutSplitPaneContext();
  const editor = useSlate();
  const { componentBlocks, documentFeatures } = useDocumentEditorConfig();

  const onKeyDown = useMemo(
    () => getKeyDownHandler(editor, documentFeatures),
    [editor, documentFeatures]
  );

  return (
    <ActiveBlockPopoverProvider editor={editor}>
      <Prose size={entryLayoutPane === 'main' ? 'medium' : 'regular'}>
        <Editable
          placeholder='Start writing or press "/" for commands...'
          decorate={useCallback(
            ([node, path]: NodeEntry<Node>) => {
              let decorations: Range[] = [];
              if (node.type === 'component-block') {
                if (
                  node.children.length === 1 &&
                  Element.isElement(node.children[0]) &&
                  node.children[0].type === 'component-inline-prop' &&
                  node.children[0].propPath === undefined
                ) {
                  return decorations;
                }
                node.children.forEach((child, index) => {
                  if (
                    Node.string(child) === '' &&
                    Element.isElement(child) &&
                    (child.type === 'component-block-prop' ||
                      child.type === 'component-inline-prop') &&
                    child.propPath !== undefined
                  ) {
                    const start = Editor.start(editor, [...path, index]);
                    const placeholder = getPlaceholderTextForPropPath(
                      child.propPath,
                      componentBlocks[node.component].schema,
                      node.props
                    );
                    if (placeholder) {
                      decorations.push({
                        placeholder,
                        anchor: start,
                        focus: start,
                      });
                    }
                  }
                });
              }
              if (
                node.type === 'code' &&
                node.children.length === 1 &&
                node.children[0].type === undefined &&
                node.language &&
                node.language in Prism.languages
              ) {
                const textPath = [...path, 0];
                const tokens = Prism.tokenize(
                  node.children[0].text,
                  Prism.languages[node.language]
                );
                function consumeTokens(
                  start: number,
                  tokens: (string | Prism.Token)[]
                ) {
                  for (const token of tokens) {
                    const length = getPrismTokenLength(token);
                    const end = start + length;

                    if (typeof token !== 'string') {
                      decorations.push({
                        ['prism_' + token.type]: true,
                        anchor: { path: textPath, offset: start },
                        focus: { path: textPath, offset: end },
                      });
                      consumeTokens(
                        start,
                        Array.isArray(token.content)
                          ? token.content
                          : [token.content]
                      );
                    }

                    start = end;
                  }
                }
                consumeTokens(0, tokens);
              }
              return decorations;
            },
            [editor, componentBlocks]
          )}
          onKeyDown={onKeyDown}
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          {...props}
          {...toDataAttributes({
            container: containerSize,
            layout: entryLayoutPane,
          })}
          className={classNames(editableStyles, props.className)}
        />
      </Prose>
    </ActiveBlockPopoverProvider>
  );
}

function Debugger() {
  const editor = useSlate();
  return (
    <pre>
      {JSON.stringify(
        {
          selection:
            editor.selection && Range.isCollapsed(editor.selection)
              ? editor.selection.anchor
              : editor.selection,
          marksWithoutCall: editor.marks,
          marks: Editor.marks(editor),
          children: editor.children,
        },
        null,
        2
      )}
    </pre>
  );
}

let styles: any = {
  flex: 1,
  height: 'auto',
  minHeight: tokenSchema.size.scale[2000],
  minWidth: 0,
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
};

const editableStyles = css({
  ...styles,
  a: {
    color: tokenSchema.color.foreground.accent,
  },
});
