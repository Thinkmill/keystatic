import { ReactElement, ReactNode, useMemo, useState } from 'react';

import { ActionGroup, Item } from '@voussoir/action-group';
import { ActionButton } from '@voussoir/button';
import { plusIcon } from '@voussoir/icon/icons/plusIcon';
import { chevronDownIcon } from '@voussoir/icon/icons/chevronDownIcon';
import { codeIcon } from '@voussoir/icon/icons/codeIcon';
import { boldIcon } from '@voussoir/icon/icons/boldIcon';
import { removeFormattingIcon } from '@voussoir/icon/icons/removeFormattingIcon';
import { typeIcon } from '@voussoir/icon/icons/typeIcon';
import { italicIcon } from '@voussoir/icon/icons/italicIcon';
import { strikethroughIcon } from '@voussoir/icon/icons/strikethroughIcon';
import { quoteIcon } from '@voussoir/icon/icons/quoteIcon';
import { Icon } from '@voussoir/icon';
import { Flex } from '@voussoir/layout';
import { MenuTrigger, Menu } from '@voussoir/menu';
import { css, tokenSchema } from '@voussoir/style';
import { Text, Kbd } from '@voussoir/typography';
import { Tooltip, TooltipTrigger } from '@voussoir/tooltip';

import {
  EditorToolbar,
  EditorToolbarGroup,
  EditorToolbarItem,
  EditorToolbarSeparator,
  EditorToolbarButton,
} from './new-primitives';
import { Picker } from '@voussoir/picker';
import {
  Command,
  EditorState,
  SelectionRange,
  TextSelection,
} from 'prosemirror-state';
import {
  useEditorDispatchCommand,
  useEditorSchema,
  useEditorState,
} from './editor-view';
import { minusIcon } from '@voussoir/icon/icons/minusIcon';
import { setBlockType, toggleMark, wrapIn } from 'prosemirror-commands';
import { Attrs, MarkType, Node, NodeType } from 'prosemirror-model';
import { listIcon } from '@voussoir/icon/icons/listIcon';
import { fileCodeIcon } from '@voussoir/icon/icons/fileCodeIcon';
import { listOrderedIcon } from '@voussoir/icon/icons/listOrderedIcon';
import { toggleList } from './lists';
import { insertNode, toggleCodeBlock } from './commands/misc';
import { linkIcon } from '@voussoir/icon/icons/linkIcon';
import { DialogContainer } from '@voussoir/dialog';
import { LinkDialog } from './popovers/link-toolbar';

function EditorToolbarButton_OLD(props: {
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

function isString(val: unknown): val is string {
  return typeof val === 'string';
}

function multiSelectionAsAddAndRemove(
  val: string[],
  handlers: {
    onAdd: (key: string) => void;
    onRemove: (key: string) => void;
  }
) {
  return {
    value: val,
    onChange: (newVal: React.Key[]) => {
      if (!newVal.every(isString)) return;
      for (const addedKey of newVal.filter(v => !val.includes(v))) {
        handlers.onAdd(addedKey);
      }
      for (const removedKey of val.filter(v => !newVal.includes(v))) {
        handlers.onRemove(removedKey);
      }
    },
    selectionMode: 'multiple' as const,
  };
}

function AddLinkDialog(props: { onClose: () => void }) {
  const state = useEditorState();
  const schema = useEditorSchema();
  const runCommand = useEditorDispatchCommand();

  return (
    <LinkDialog
      text={
        state.selection.empty
          ? undefined
          : state.doc.textBetween(state.selection.from, state.selection.to)
      }
      href=""
      onSubmit={data => {
        runCommand(addMark(schema.marks.link, { href: data.href }));
        props.onClose();
      }}
    />
  );
}

function markApplies(
  doc: Node,
  ranges: readonly SelectionRange[],
  type: MarkType
) {
  for (let i = 0; i < ranges.length; i++) {
    let { $from, $to } = ranges[i];
    let can =
      $from.depth == 0
        ? doc.inlineContent && doc.type.allowsMarkType(type)
        : false;
    doc.nodesBetween($from.pos, $to.pos, node => {
      if (can) return false;
      can = node.inlineContent && node.type.allowsMarkType(type);
    });
    if (can) return true;
  }
  return false;
}

function hasMarkInSelection(state: EditorState, markType: MarkType) {
  if (state.selection.empty) {
    return markType.isInSet(state.storedMarks || state.selection.$from.marks());
  }
  for (const { $from, $to } of state.selection.ranges) {
    if (state.doc.rangeHasMark($from.pos, $to.pos, markType)) {
      return true;
    }
  }
  return false;
}

function addMark(markType: MarkType, attrs: Attrs | null = null): Command {
  return function (state, dispatch) {
    if (!(state.selection instanceof TextSelection)) return false;
    let { empty, $cursor, ranges } = state.selection;
    if (
      (empty && !$cursor) ||
      !markApplies(state.doc, ranges, markType) ||
      hasMarkInSelection(state, markType)
    ) {
      return false;
    }
    if (dispatch) {
      if ($cursor) {
        if (markType.isInSet(state.storedMarks || $cursor.marks())) {
          dispatch(state.tr.removeStoredMark(markType));
        } else {
          dispatch(state.tr.addStoredMark(markType.create(attrs)));
        }
      } else {
        let { tr } = state;

        for (let i = 0; i < ranges.length; i++) {
          let { $from, $to } = ranges[i];
          let from = $from.pos,
            to = $to.pos,
            start = $from.nodeAfter,
            end = $to.nodeBefore;
          let spaceStart =
            start && start.isText ? /^\s*/.exec(start.text!)![0].length : 0;
          let spaceEnd =
            end && end.isText ? /\s*$/.exec(end.text!)![0].length : 0;
          if (from + spaceStart < to) {
            from += spaceStart;
            to -= spaceEnd;
          }
          tr.addMark(from, to, markType.create(attrs));
        }
        dispatch(tr.scrollIntoView());
      }
    }
    return true;
  };
}

function LinkToolbarItem() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const editorState = useEditorState();
  const schema = useEditorSchema();
  const isDisabled = !addMark(schema.marks.link, { href: '' })(editorState);
  return useMemo(
    () => (
      <>
        <EditorToolbarButton isDisabled={isDisabled} aria-label="link">
          <Icon src={linkIcon} />
        </EditorToolbarButton>
        <DialogContainer
          onDismiss={() => {
            setDialogOpen(false);
          }}
        >
          {dialogOpen && (
            <AddLinkDialog
              onClose={() => {
                setDialogOpen(false);
              }}
            />
          )}
        </DialogContainer>
      </>
    ),
    [dialogOpen, isDisabled]
  );
}

function NewToolbar() {
  const state = useEditorState();
  const runCommand = useEditorDispatchCommand();
  const toggleMarkByKey = (key: string) => {
    const markType = state.schema.marks[key];
    if (markType) {
      runCommand(toggleMark(markType));
    }
  };

  const { nodes } = useEditorSchema();
  return (
    <EditorToolbar aria-label="Formatting options">
      <EditorToolbarGroup
        {...multiSelectionAsAddAndRemove(
          ['bold', 'italic', 'strikethrough'].filter(mark => {
            const markType = state.schema.marks[mark];
            return !!mark && isMarkActive(markType)(state);
          }),
          { onAdd: toggleMarkByKey, onRemove: toggleMarkByKey }
        )}
        aria-label="Text formatting"
      >
        <EditorToolbarItem value="bold" aria-label="bold">
          <Icon src={boldIcon} />
        </EditorToolbarItem>
        <EditorToolbarItem value="italic" aria-label="italic">
          <Icon src={italicIcon} />
        </EditorToolbarItem>
        <EditorToolbarItem value="strikethrough" aria-label="strikethrough">
          <Icon src={strikethroughIcon} />
        </EditorToolbarItem>
      </EditorToolbarGroup>

      <EditorToolbarSeparator />

      <LinkToolbarItem />

      <EditorToolbarSeparator />

      <EditorToolbarGroup selectionMode="single" aria-label="Lists">
        <EditorToolbarItem value="bulleted" aria-label="bulleted list">
          <Icon src={listIcon} />
        </EditorToolbarItem>
        <EditorToolbarItem value="numbered" aria-label="numbered list">
          <Icon src={listOrderedIcon} />
        </EditorToolbarItem>
      </EditorToolbarGroup>

      <EditorToolbarSeparator />

      <EditorToolbarButton
        onPress={() => {
          runCommand(wrapIn(nodes.blockquote));
        }}
        aria-label="Blockquote"
      >
        <Icon src={quoteIcon} />
      </EditorToolbarButton>

      <EditorToolbarSeparator />

      <EditorToolbarGroup
        value={
          isMarkActive(state.schema.marks.code)(state)
            ? 'code'
            : ((state: EditorState) => {
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
              })(state)
            ? 'code-block'
            : null
        }
        selectionMode="single"
        aria-label="Code formatting"
      >
        <EditorToolbarItem value="code" aria-label="Code">
          <Icon src={codeIcon} />
        </EditorToolbarItem>
        <EditorToolbarItem value="code-block" aria-label="Code block">
          <Icon src={fileCodeIcon} />
        </EditorToolbarItem>
      </EditorToolbarGroup>
    </EditorToolbar>
  );
}

export function Toolbar() {
  const { nodes } = useEditorSchema();
  return (
    <div>
      <NewToolbar />
      <ToolbarContainer>
        <ToolbarScrollArea>
          <HeadingMenu headingType={nodes.heading} />
          <InlineMarks />
          <ListButtons />
          <ToolbarGroup>
            <TooltipTrigger>
              <EditorToolbarButton_OLD
                command={insertNode(nodes.divider)}
                aria-label="Divider"
              >
                <Icon src={minusIcon} />
              </EditorToolbarButton_OLD>
              <Tooltip>
                <Text>Divider</Text>
                <Kbd>---</Kbd>
              </Tooltip>
            </TooltipTrigger>
            <TooltipTrigger>
              <EditorToolbarButton_OLD
                aria-label="Quote"
                command={wrapIn(nodes.blockquote)}
              >
                <Icon src={quoteIcon} />
              </EditorToolbarButton_OLD>
              <Tooltip>
                <Text>Quote</Text>
                <Kbd>{'>⎵'}</Kbd>
              </Tooltip>
            </TooltipTrigger>
            <TooltipTrigger>
              <EditorToolbarButton_OLD
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
              </EditorToolbarButton_OLD>
              <Tooltip>
                <Text>Code block</Text>
                <Kbd>```</Kbd>
              </Tooltip>
            </TooltipTrigger>
          </ToolbarGroup>
        </ToolbarScrollArea>
        <InsertBlockMenu />
      </ToolbarContainer>
    </div>
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

// function canInsert(state: EditorState, nodeType: NodeType) {
//   let $from = state.selection.$from;
//   for (let d = $from.depth; d >= 0; d--) {
//     let index = $from.index(d);
//     if ($from.node(d).canReplaceWith(index, index, nodeType)) return true;
//   }
//   return false;
// }

function ListButtons() {
  const state = useEditorState();
  const schema = useEditorSchema();
  const dispatchCommand = useEditorDispatchCommand();

  const canWrapInOrderedList =
    !!schema.nodes.ordered_list && toggleList(schema.nodes.ordered_list)(state);
  const canWrapInUnorderedList =
    !!schema.nodes.unordered_list &&
    toggleList(schema.nodes.unordered_list)(state);

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
          canWrapInOrderedList && 'ordered',
          canWrapInUnorderedList && 'unordered',
        ].filter(removeFalse)}
        summaryIcon={<Icon src={listIcon} />}
        selectedKeys={[]}
        // selectedKeys={selectedKeys}
        onAction={key => {
          const format = key as 'ordered' | 'unordered';
          const type = schema.nodes[`${format}_list`];
          if (type) {
            console.log('yes');
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
  }, [canWrapInOrderedList, canWrapInUnorderedList, dispatchCommand, schema]);
}

function removeFalse<T>(val: T): val is Exclude<T, false> {
  return val !== false;
}
