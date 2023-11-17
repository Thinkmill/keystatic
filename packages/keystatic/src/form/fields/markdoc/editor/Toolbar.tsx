import { setBlockType, toggleMark, wrapIn } from 'prosemirror-commands';
import { MarkType, NodeType } from 'prosemirror-model';
import { Command, EditorState, TextSelection } from 'prosemirror-state';
import { ReactElement, ReactNode, useMemo } from 'react';

import { ActionGroup, Item } from '@keystar/ui/action-group';
import { ActionButton } from '@keystar/ui/button';
import { Icon } from '@keystar/ui/icon';
import { boldIcon } from '@keystar/ui/icon/icons/boldIcon';
import { chevronDownIcon } from '@keystar/ui/icon/icons/chevronDownIcon';
import { codeIcon } from '@keystar/ui/icon/icons/codeIcon';
import { italicIcon } from '@keystar/ui/icon/icons/italicIcon';
import { listIcon } from '@keystar/ui/icon/icons/listIcon';
import { listOrderedIcon } from '@keystar/ui/icon/icons/listOrderedIcon';
import { minusIcon } from '@keystar/ui/icon/icons/minusIcon';
import { plusIcon } from '@keystar/ui/icon/icons/plusIcon';
import { quoteIcon } from '@keystar/ui/icon/icons/quoteIcon';
import { removeFormattingIcon } from '@keystar/ui/icon/icons/removeFormattingIcon';
import { strikethroughIcon } from '@keystar/ui/icon/icons/strikethroughIcon';
import { typeIcon } from '@keystar/ui/icon/icons/typeIcon';
import { Flex } from '@keystar/ui/layout';
import { MenuTrigger, Menu } from '@keystar/ui/menu';
import { Picker } from '@keystar/ui/picker';
import { css, tokenSchema } from '@keystar/ui/style';
import { Tooltip, TooltipTrigger } from '@keystar/ui/tooltip';
import { Text, Kbd } from '@keystar/ui/typography';

import {
  useEditorDispatchCommand,
  useEditorSchema,
  useEditorState,
} from './editor-view';
import { toggleList } from './lists';
import { insertNode, insertTable, toggleCodeBlock } from './commands/misc';
import { tableIcon } from '@keystar/ui/icon/icons/tableIcon';
import { EditorSchema } from './schema';

function EditorToolbarButton(props: {
  children: ReactNode;
  'aria-label': string;
  isSelected?: (editorState: EditorState) => boolean;
  isDisabled?: (editorState: EditorState) => boolean;
  command: Command;
}) {
  const state = useEditorState();
  const runCommand = useEditorDispatchCommand();
  const isSelected = props.isSelected?.(state);
  const isDisabled = !props.command(state) || props.isDisabled?.(state);
  return useMemo(
    () => (
      <ActionButton
        prominence="low"
        isSelected={isSelected}
        isDisabled={isDisabled}
        onPress={() => {
          runCommand(props.command);
        }}
        aria-label={props['aria-label']}
        aria-pressed={isSelected}
      >
        {props.children}
      </ActionButton>
    ),
    [isDisabled, isSelected, props, runCommand]
  );
}

// export const tableButton = (
//   <TooltipTrigger>
//     <EditorToolbarButton command={() => {}}>
//       <Icon src={tableIcon} />
//     </EditorToolbarButton>
//     <TableButton />
//     <Tooltip>
//       <Text>Table</Text>
//     </Tooltip>
//   </TooltipTrigger>
// );

export function Toolbar() {
  const schema = useEditorSchema();
  const { nodes } = schema;
  return (
    <ToolbarContainer>
      <ToolbarScrollArea>
        <HeadingMenu headingType={nodes.heading} />
        <InlineMarks />
        <ListButtons />
        <ToolbarGroup>
          <TooltipTrigger>
            <EditorToolbarButton
              command={insertNode(nodes.divider)}
              aria-label="Divider"
            >
              <Icon src={minusIcon} />
            </EditorToolbarButton>
            <Tooltip>
              <Text>Divider</Text>
              <Kbd>---</Kbd>
            </Tooltip>
          </TooltipTrigger>
          <TooltipTrigger>
            <EditorToolbarButton
              aria-label="Quote"
              command={wrapIn(nodes.blockquote)}
            >
              <Icon src={quoteIcon} />
            </EditorToolbarButton>
            <Tooltip>
              <Text>Quote</Text>
              <Kbd>{'>⎵'}</Kbd>
            </Tooltip>
          </TooltipTrigger>
          <TooltipTrigger>
            <EditorToolbarButton
              aria-label="Code block"
              command={toggleCodeBlock(nodes.code_block, nodes.paragraph)}
              isSelected={(state: EditorState) => {
                let hasCodeBlock = false;
                for (const range of state.selection.ranges) {
                  state.doc.nodesBetween(
                    range.$from.pos,
                    range.$to.pos,
                    node => {
                      if (node.type === nodes.code_block) {
                        hasCodeBlock = true;
                      }
                    }
                  );
                  if (hasCodeBlock) break;
                }
                return hasCodeBlock;
              }}
            >
              <Icon src={codeIcon} />
            </EditorToolbarButton>
            <Tooltip>
              <Text>Code block</Text>
              <Kbd>```</Kbd>
            </Tooltip>
          </TooltipTrigger>
          <TooltipTrigger>
            <EditorToolbarButton
              aria-label="Table"
              command={insertTable(schema)}
            >
              <Icon src={tableIcon} />
            </EditorToolbarButton>
            <Tooltip>
              <Text>Table</Text>
            </Tooltip>
          </TooltipTrigger>
        </ToolbarGroup>
      </ToolbarScrollArea>
      <InsertBlockMenu />
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
      position="sticky"
      zIndex={2}
      insetTop={0}
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

type HeadingState = 'normal' | 1 | 2 | 3 | 4 | 5 | 6;
const headingMenuVals = new Map<string | number, HeadingState>([
  ['normal', 'normal'],
  ['1', 1],
  ['2', 2],
  ['3', 3],
  ['4', 4],
  ['5', 5],
  ['6', 6],
]);

type HeadingItem = { name: string; id: string | number };

function getHeadingMenuState(
  state: EditorState,
  headingType: NodeType,
  paragraphType: NodeType
): HeadingState | 'disabled' {
  let activeLevel: HeadingState | 'disabled' | undefined;
  for (const range of state.selection.ranges) {
    state.doc.nodesBetween(range.$from.pos, range.$to.pos, node => {
      if (node.type === headingType) {
        const level = node.attrs.level;
        if (activeLevel === undefined) {
          activeLevel = level;
        } else if (activeLevel !== level) {
          activeLevel = 'disabled';
        }
      }
      if (node.type === paragraphType) {
        if (activeLevel === undefined) {
          activeLevel = 'normal';
        } else if (activeLevel !== 'normal') {
          activeLevel = 'disabled';
        }
      }
    });
    if (activeLevel === 'disabled') {
      break;
    }
  }
  return activeLevel ?? 'disabled';
}

const HeadingMenu = (props: { headingType: NodeType }) => {
  const { nodes } = useEditorSchema();
  const items = useMemo(() => {
    let resolvedItems: HeadingItem[] = [{ name: 'Paragraph', id: 'normal' }];
    [1, 2, 3, 4, 5, 6].forEach(level => {
      resolvedItems.push({ name: `Heading ${level}`, id: level.toString() });
    });
    return resolvedItems;
  }, []);
  const state = useEditorState();
  const menuState = getHeadingMenuState(
    state,
    props.headingType,
    nodes.paragraph
  );
  const runCommand = useEditorDispatchCommand();

  return useMemo(
    () => (
      <Picker
        flexShrink={0}
        width="scale.1700"
        prominence="low"
        aria-label="Text block"
        items={items}
        isDisabled={menuState === 'disabled'}
        selectedKey={menuState === 'disabled' ? 'normal' : menuState.toString()}
        onSelectionChange={selected => {
          let key = headingMenuVals.get(selected);
          if (key === 'normal') {
            runCommand(setBlockType(nodes.paragraph));
          } else if (key) {
            runCommand(
              setBlockType(props.headingType, {
                level: parseInt(key as any),
              })
            );
          }
        }}
      >
        {item => <Item key={item.id}>{item.name}</Item>}
      </Picker>
    ),
    [items, menuState, nodes.paragraph, props.headingType, runCommand]
  );
};

function InsertBlockMenu() {
  const commandDispatch = useEditorDispatchCommand();
  const schema = useEditorSchema();

  const items = useMemo(
    () => schema.insertMenuItems.filter(x => x.forToolbar),
    [schema.insertMenuItems]
  );
  const idToItem = useMemo(
    () => new Map(items.map(item => [item.id, item])),
    [items]
  );
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
        onAction={id => {
          const command = idToItem.get(id as string)?.command;
          if (command) {
            commandDispatch(command);
          }
        }}
        items={items}
      >
        {item => (
          <Item key={item.id} textValue={item.label}>
            {item.label}
          </Item>
        )}
      </Menu>
    </MenuTrigger>
  );
}

const isMarkActive = (markType: MarkType) => (state: EditorState) => {
  if (state.selection instanceof TextSelection && state.selection.empty) {
    if (!state.selection.$cursor) return false;
    return !!markType.isInSet(
      state.storedMarks || state.selection.$cursor.marks()
    );
  }
  for (const range of state.selection.ranges) {
    if (state.doc.rangeHasMark(range.$from.pos, range.$to.pos, markType)) {
      return true;
    }
  }
  return false;
};

function InlineMarks() {
  const state = useEditorState();
  const schema = useEditorSchema();
  const inlineMarks = useMemo(() => {
    const marks: {
      key: string;
      label: string;
      icon: ReactElement;
      shortcut?: string;
      command: Command;
      isSelected: (state: EditorState) => boolean;
    }[] = [];
    if (schema.marks.bold) {
      marks.push({
        key: 'bold',
        label: 'Bold',
        icon: boldIcon,
        shortcut: `B`,
        command: toggleMark(schema.marks.bold),
        isSelected: isMarkActive(schema.marks.bold),
      });
    }

    if (schema.marks.italic) {
      marks.push({
        key: 'italic',
        label: 'Italic',
        icon: italicIcon,
        shortcut: `I`,
        command: toggleMark(schema.marks.italic),
        isSelected: isMarkActive(schema.marks.italic),
      });
    }
    if (schema.marks.strikethrough) {
      marks.push({
        key: 'strikethrough',
        label: 'Strikethrough',
        icon: strikethroughIcon,
        command: toggleMark(schema.marks.strikethrough),
        isSelected: isMarkActive(schema.marks.strikethrough),
      });
    }
    if (schema.marks.code) {
      marks.push({
        key: 'code',
        label: 'Code',
        icon: codeIcon,
        command: toggleMark(schema.marks.code),
        isSelected: isMarkActive(schema.marks.code),
      });
    }

    marks.push({
      key: 'clearFormatting',
      label: 'Clear formatting',
      icon: removeFormattingIcon,
      command: () => false,
      isSelected: () => false,
    });
    return marks;
  }, [schema]);
  const selectedKeys = useMemoStringified(
    inlineMarks.filter(val => val.isSelected(state)).map(val => val.key)
  );
  const disabledKeys = useMemoStringified(
    inlineMarks.filter(val => !val.command(state)).map(val => val.key)
  );
  const runCommand = useEditorDispatchCommand();
  return useMemo(() => {
    return (
      <ActionGroup
        UNSAFE_className={css({
          minWidth: `calc(${tokenSchema.size.element.medium} * 4)`,
        })}
        prominence="low"
        density="compact"
        buttonLabelBehavior="hide"
        overflowMode="collapse"
        summaryIcon={<Icon src={typeIcon} />}
        items={inlineMarks}
        selectionMode="multiple"
        selectedKeys={selectedKeys}
        disabledKeys={disabledKeys}
        onAction={key => {
          const command = inlineMarks.find(mark => mark.key === key)?.command;
          if (command) {
            runCommand(command);
          }
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
  }, [disabledKeys, inlineMarks, runCommand, selectedKeys]);
}

function useMemoStringified<T>(value: T): T {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => value, [JSON.stringify(value)]);
}

function getActiveListType(state: EditorState, schema: EditorSchema) {
  const sharedDepth = state.selection.$from.sharedDepth(state.selection.to);
  for (let i = sharedDepth; i > 0; i--) {
    const node = state.selection.$from.node(i);
    if (node.type === schema.nodes.ordered_list) {
      return 'ordered' as const;
    } else if (node.type === schema.nodes.unordered_list) {
      return 'unordered' as const;
    }
  }
}

function ListButtons() {
  const state = useEditorState();
  const schema = useEditorSchema();
  const dispatchCommand = useEditorDispatchCommand();

  const canWrapInOrderedList =
    !!schema.nodes.ordered_list && toggleList(schema.nodes.ordered_list)(state);
  const canWrapInUnorderedList =
    !!schema.nodes.unordered_list &&
    toggleList(schema.nodes.unordered_list)(state);
  const activeListType = getActiveListType(state, schema);

  return useMemo(() => {
    return (
      <ActionGroup
        flexShrink={0}
        aria-label="Lists"
        selectionMode="single"
        buttonLabelBehavior="hide"
        density="compact"
        prominence="low"
        disabledKeys={[
          !canWrapInOrderedList && 'ordered',
          !canWrapInUnorderedList && 'unordered',
        ].filter(removeFalse)}
        summaryIcon={<Icon src={listIcon} />}
        selectedKeys={activeListType ? [activeListType] : []}
        onAction={key => {
          const format = key as 'ordered' | 'unordered';
          const type = schema.nodes[`${format}_list`];
          if (type) {
            dispatchCommand(toggleList(type));
          }
        }}
        items={[
          !!schema.nodes.unordered_list && {
            label: 'Bullet List',
            key: 'unordered',
            shortcut: '-',
            icon: listIcon,
          },
          !!schema.nodes.unordered_list && {
            label: 'Numbered List',
            key: 'ordered',
            shortcut: '1.',
            icon: listOrderedIcon,
          },
        ].filter(removeFalse)}
      >
        {item => (
          <Item textValue={`${item.label} (${item.shortcut})`}>
            <Icon src={item.icon} />
            <Text>{item.label}</Text>
            <Kbd>{item.shortcut}</Kbd>
          </Item>
        )}
      </ActionGroup>
    );
  }, [
    activeListType,
    canWrapInOrderedList,
    canWrapInUnorderedList,
    dispatchCommand,
    schema.nodes,
  ]);
}

function removeFalse<T>(val: T): val is Exclude<T, false> {
  return val !== false;
}
