import { useLocalizedStringFormatter } from '@react-aria/i18n';
import { useEffect, useMemo, useState } from 'react';
import { Editor, Node, Range, Transforms, Text as SlateText } from 'slate';
import { ReactEditor, RenderElementProps } from 'slate-react';

import { ActionButton, Button, ButtonGroup } from '@voussoir/button';
import { Dialog, DialogContainer, useDialogContainer } from '@voussoir/dialog';
import { Icon } from '@voussoir/icon';
import { editIcon } from '@voussoir/icon/icons/editIcon';
import { externalLinkIcon } from '@voussoir/icon/icons/externalLinkIcon';
import { linkIcon } from '@voussoir/icon/icons/linkIcon';
import { unlinkIcon } from '@voussoir/icon/icons/unlinkIcon';
import { Flex } from '@voussoir/layout';
import { Content } from '@voussoir/slots';
import { TextField } from '@voussoir/text-field';
import { TooltipTrigger, Tooltip } from '@voussoir/tooltip';
import { Heading, Text } from '@voussoir/typography';

import l10nMessages from '../app/l10n/index.json';
import { isInlineContainer } from '.';
import { BlockPopoverTrigger } from './BlockPopoverTrigger';
import { DocumentFeatures } from './document-features';
import { ComponentBlock } from './component-blocks/api';
import {
  getAncestorComponentChildFieldDocumentFeatures,
  useToolbarState,
} from './toolbar-state';
import { isValidURL } from './isValidURL';
import {
  EditorAfterButIgnoringingPointsWithNoContent,
  isElementActive,
  useElementWithSetNodes,
  useStaticEditor,
  useEventCallback,
  useSelectedOrFocusWithin,
  focusWithPreviousSelection,
} from './utils';

const isLinkActive = (editor: Editor) => {
  return isElementActive(editor, 'link');
};

export const wrapLink = (editor: Editor, url: string) => {
  if (isLinkActive(editor)) {
    Transforms.unwrapNodes(editor, { match: n => n.type === 'link' });
    return;
  }

  const { selection } = editor;
  const isCollapsed = selection && Range.isCollapsed(selection);

  if (isCollapsed) {
    Transforms.insertNodes(editor, {
      type: 'link',
      href: url,
      children: [{ text: url }],
    });
  } else {
    Transforms.wrapNodes(
      editor,
      {
        type: 'link',
        href: url,
        children: [{ text: '' }],
      },
      { split: true }
    );
  }
};

export const LinkElement = ({
  attributes,
  children,
  element: __elementForGettingPath,
}: RenderElementProps & { element: { type: 'link' } }) => {
  const stringFormatter = useLocalizedStringFormatter(l10nMessages);
  const editor = useStaticEditor();
  const [currentElement, setNode] = useElementWithSetNodes(
    editor,
    __elementForGettingPath
  );
  const href = currentElement.href;
  const text = Node.string(currentElement);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selected, targetProps] = useSelectedOrFocusWithin();

  useEffect(() => {
    if (selected && !href) {
      setDialogOpen(true);
    }
  }, [href, selected]);

  const unlink = useEventCallback(() => {
    Transforms.unwrapNodes(editor, {
      at: ReactEditor.findPath(editor, __elementForGettingPath),
    });
    ReactEditor.focus(editor);
  });

  return (
    <>
      <BlockPopoverTrigger
        isOpen={!dialogOpen && selected}
        // placement="bottom start"
      >
        <a href={href} {...attributes}>
          {children}
        </a>

        <Flex gap="small" padding="regular" {...targetProps}>
          <TooltipTrigger>
            <ActionButton prominence="low" onPress={() => setDialogOpen(true)}>
              <Icon src={editIcon} />
            </ActionButton>
            <Tooltip>{stringFormatter.format('edit')}</Tooltip>
          </TooltipTrigger>
          <TooltipTrigger>
            <ActionButton
              prominence="low"
              onPress={() => {
                window.open(href, '_blank', 'noopener,noreferrer');
              }}
            >
              <Icon src={externalLinkIcon} />
            </ActionButton>
            <Tooltip>
              <Text truncate={3}>{href}</Text>
            </Tooltip>
          </TooltipTrigger>
          <TooltipTrigger>
            <ActionButton prominence="low" onPress={unlink}>
              <Icon src={unlinkIcon} />
            </ActionButton>
            {/* TODO: needs localization */}
            <Tooltip>Unlink</Tooltip>
          </TooltipTrigger>
        </Flex>
      </BlockPopoverTrigger>
      <DialogContainer
        onDismiss={() => {
          setDialogOpen(false);
          focusWithPreviousSelection(editor);
        }}
      >
        {dialogOpen && (
          <LinkDialog
            text={text}
            href={href}
            onSubmit={({ href }) => {
              setNode({ href });
            }}
          />
        )}
      </DialogContainer>
    </>
  );
};

function LinkDialog({
  onSubmit,
  ...props
}: {
  href?: string;
  text?: string;
  onSubmit: (value: { href: string }) => void;
}) {
  let [href, setHref] = useState(props.href || '');
  let [touched, setTouched] = useState(false);

  let { dismiss } = useDialogContainer();
  let stringFormatter = useLocalizedStringFormatter(l10nMessages);
  const showInvalidState = touched && !isValidURL(href);

  return (
    <Dialog size="small">
      <form
        style={{ display: 'contents' }}
        onSubmit={event => {
          event.preventDefault();
          if (!showInvalidState) {
            dismiss();
            onSubmit({ href });
          }
        }}
      >
        <Heading>{props.href ? 'Edit' : 'Add'} link</Heading>
        <Content>
          <Flex gap="large" direction="column">
            <TextField label="Text" value={props.text} isReadOnly />
            <TextField
              autoFocus
              isRequired
              onBlur={() => setTouched(true)}
              label="Link"
              onChange={setHref}
              value={href}
              errorMessage={showInvalidState && 'Please provide a valid URL.'}
            />
          </Flex>
        </Content>
        <ButtonGroup>
          <Button onPress={dismiss}>{stringFormatter.format('cancel')}</Button>
          <Button prominence="high" type="submit">
            {stringFormatter.format('save')}
          </Button>
        </ButtonGroup>
      </form>
    </Dialog>
  );
}

let _linkIcon = <Icon src={linkIcon} />;

function LinkButton() {
  const {
    editor,
    links: { isDisabled, isSelected },
  } = useToolbarState();
  return useMemo(
    () => (
      <ActionButton
        prominence="low"
        isDisabled={isDisabled}
        isSelected={isSelected}
        onPress={() => {
          wrapLink(editor, '');
          ReactEditor.focus(editor);
        }}
      >
        {_linkIcon}
      </ActionButton>
    ),
    [isSelected, isDisabled, editor]
  );
}

export const linkButton = (
  <TooltipTrigger>
    <LinkButton />
    <Tooltip>
      <Text>Link</Text>
    </Tooltip>
  </TooltipTrigger>
);

const markdownLinkPattern = /(^|\s)\[(.+?)\]\((\S+)\)$/;

export function withLink(
  editorDocumentFeatures: DocumentFeatures,
  componentBlocks: Record<string, ComponentBlock>,
  editor: Editor
): Editor {
  const { insertText, isInline, normalizeNode } = editor;

  editor.isInline = element => {
    return element.type === 'link' ? true : isInline(element);
  };

  if (editorDocumentFeatures.links) {
    editor.insertText = text => {
      insertText(text);
      if (text !== ')' || !editor.selection) return;
      const startOfBlock = Editor.start(
        editor,
        Editor.above(editor, {
          match: node => Editor.isBlock(editor, node),
        })![1]
      );

      const startOfBlockToEndOfShortcutString = Editor.string(editor, {
        anchor: editor.selection.anchor,
        focus: startOfBlock,
      });
      const match = markdownLinkPattern.exec(startOfBlockToEndOfShortcutString);
      if (!match) return;
      const ancestorComponentChildFieldDocumentFeatures =
        getAncestorComponentChildFieldDocumentFeatures(
          editor,
          editorDocumentFeatures,
          componentBlocks
        );
      if (
        ancestorComponentChildFieldDocumentFeatures?.documentFeatures.links ===
        false
      ) {
        return;
      }
      const [, maybeWhitespace, linkText, href] = match;
      // by doing this, the insertText(')') above will happen in a different undo than the link replacement
      // so that means that when someone does an undo after this
      // it will undo to the state of "[content](link)" rather than "[content](link" (note the missing closing bracket)
      editor.history.undos.push([]);
      const startOfShortcut =
        match.index === 0
          ? startOfBlock
          : EditorAfterButIgnoringingPointsWithNoContent(editor, startOfBlock, {
              distance: match.index,
            })!;
      const startOfLinkText = EditorAfterButIgnoringingPointsWithNoContent(
        editor,
        startOfShortcut,
        {
          distance: maybeWhitespace === '' ? 1 : 2,
        }
      )!;
      const endOfLinkText = EditorAfterButIgnoringingPointsWithNoContent(
        editor,
        startOfLinkText,
        {
          distance: linkText.length,
        }
      )!;

      Transforms.delete(editor, {
        at: { anchor: endOfLinkText, focus: editor.selection.anchor },
      });
      Transforms.delete(editor, {
        at: { anchor: startOfShortcut, focus: startOfLinkText },
      });

      Transforms.wrapNodes(
        editor,
        { type: 'link', href, children: [] },
        {
          at: { anchor: editor.selection.anchor, focus: startOfShortcut },
          split: true,
        }
      );
      const nextNode = Editor.next(editor);
      if (nextNode) {
        Transforms.select(editor, nextNode[1]);
      }
    };
  }

  editor.normalizeNode = ([node, path]) => {
    if (node.type === 'link') {
      if (Node.string(node) === '') {
        Transforms.unwrapNodes(editor, { at: path });
        return;
      }
      for (const [idx, child] of node.children.entries()) {
        if (child.type === 'link') {
          // links cannot contain links
          Transforms.unwrapNodes(editor, { at: [...path, idx] });
          return;
        }
      }
    }
    if (isInlineContainer(node)) {
      let lastMergableLink: {
        index: number;
        node: Node & { type: 'link' };
      } | null = null;
      for (const [idx, child] of node.children.entries()) {
        if (
          child.type === 'link' &&
          child.href === lastMergableLink?.node.href
        ) {
          const firstLinkPath = [...path, lastMergableLink.index];
          const secondLinkPath = [...path, idx];
          const to = [...firstLinkPath, lastMergableLink.node.children.length];
          // note this is going in reverse, js doesn't have double-ended iterators so it's a for(;;)
          for (let i = child.children.length - 1; i >= 0; i--) {
            const childPath = [...secondLinkPath, i];
            Transforms.moveNodes(editor, { at: childPath, to });
          }
          Transforms.removeNodes(editor, { at: secondLinkPath });
          return;
        }
        if (!SlateText.isText(child) || child.text !== '') {
          lastMergableLink = null;
        }
        if (child.type === 'link') {
          lastMergableLink = { index: idx, node: child };
        }
      }
    }
    normalizeNode([node, path]);
  };

  return editor;
}
