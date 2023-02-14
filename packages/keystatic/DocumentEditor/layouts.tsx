import { createContext, useContext, useMemo, useRef } from 'react';
import { Editor, Element, Node, Transforms, Range, Point } from 'slate';
import { ReactEditor, RenderElementProps, useFocused, useSelected } from 'slate-react';

import { Tooltip, TooltipTrigger } from '@voussoir/tooltip';
import { columnsIcon } from '@voussoir/icon/icons/columnsIcon';
import { trash2Icon } from '@voussoir/icon/icons/trash2Icon';
import { Icon } from '@voussoir/icon';

import { DocumentFeatures } from './document-features';
import { ToolbarSeparator } from './primitives';
import { paragraphElement } from './paragraphs';
import {
  insertNodesButReplaceIfSelectionIsAtEmptyParagraphOrHeading,
  isElementActive,
  moveChildren,
  useStaticEditor,
} from './utils';
import { useToolbarState } from './toolbar-state';
import { ActionButton } from '@voussoir/button';
import { ActionGroup, Item } from '@voussoir/action-group';
import { Popover } from '@voussoir/overlays';
import { useOverlayTrigger } from '@react-aria/overlays';
import { useOverlayTriggerState } from '@react-stately/overlays';
import { Box, Flex } from '@voussoir/layout';
import { css, tokenSchema } from '@voussoir/style';

const LayoutOptionsContext = createContext<[number, ...number[]][]>([]);

export const LayoutOptionsProvider = LayoutOptionsContext.Provider;

// UI Components
export const LayoutContainer = ({
  attributes,
  children,
  element,
}: RenderElementProps & { element: { type: 'layout' } }) => {
  const focused = useFocused();
  const selected = useSelected();
  const editor = useStaticEditor();

  const layout = element.layout;
  const layoutOptions = useContext(LayoutOptionsContext);
  const currentLayoutIndex = layoutOptions.findIndex(x => x.toString() === layout.toString());
  const triggerRef = useRef(null);
  const state = useOverlayTriggerState({
    isOpen: focused && selected,
  });

  const {
    triggerProps: { onPress: _onPress, ...triggerProps },
    overlayProps,
  } = useOverlayTrigger({ type: 'dialog' }, state, triggerRef);

  return (
    <Box marginY="medium" {...attributes}>
      <div
        {...triggerProps}
        ref={triggerRef}
        className={css({
          columnGap: tokenSchema.size.space.small,
          display: 'grid',
          gridTemplateColumns: layout.map(x => `${x}fr`).join(' '),
        })}
      >
        {children}
      </div>
      <Popover isNonModal {...overlayProps} triggerRef={triggerRef} state={state}>
        <Flex padding="medium" gap="regular">
          <ActionGroup
            selectionMode="single"
            prominence="low"
            density="compact"
            onAction={key => {
              const path = ReactEditor.findPath(editor, element);
              const layoutOption = layoutOptions[key as number];
              Transforms.setNodes(editor, { type: 'layout', layout: layoutOption }, { at: path });
              ReactEditor.focus(editor);
            }}
            selectedKeys={currentLayoutIndex !== -1 ? [currentLayoutIndex.toString()] : []}
          >
            {layoutOptions.map((layoutOption, i) => (
              <Item key={i}>{makeLayoutIcon(layoutOption)}</Item>
            ))}
          </ActionGroup>
          <ToolbarSeparator />
          <TooltipTrigger>
            <ActionButton
              prominence="low"
              onPress={() => {
                const path = ReactEditor.findPath(editor, element);
                Transforms.removeNodes(editor, { at: path });
              }}
            >
              <Icon src={trash2Icon} />
            </ActionButton>
            <Tooltip>Remove</Tooltip>
          </TooltipTrigger>
        </Flex>
      </Popover>
    </Box>
  );
};

export const LayoutArea = ({ attributes, children }: RenderElementProps) => {
  return (
    <Box
      borderWidth="large"
      borderColor="neutral"
      borderRadius="small"
      borderStyle="dashed"
      paddingX="medium"
      {...attributes}
    >
      {children}
    </Box>
  );
};

export const insertLayout = (editor: Editor, layout: [number, ...number[]]) => {
  insertNodesButReplaceIfSelectionIsAtEmptyParagraphOrHeading(editor, [
    {
      type: 'layout',
      layout,
      children: [
        { type: 'layout-area', children: [{ type: 'paragraph', children: [{ text: '' }] }] },
      ],
    },
  ]);
  const layoutEntry = Editor.above(editor, { match: x => x.type === 'layout' });
  if (layoutEntry) {
    Transforms.select(editor, [...layoutEntry[1], 0]);
  }
};

// Plugin
export function withLayouts(editor: Editor): Editor {
  const { normalizeNode, deleteBackward } = editor;
  editor.deleteBackward = unit => {
    if (
      editor.selection &&
      Range.isCollapsed(editor.selection) &&
      // this is just an little optimisation
      // we're only doing things if we're at the start of a layout area
      // and the start of anything will always be offset 0
      // so we'll bailout if we're not at offset 0
      editor.selection.anchor.offset === 0
    ) {
      const [aboveNode, abovePath] = Editor.above(editor, {
        match: node => node.type === 'layout-area',
      }) || [editor, []];
      if (
        aboveNode.type === 'layout-area' &&
        Point.equals(Editor.start(editor, abovePath), editor.selection.anchor)
      ) {
        return;
      }
    }
    deleteBackward(unit);
  };
  editor.normalizeNode = entry => {
    const [node, path] = entry;

    if (Element.isElement(node) && node.type === 'layout') {
      if (node.layout === undefined) {
        Transforms.unwrapNodes(editor, { at: path });
        return;
      }
      if (node.children.length < node.layout.length) {
        Transforms.insertNodes(
          editor,
          Array.from({
            length: node.layout.length - node.children.length,
          }).map(() => ({
            type: 'layout-area',
            children: [paragraphElement()],
          })),
          {
            at: [...path, node.children.length],
          }
        );
        return;
      }
      if (node.children.length > node.layout.length) {
        Array.from({
          length: node.children.length - node.layout.length,
        })
          .map((_, i) => i)
          .reverse()
          .forEach(i => {
            const layoutAreaToRemovePath = [...path, i + node.layout.length];
            const child = node.children[i + node.layout.length] as Element;
            moveChildren(
              editor,
              layoutAreaToRemovePath,
              [
                ...path,
                node.layout.length - 1,
                (node.children[node.layout.length - 1] as Element).children.length,
              ],
              node => node.type !== 'paragraph' || Node.string(child) !== ''
            );

            Transforms.removeNodes(editor, {
              at: layoutAreaToRemovePath,
            });
          });
        return;
      }
    }
    normalizeNode(entry);
  };
  return editor;
}

// Utils
// ------------------------------

function makeLayoutIcon(ratios: number[]) {
  const size = 16;

  const element = (
    <div
      role="img"
      className={css({
        display: 'grid',
        gridTemplateColumns: ratios.map(r => `${r}fr`).join(' '),
        gap: 2,
        width: size,
        height: size,
      })}
    >
      {ratios.map((_, i) => {
        return (
          <div key={i} className={css({ backgroundColor: 'currentcolor', borderRadius: 1 })} />
        );
      })}
    </div>
  );

  return element;
}

const layoutsIcon = <Icon src={columnsIcon} />;

export const LayoutsButton = ({ layouts }: { layouts: DocumentFeatures['layouts'] }) => {
  const {
    editor,
    layouts: { isSelected },
  } = useToolbarState();
  return useMemo(
    () => (
      <TooltipTrigger>
        <ActionButton
          prominence="low"
          isSelected={isSelected}
          onPress={() => {
            if (isElementActive(editor, 'layout')) {
              Transforms.unwrapNodes(editor, {
                match: node => node.type === 'layout',
              });
            } else {
              insertLayout(editor, layouts[0]);
            }
            ReactEditor.focus(editor);
          }}
        >
          {layoutsIcon}
        </ActionButton>
        <Tooltip>Layouts</Tooltip>
      </TooltipTrigger>
    ),
    [editor, isSelected, layouts]
  );
};
