import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { Editor, Node, Range, Transforms, Text as SlateText } from 'slate';
import { ReactEditor, RenderElementProps, useFocused, useSelected } from 'slate-react';
import { useOverlayTrigger } from '@react-aria/overlays';
import { useOverlayTriggerState } from '@react-stately/overlays';

import { ActionButton } from '@voussoir/button';
import { linkIcon } from '@voussoir/icon/icons/linkIcon';
import { unlinkIcon } from '@voussoir/icon/icons/unlinkIcon';
import { externalLinkIcon } from '@voussoir/icon/icons/externalLinkIcon';
import { Icon } from '@voussoir/icon';
import { Flex } from '@voussoir/layout';
import { TextLink } from '@voussoir/link';
import { Popover } from '@voussoir/overlays';
import { TextField } from '@voussoir/text-field';
import { TooltipTrigger, Tooltip } from '@voussoir/tooltip';
import { Text } from '@voussoir/typography';

import { isInlineContainer } from '.';
import { DocumentFeatures } from './document-features';
import { ComponentBlock } from './component-blocks/api';
import { getAncestorComponentChildFieldDocumentFeatures, useToolbarState } from './toolbar-state';
import { isValidURL } from './isValidURL';
import {
  EditorAfterButIgnoringingPointsWithNoContent,
  isElementActive,
  useElementWithSetNodes,
  useForceValidation,
  useStaticEditor,
  useEventCallback,
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
  const editor = useStaticEditor();
  const [currentElement, setNode] = useElementWithSetNodes(editor, __elementForGettingPath);
  const href = currentElement.href;

  const selected = useSelected();
  const focused = useFocused();
  const [focusedInInlineDialog, setFocusedInInlineDialog] = useState(false);
  // we want to show the link dialog when the editor is focused and the link element is selected
  // or when the input inside the dialog is focused so you would think that would look like this:
  // (selected && focused) || focusedInInlineDialog
  // this doesn't work though because the blur will happen before the focus is inside the inline dialog
  // so this component would be rendered and focused would be false so the input would be removed so it couldn't be focused
  // to fix this, we delay our reading of the updated `focused` value so that we'll still render the dialog
  // immediately after the editor is blurred but before the input has been focused
  const [delayedFocused, setDelayedFocused] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => {
      setDelayedFocused(focused);
    }, 0);
    return () => {
      clearTimeout(id);
    };
  }, [focused]);
  const [localForceValidation, setLocalForceValidation] = useState(false);

  const unlink = useEventCallback(() => {
    Transforms.unwrapNodes(editor, {
      at: ReactEditor.findPath(editor, __elementForGettingPath),
    });
    ReactEditor.focus(editor);
  });
  const forceValidation = useForceValidation();
  const showInvalidState = isValidURL(href) ? false : forceValidation || localForceValidation;
  const triggerRef = useRef(null);
  const state = useOverlayTriggerState({
    isOpen: (selected && delayedFocused) || focusedInInlineDialog,
  });
  const { triggerProps, overlayProps } = useOverlayTrigger({ type: 'dialog' }, state, triggerRef);
  return (
    <span {...attributes} style={{ position: 'relative', display: 'inline-block' }}>
      <Text trim={false}>
        <TextLink
          {...triggerProps}
          // @ts-expect-error
          style={{
            color: showInvalidState ? 'red' : undefined,
          }}
          ref={triggerRef}
          href={href}
        >
          {children}
        </TextLink>
      </Text>
      <Popover isNonModal {...overlayProps} triggerRef={triggerRef} state={state}>
        <Flex
          onFocus={() => {
            setFocusedInInlineDialog(true);
          }}
          onBlur={() => {
            setFocusedInInlineDialog(false);
            setLocalForceValidation(true);
          }}
          padding="medium"
          gap="regular"
        >
          <TextField
            aria-label="Link URL"
            value={href}
            onChange={href => {
              setNode({ href });
            }}
            errorMessage={showInvalidState && <Text>Please enter a valid URL</Text>}
          />
          <Flex>
            <TooltipTrigger>
              <ActionButton
                prominence="low"
                onPress={() => window.open(href, '_blank', 'noopener,noreferrer')}
              >
                <Icon src={externalLinkIcon} />
              </ActionButton>
              <Tooltip tone="accent">Open link in new tab</Tooltip>
            </TooltipTrigger>
            <UnlinkButton onUnlink={unlink} />
          </Flex>
        </Flex>
      </Popover>
    </span>
  );
};

const UnlinkButton = memo(function UnlinkButton({ onUnlink }: { onUnlink: () => void }) {
  return (
    <TooltipTrigger>
      <ActionButton
        prominence="low"
        onPress={() => {
          onUnlink();
        }}
      >
        <Icon src={unlinkIcon} />
      </ActionButton>
      <Tooltip tone="critical">
        <Text>Unlink</Text>
      </Tooltip>
    </TooltipTrigger>
  );
});

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
        Editor.above(editor, { match: node => Editor.isBlock(editor, node) })![1]
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
      if (ancestorComponentChildFieldDocumentFeatures?.documentFeatures.links === false) {
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
      const endOfLinkText = EditorAfterButIgnoringingPointsWithNoContent(editor, startOfLinkText, {
        distance: linkText.length,
      })!;

      Transforms.delete(editor, {
        at: { anchor: endOfLinkText, focus: editor.selection.anchor },
      });
      Transforms.delete(editor, {
        at: { anchor: startOfShortcut, focus: startOfLinkText },
      });

      Transforms.wrapNodes(
        editor,
        { type: 'link', href, children: [] },
        { at: { anchor: editor.selection.anchor, focus: startOfShortcut }, split: true }
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
      let lastMergableLink: { index: number; node: Node & { type: 'link' } } | null = null;
      for (const [idx, child] of node.children.entries()) {
        if (child.type === 'link' && child.href === lastMergableLink?.node.href) {
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
