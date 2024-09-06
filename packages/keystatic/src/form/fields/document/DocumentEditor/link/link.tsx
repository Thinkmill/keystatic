import { useLocalizedStringFormatter } from '@react-aria/i18n';
import { useEffect, useMemo, useState } from 'react';
import { Editor, Node, Range, Transforms } from 'slate';
import { ReactEditor, RenderElementProps, useSlateStatic } from 'slate-react';

import { ActionButton, Button, ButtonGroup } from '@keystar/ui/button';
import {
  Dialog,
  DialogContainer,
  useDialogContainer,
} from '@keystar/ui/dialog';
import { Icon } from '@keystar/ui/icon';
import { editIcon } from '@keystar/ui/icon/icons/editIcon';
import { externalLinkIcon } from '@keystar/ui/icon/icons/externalLinkIcon';
import { linkIcon } from '@keystar/ui/icon/icons/linkIcon';
import { unlinkIcon } from '@keystar/ui/icon/icons/unlinkIcon';
import { Flex } from '@keystar/ui/layout';
import { Content } from '@keystar/ui/slots';
import { TextField } from '@keystar/ui/text-field';
import { TooltipTrigger, Tooltip } from '@keystar/ui/tooltip';
import { Heading, Text } from '@keystar/ui/typography';

import l10nMessages from '../../../../../app/l10n';
import {
  BlockPopover,
  BlockPopoverTrigger,
  useActiveBlockPopover,
} from '../primitives';
import { useToolbarState } from '../toolbar-state';
import { isValidURL } from '../isValidURL';
import { isElementActive } from '../utils';
import {
  useElementWithSetNodes,
  useEventCallback,
  focusWithPreviousSelection,
} from '../ui-utils';

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
  const editor = useSlateStatic();
  const [currentElement, setNode] = useElementWithSetNodes(
    editor,
    __elementForGettingPath
  );
  const href = currentElement.href;
  const text = Node.string(currentElement);

  const [dialogOpen, setDialogOpen] = useState(false);
  const activePopoverElement = useActiveBlockPopover();
  const selected = activePopoverElement === __elementForGettingPath;

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
      <BlockPopoverTrigger element={__elementForGettingPath}>
        <a href={href} {...attributes}>
          {children}
        </a>

        <BlockPopover placement="bottom start">
          <Flex gap="small" padding="regular">
            <TooltipTrigger>
              <ActionButton
                prominence="low"
                onPress={() => setDialogOpen(true)}
              >
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
        </BlockPopover>
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
          if (event.target !== event.currentTarget) return;
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
