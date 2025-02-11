import { Editor, Element, Node, Path, Transforms } from 'slate';

import { isElementActive } from '../utils';
import { getListTypeAbove, useToolbarState } from '../toolbar-state';
import { ActionGroup, Item } from '@keystar/ui/action-group';
import { Kbd, Text } from '@keystar/ui/typography';
import { listIcon } from '@keystar/ui/icon/icons/listIcon';
import { listOrderedIcon } from '@keystar/ui/icon/icons/listOrderedIcon';
import { ReactEditor, RenderElementProps } from 'slate-react';
import {
  createContext,
  forwardRef,
  HTMLAttributes,
  ReactNode,
  Ref,
  useContext,
  useMemo,
} from 'react';
import { Flex } from '@keystar/ui/layout';
import { css, tokenSchema } from '@keystar/ui/style';
import { Icon } from '@keystar/ui/icon';
import { isBlock } from '../editor';
import { isListNode } from './with-list';

export const toggleList = (
  editor: Editor,
  format: 'ordered-list' | 'unordered-list'
) => {
  const listAbove = getListTypeAbove(editor);
  const isActive =
    isElementActive(editor, format) &&
    (listAbove === 'none' || listAbove === format);
  Editor.withoutNormalizing(editor, () => {
    Transforms.unwrapNodes(editor, {
      match: isListNode,
      split: true,
      mode: isActive ? 'all' : 'lowest',
    });
    if (!isActive) {
      Transforms.wrapNodes(
        editor,
        { type: format, children: [] },
        {
          match: x => x.type !== 'list-item-content' && isBlock(x),
        }
      );
    }
  });
};

export function ListButtons(props: {
  lists: { ordered: boolean; unordered: boolean };
}) {
  const { editor, lists } = useToolbarState();
  return useMemo(() => {
    const disabledKeys: string[] = [];
    if (lists.ordered.isDisabled) disabledKeys.push('ordered');
    if (lists.unordered.isDisabled) disabledKeys.push('unordered');
    const selectedKeys: string[] = [];
    if (lists.ordered.isSelected) selectedKeys.push('ordered');
    if (lists.unordered.isSelected) selectedKeys.push('unordered');

    return (
      <ActionGroup
        flexShrink={0}
        aria-label="Lists"
        selectionMode="single"
        buttonLabelBehavior="hide"
        density="compact"
        // overflowMode="collapse"
        prominence="low"
        summaryIcon={<Icon src={listIcon} />}
        selectedKeys={selectedKeys}
        disabledKeys={disabledKeys}
        onAction={key => {
          const format = `${key as 'ordered' | 'unordered'}-list` as const;
          toggleList(editor, format);
          ReactEditor.focus(editor);
        }}
      >
        {[
          props.lists.unordered && (
            <Item key="unordered" textValue="Bullet List (- )">
              <Icon src={listIcon} />
              <Text>Bullet List</Text>
              <Kbd>-⎵</Kbd>
            </Item>
          ),
          props.lists.ordered && (
            <Item key="ordered" textValue="Numbered List (1.)">
              <Icon src={listOrderedIcon} />
              <Text>Numbered List</Text>
              <Kbd>1.⎵</Kbd>
            </Item>
          ),
        ].filter((x): x is Exclude<typeof x, false> => x !== false)}
      </ActionGroup>
    );
  }, [
    editor,
    lists.ordered.isDisabled,
    lists.ordered.isSelected,
    lists.unordered.isDisabled,
    lists.unordered.isSelected,
    props.lists.ordered,
    props.lists.unordered,
  ]);
}

export function nestList(editor: Editor) {
  const block = Editor.above(editor, { match: isBlock });

  if (!block || block[0].type !== 'list-item-content') {
    return false;
  }
  const listItemPath = Path.parent(block[1]);
  // we're the first item in the list therefore we can't nest
  if (listItemPath[listItemPath.length - 1] === 0) {
    return false;
  }
  const previousListItemPath = Path.previous(listItemPath);
  const previousListItemNode = Node.get(
    editor,
    previousListItemPath
  ) as Element;
  if (previousListItemNode.children.length !== 1) {
    // there's a list nested inside our previous sibling list item so move there
    Transforms.moveNodes(editor, {
      at: listItemPath,
      to: [
        ...previousListItemPath,
        previousListItemNode.children.length - 1,
        (
          previousListItemNode.children[
            previousListItemNode.children.length - 1
          ] as any
        ).children.length,
      ],
    });
    return true;
  }
  const type = Editor.parent(editor, Path.parent(block[1]))[0].type as
    | 'ordered-list'
    | 'unordered-list';
  Editor.withoutNormalizing(editor, () => {
    Transforms.wrapNodes(editor, { type, children: [] }, { at: listItemPath });
    Transforms.moveNodes(editor, {
      to: [...previousListItemPath, previousListItemNode.children.length],
      at: listItemPath,
    });
  });
  return true;
}

export function unnestList(editor: Editor) {
  const block = Editor.above(editor, {
    match: isBlock,
  });

  if (block && block[0].type === 'list-item-content') {
    Transforms.unwrapNodes(editor, {
      match: isListNode,
      split: true,
    });
    return true;
  }
  return false;
}

export const listCounter = 'keystatic-ol-counter';
type ListType = 'ul' | 'ol';
const ListContext = createContext<ListType>('ul');
export const ListElement = forwardRef(function ListElement(
  {
    elementType,
    ...props
  }: HTMLAttributes<HTMLElement> & { elementType: ListType },
  ref: Ref<HTMLElement>
) {
  return (
    <ListContext.Provider value={elementType}>
      <Flex
        direction="column"
        gap="medium"
        paddingStart="large"
        elementType={elementType}
        UNSAFE_className={css({
          counterReset: listCounter,
        })}
        ref={ref}
        {...props}
      />
    </ListContext.Provider>
  );
});

export const ListItem = forwardRef(function ListItem(
  props: Omit<RenderElementProps['attributes'], 'ref'> & {
    children: ReactNode;
  },
  ref: Ref<HTMLElement>
) {
  const type = useContext(ListContext);
  const commonStyles = {
    height: tokenSchema.typography.text.medium.capheight,
    width: '1em',
  };
  const className =
    type === 'ol'
      ? css({
          ...commonStyles,
          color: tokenSchema.color.foreground.neutral,
          fontSize: tokenSchema.typography.text.medium.size,
          '::before': {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            content: `counter(${listCounter}) "."`,
            counterIncrement: listCounter,
            fontFamily: tokenSchema.typography.fontFamily.base,
          },
        })
      : css(commonStyles);
  const bullet =
    type === 'ol' ? null : (
      <Text size="small" color="neutral">
        •
      </Text>
    );

  return (
    <Flex gap="small" alignItems="center" elementType="li">
      <Flex
        aria-hidden="true"
        alignItems="center"
        flexShrink={0}
        justifyContent={type === 'ul' ? 'center' : 'start'}
        userSelect="none"
        UNSAFE_className={className}
      >
        {bullet}
      </Flex>
      <Text size="medium" {...props} ref={ref} />
    </Flex>
  );
});
