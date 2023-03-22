import { ReactNode, useMemo, useContext } from 'react';
import { Editor, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';

import { ActionGroup, Item } from '@voussoir/action-group';
import { ActionButton, Button } from '@voussoir/button';
import { plusIcon } from '@voussoir/icon/icons/plusIcon';
import { chevronDownIcon } from '@voussoir/icon/icons/chevronDownIcon';
import { codeIcon } from '@voussoir/icon/icons/codeIcon';
import { maximizeIcon } from '@voussoir/icon/icons/maximizeIcon';
import { minimizeIcon } from '@voussoir/icon/icons/minimizeIcon';
import { boldIcon } from '@voussoir/icon/icons/boldIcon';
import { removeFormattingIcon } from '@voussoir/icon/icons/removeFormattingIcon';
import { typeIcon } from '@voussoir/icon/icons/typeIcon';
import { italicIcon } from '@voussoir/icon/icons/italicIcon';
import { strikethroughIcon } from '@voussoir/icon/icons/strikethroughIcon';
import { subscriptIcon } from '@voussoir/icon/icons/subscriptIcon';
import { superscriptIcon } from '@voussoir/icon/icons/superscriptIcon';
import { underlineIcon } from '@voussoir/icon/icons/underlineIcon';
import { Icon } from '@voussoir/icon';
import { Flex } from '@voussoir/layout';
import { MenuTrigger, Menu } from '@voussoir/menu';
import { css, tokenSchema } from '@voussoir/style';
import { Text, Kbd } from '@voussoir/typography';
import { Tooltip, TooltipTrigger } from '@voussoir/tooltip';

import { TextAlignMenu } from './alignment';
import { blockquoteButton } from './blockquote';
import { codeButton } from './code-block';
import {
  ComponentBlockContext,
  insertComponentBlock,
} from './component-blocks';
import { dividerButton } from './divider';
import { DocumentFeatures } from './document-features';
import { linkButton } from './link';
import { LayoutsButton } from './layouts';
import { ListButtons } from './lists';
import { ToolbarSeparator } from './primitives';
import { useToolbarState } from './toolbar-state';
import { clearFormatting, useStaticEditor } from './utils';
import { Picker } from '@voussoir/picker';
import { imageButton } from './image';
import { tableButton } from './table';

export function Toolbar({
  documentFeatures,
  viewState,
}: {
  documentFeatures: DocumentFeatures;
  viewState?: { expanded: boolean; toggle: () => void };
}) {
  const blockComponent = useContext(ComponentBlockContext);
  const hasBlockItems = Object.keys(blockComponent).length;
  const hasMarks = Object.values(documentFeatures.formatting.inlineMarks).some(
    x => x
  );

  const hasAlignment =
    documentFeatures.formatting.alignment.center ||
    documentFeatures.formatting.alignment.end;
  const hasLists =
    documentFeatures.formatting.listTypes.unordered ||
    documentFeatures.formatting.listTypes.ordered;

  return (
    <ToolbarContainer>
      <ToolbarScrollArea>
        {!!documentFeatures.formatting.headingLevels.length && (
          <HeadingMenu
            headingLevels={documentFeatures.formatting.headingLevels}
          />
        )}
        {hasMarks && (
          <InlineMarks marks={documentFeatures.formatting.inlineMarks} />
        )}

        {(hasAlignment || hasLists) && (
          <ToolbarGroup>
            {hasAlignment && (
              <TextAlignMenu
                alignment={documentFeatures.formatting.alignment}
              />
            )}
            {hasLists && (
              <ListButtons lists={documentFeatures.formatting.listTypes} />
            )}
          </ToolbarGroup>
        )}

        {(documentFeatures.dividers ||
          documentFeatures.links ||
          !!documentFeatures.images ||
          documentFeatures.formatting.blockTypes.blockquote ||
          documentFeatures.tables ||
          !!documentFeatures.layouts.length ||
          documentFeatures.formatting.blockTypes.code) && (
          <ToolbarGroup>
            {documentFeatures.dividers && dividerButton}
            {documentFeatures.links && linkButton}
            {documentFeatures.images && imageButton}
            {documentFeatures.formatting.blockTypes.blockquote &&
              blockquoteButton}
            {!!documentFeatures.layouts.length && (
              <LayoutsButton layouts={documentFeatures.layouts} />
            )}
            {documentFeatures.formatting.blockTypes.code && codeButton}
            {documentFeatures.tables && tableButton}
          </ToolbarGroup>
        )}
      </ToolbarScrollArea>
      {useMemo(() => {
        return (
          viewState && (
            <Flex gap="xsmall">
              <ToolbarSeparator />
              <TooltipTrigger>
                <Button
                  prominence="low"
                  onPress={() => {
                    viewState.toggle();
                  }}
                >
                  <Icon
                    src={viewState.expanded ? minimizeIcon : maximizeIcon}
                  />
                </Button>
                <Tooltip>{viewState.expanded ? 'Collapse' : 'Expand'}</Tooltip>
              </TooltipTrigger>
            </Flex>
          )
        );
      }, [viewState])}
      {!!hasBlockItems && <InsertBlockMenu />}
    </ToolbarContainer>
  );
}

/** Group buttons together that don't fit into an `ActionGroup` semantically. */
const ToolbarGroup = ({ children }: { children: ReactNode }) => {
  return <Flex gap="regular">{children}</Flex>;
};

const ToolbarContainer = ({ children }: { children: ReactNode }) => {
  return (
    <Flex
      minWidth={0}
      backgroundColor="canvas"
      borderTopStartRadius="medium"
      borderTopEndRadius="medium"
      // NOTE: sticky behavior needs to be kept in sync with the app's header
      insetTop={`calc(${tokenSchema.size.element.xlarge} - ${tokenSchema.size.border.regular})`}
      position="sticky"
      zIndex={2}
    >
      {children}
      <Flex
        role="presentation" // dividing line
        borderBottom="muted"
        position="absolute"
        insetX="medium"
        insetBottom={0}
      />
    </Flex>
  );
};

const ToolbarScrollArea = (props: { children: ReactNode }) => {
  return (
    <Flex
      // borderRadius="regular"
      // backgroundColor="surfaceSecondary"
      padding="regular"
      paddingEnd="medium"
      gap="large"
      flex
      minWidth={0}
      UNSAFE_className={css({
        msOverflowStyle: 'none' /* for Internet Explorer, Edge */,
        scrollbarWidth: 'none' /* for Firefox */,
        overflowX: 'auto',

        /* for Chrome, Safari, and Opera */
        '&::-webkit-scrollbar': {
          display: 'none',
        },
      })}
      {...props}
    />
  );
};

const headingMenuVals = new Map<
  string | number,
  'normal' | 1 | 2 | 3 | 4 | 5 | 6
>([
  ['normal', 'normal'],
  ['1', 1],
  ['2', 2],
  ['3', 3],
  ['4', 4],
  ['5', 5],
  ['6', 6],
]);

type HeadingItem = { name: string; id: string | number };
const HeadingMenu = ({
  headingLevels,
}: {
  headingLevels: DocumentFeatures['formatting']['headingLevels'];
}) => {
  const { editor, textStyles } = useToolbarState();
  const isDisabled = textStyles.allowedHeadingLevels.length === 0;
  const items = useMemo(() => {
    let resolvedItems: HeadingItem[] = [{ name: 'Paragraph', id: 'normal' }];
    headingLevels.forEach(level => {
      resolvedItems.push({ name: `Heading ${level}`, id: level.toString() });
    });
    return resolvedItems;
  }, [headingLevels]);
  const selected = textStyles.selected.toString();

  return useMemo(
    () => (
      <Picker
        flexShrink={0}
        width="size.scale.1700"
        prominence="low"
        aria-label="Text block"
        items={items}
        isDisabled={isDisabled}
        selectedKey={selected}
        onSelectionChange={selected => {
          let key = headingMenuVals.get(selected);
          if (key === 'normal') {
            Editor.withoutNormalizing(editor, () => {
              Transforms.unsetNodes(editor, 'level', {
                match: n => n.type === 'heading',
              });
              Transforms.setNodes(
                editor,
                { type: 'paragraph' },
                { match: n => n.type === 'heading' }
              );
            });
          } else if (key) {
            Transforms.setNodes(
              editor,
              { type: 'heading', level: key },
              {
                match: node =>
                  node.type === 'paragraph' || node.type === 'heading',
              }
            );
          }
          ReactEditor.focus(editor);
        }}
      >
        {item => <Item key={item.id}>{item.name}</Item>}
      </Picker>
    ),
    [editor, isDisabled, items, selected]
  );
};

function InsertBlockMenu() {
  const editor = useStaticEditor();
  const componentBlocks = useContext(ComponentBlockContext)!;

  return (
    <MenuTrigger align="end">
      <TooltipTrigger>
        <ActionButton marginY="regular" marginEnd="medium">
          <Icon src={plusIcon} />
          <Icon src={chevronDownIcon} />
        </ActionButton>
        <Tooltip>
          <Text>Insert</Text>
          <Kbd>/</Kbd>
        </Tooltip>
      </TooltipTrigger>
      <Menu
        onAction={key => {
          insertComponentBlock(editor, componentBlocks, key as string);
        }}
        items={Object.entries(componentBlocks)}
      >
        {([key, item]) => <Item key={key}>{item.label}</Item>}
      </Menu>
    </MenuTrigger>
  );
}

const inlineMarks = [
  {
    key: 'bold',
    label: 'Bold',
    icon: boldIcon,
    shortcut: `B`,
  },
  {
    key: 'italic',
    label: 'Italic',
    icon: italicIcon,
    shortcut: `I`,
  },
  {
    key: 'underline',
    label: 'Underline',
    icon: underlineIcon,
    shortcut: `U`,
  },
  {
    key: 'strikethrough',
    label: 'Strikethrough',
    icon: strikethroughIcon,
  },
  {
    key: 'code',
    label: 'Code',
    icon: codeIcon,
  },
  {
    key: 'superscript',
    label: 'Superscript',
    icon: superscriptIcon,
  },
  {
    key: 'subscript',
    label: 'Subscript',
    icon: subscriptIcon,
  },
  {
    key: 'clearFormatting',
    label: 'Clear formatting',
    icon: removeFormattingIcon,
  },
] as const;

function InlineMarks({
  marks: _marksShown,
}: {
  marks: DocumentFeatures['formatting']['inlineMarks'];
}) {
  const {
    editor,
    clearFormatting: { isDisabled },
    marks,
  } = useToolbarState();
  const marksShown = useMemoStringified(_marksShown);

  const selectedKeys = useMemoStringified(
    Object.keys(marks).filter(
      key => marks[key as keyof typeof marks].isSelected
    )
  );
  const disabledKeys = useMemoStringified(
    Object.keys(marks)
      .filter(key => marks[key as keyof typeof marks].isDisabled)
      .concat(isDisabled ? 'clearFormatting' : [])
  );

  return useMemo(() => {
    const items = inlineMarks.filter(
      item => item.key === 'clearFormatting' || marksShown[item.key]
    );
    return (
      <ActionGroup
        minWidth={`calc(${tokenSchema.size.element.medium} * 4)`}
        prominence="low"
        density="compact"
        buttonLabelBehavior="hide"
        overflowMode="collapse"
        summaryIcon={<Icon src={typeIcon} />}
        items={items}
        selectionMode="multiple"
        selectedKeys={selectedKeys}
        disabledKeys={disabledKeys}
        onAction={key => {
          if (key === 'clearFormatting') {
            clearFormatting(editor);
          } else {
            const mark = key as keyof typeof marks;
            if (Editor.marks(editor)?.[mark]) {
              Editor.removeMark(editor, mark);
            } else {
              Editor.addMark(editor, mark, true);
            }
          }
          ReactEditor.focus(editor);
        }}
      >
        {item => {
          return (
            <Item key={item.key} textValue={item.label}>
              <Text>{item.label}</Text>
              {'shortcut' in item && <Kbd meta>{item.shortcut}</Kbd>}
              <Icon src={item.icon} />
            </Item>
          );
        }}
      </ActionGroup>
    );
  }, [disabledKeys, editor, marksShown, selectedKeys]);
}

function useMemoStringified<T>(value: T): T {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => value, [JSON.stringify(value)]);
}
