import { useMemo } from 'react';
import { Editor, Transforms } from 'slate';
import { ReactEditor, RenderElementProps, useSlateStatic } from 'slate-react';

import { ActionGroup, Item } from '@keystar/ui/action-group';
import { ActionButton } from '@keystar/ui/button';
import { Icon } from '@keystar/ui/icon';
import { columnsIcon } from '@keystar/ui/icon/icons/columnsIcon';
import { trash2Icon } from '@keystar/ui/icon/icons/trash2Icon';
import { Flex } from '@keystar/ui/layout';
import { css, tokenSchema } from '@keystar/ui/style';
import { Tooltip, TooltipTrigger } from '@keystar/ui/tooltip';

import { DocumentFeatures } from '../document-features';
import {
  BlockPopover,
  BlockPopoverTrigger,
  ToolbarSeparator,
} from '../primitives';
import { isElementActive } from '../utils';
import { useDocumentEditorConfig, useToolbarState } from '../toolbar-state';
import {
  blockElementSpacing,
  insertNodesButReplaceIfSelectionIsAtEmptyParagraphOrHeading,
} from '../ui-utils';

// UI Components
export const LayoutContainer = ({
  attributes,
  children,
  element,
}: RenderElementProps & { element: { type: 'layout' } }) => {
  const editor = useSlateStatic();

  const layout = element.layout;
  const layoutOptions = useDocumentEditorConfig().documentFeatures.layouts;
  const currentLayoutIndex = layoutOptions.findIndex(
    x => x.toString() === layout.toString()
  );

  return (
    <div className={blockElementSpacing} {...attributes}>
      <BlockPopoverTrigger element={element}>
        <div
          className={css({
            columnGap: tokenSchema.size.space.regular,
            display: 'grid',
          })}
          style={{ gridTemplateColumns: layout.map(x => `${x}fr`).join(' ') }}
        >
          {children}
        </div>
        <BlockPopover>
          <Flex padding="regular" gap="regular">
            <ActionGroup
              selectionMode="single"
              prominence="low"
              density="compact"
              onAction={key => {
                const path = ReactEditor.findPath(editor, element);
                const layoutOption = layoutOptions[key as number];
                Transforms.setNodes(
                  editor,
                  { type: 'layout', layout: layoutOption },
                  { at: path }
                );
                ReactEditor.focus(editor);
              }}
              selectedKeys={
                currentLayoutIndex !== -1 ? [currentLayoutIndex.toString()] : []
              }
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
              <Tooltip tone="critical">Remove</Tooltip>
            </TooltipTrigger>
          </Flex>
        </BlockPopover>
      </BlockPopoverTrigger>
    </div>
  );
};

export const LayoutArea = ({ attributes, children }: RenderElementProps) => {
  return (
    <div
      className={css({
        borderColor: tokenSchema.color.border.neutral,
        borderRadius: tokenSchema.size.radius.regular,
        borderStyle: 'dashed',
        borderWidth: tokenSchema.size.border.regular,
        padding: tokenSchema.size.space.medium,
      })}
      {...attributes}
    >
      {children}
    </div>
  );
};

export const insertLayout = (editor: Editor, layout: [number, ...number[]]) => {
  insertNodesButReplaceIfSelectionIsAtEmptyParagraphOrHeading(editor, [
    {
      type: 'layout',
      layout,
      children: [
        {
          type: 'layout-area',
          children: [{ type: 'paragraph', children: [{ text: '' }] }],
        },
      ],
    },
  ]);
  const layoutEntry = Editor.above(editor, { match: x => x.type === 'layout' });
  if (layoutEntry) {
    Transforms.select(editor, [...layoutEntry[1], 0]);
  }
};

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
          <div
            key={i}
            className={css({
              backgroundColor: 'currentcolor',
              borderRadius: 1,
            })}
          />
        );
      })}
    </div>
  );

  return element;
}

const layoutsIcon = <Icon src={columnsIcon} />;

export const LayoutsButton = ({
  layouts,
}: {
  layouts: DocumentFeatures['layouts'];
}) => {
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
