import { useMemo, useRef, useState } from 'react';
import { Editor, Transforms, Element, Text as SlateText, Range, Point } from 'slate';
import { ReactEditor, RenderElementProps, useSelected, useSlateStatic } from 'slate-react';
import { useOverlayTrigger } from '@react-aria/overlays';
import { Item } from '@react-stately/collections';
import { useOverlayTriggerState } from '@react-stately/overlays';

import { ActionButton } from '@voussoir/button';
import { codeIcon } from '@voussoir/icon/icons/codeIcon';
import { Icon } from '@voussoir/icon';
import { Flex } from '@voussoir/layout';
import { Popover } from '@voussoir/overlays';
import { Picker } from '@voussoir/picker';
import { css, tokenSchema } from '@voussoir/style';
import { Tooltip, TooltipTrigger } from '@voussoir/tooltip';
import { Kbd, Text } from '@voussoir/typography';

import Prism from './prism';
import { useToolbarState } from './toolbar-state';

export function withCodeBlock(editor: Editor): Editor {
  const { insertBreak, normalizeNode } = editor;

  editor.insertBreak = () => {
    const [node, path] = Editor.above(editor, {
      match: n => Editor.isBlock(editor, n),
    }) || [editor, []];
    if (node.type === 'code' && SlateText.isText(node.children[0])) {
      const text = node.children[0].text;
      if (
        text[text.length - 1] === '\n' &&
        editor.selection &&
        Range.isCollapsed(editor.selection) &&
        Point.equals(Editor.end(editor, path), editor.selection.anchor)
      ) {
        insertBreak();
        Transforms.setNodes(editor, { type: 'paragraph', children: [] });
        Transforms.delete(editor, {
          distance: 1,
          at: { path: [...path, 0], offset: text.length - 1 },
        });
        return;
      }
      editor.insertText('\n');
      return;
    }
    insertBreak();
  };
  editor.normalizeNode = ([node, path]) => {
    if (node.type === 'code' && Element.isElement(node)) {
      for (const [index, childNode] of node.children.entries()) {
        if (!SlateText.isText(childNode)) {
          if (editor.isVoid(childNode)) {
            Transforms.removeNodes(editor, { at: [...path, index] });
          } else {
            Transforms.unwrapNodes(editor, { at: [...path, index] });
          }
          return;
        }
        const marks = Object.keys(childNode).filter(x => x !== 'text');
        if (marks.length) {
          Transforms.unsetNodes(editor, marks, { at: [...path, index] });
          return;
        }
      }
    }
    normalizeNode([node, path]);
  };

  return editor;
}

function CodeButton() {
  const {
    editor,
    code: { isDisabled, isSelected },
  } = useToolbarState();

  return useMemo(
    () => (
      <ActionButton
        isSelected={isSelected}
        isDisabled={isDisabled}
        prominence="low"
        onPress={() => {
          if (isSelected) {
            Transforms.unwrapNodes(editor, {
              match: node => node.type === 'code',
            });
          } else {
            Transforms.wrapNodes(editor, {
              type: 'code',
              children: [{ text: '' }],
            });
          }
          ReactEditor.focus(editor);
        }}
      >
        <Icon src={codeIcon} />
      </ActionButton>
    ),
    [isDisabled, isSelected, editor]
  );
}

export const codeButton = (
  <TooltipTrigger>
    <CodeButton />
    <Tooltip>
      <Text>Code block</Text>
      <Kbd>```</Kbd>
    </Tooltip>
  </TooltipTrigger>
);

export function CodeElement({
  attributes,
  children,
  element,
}: RenderElementProps & { element: { type: 'code' } }) {
  const editor = useSlateStatic();
  const triggerRef = useRef(null);
  const selected = useSelected();

  const [isOpen, setIsOpen] = useState(false);

  const state = useOverlayTriggerState({
    isOpen: selected,
  });

  const {
    triggerProps: { onPress: _onPress, ...triggerProps },
    overlayProps,
  } = useOverlayTrigger({ type: 'dialog' }, state, triggerRef);

  return (
    <>
      <Flex
        elementType="pre"
        backgroundColor="surface"
        borderRadius="medium"
        maxWidth="100%"
        overflow="auto"
        padding="medium"
        spellCheck="false"
        UNSAFE_className={css({
          color: tokenSchema.color.foreground.neutralEmphasis,
          fontFamily: tokenSchema.typography.fontFamily.code,
          fontSize: '0.85em',
          lineHeight: tokenSchema.typography.lineheight.medium,

          code: {
            fontFamily: 'inherit',
          },
        })}
        ref={triggerRef}
        {...(triggerProps as any)}
      >
        <code {...attributes}>{children}</code>
      </Flex>
      <Popover isNonModal {...overlayProps} triggerRef={triggerRef} state={state}>
        <Flex padding="medium" gap="regular">
          <Picker
            aria-label="Language"
            onOpenChange={open => {
              setIsOpen(open);
            }}
            isOpen={isOpen}
            onSelectionChange={selection => {
              const path = ReactEditor.findPath(editor, element);
              if (selection === 'none') {
                Transforms.unsetNodes(editor, 'language', { at: path });
              } else {
                Transforms.setNodes(editor, { language: selection as string }, { at: path });
              }
            }}
            selectedKey={
              element.language === undefined ? 'none' : aliasesToCanonicalName.get(element.language)
            }
            items={languages}
          >
            {item => <Item key={item.value}>{item.label}</Item>}
          </Picker>
        </Flex>
      </Popover>
    </>
  );
}

const languages = [
  { label: 'None', value: 'none' },
  { label: 'C', value: 'c' },
  { label: 'C++', value: 'cpp' },
  { label: 'Arduino', value: 'arduino' },
  { label: 'Bash', value: 'bash' },
  { label: 'C#', value: 'csharp' },
  { label: 'CSS', value: 'css' },
  { label: 'Diff', value: 'diff' },
  { label: 'Go', value: 'go' },
  { label: 'INI', value: 'ini' },
  { label: 'Java', value: 'java' },
  { label: 'JavaScript', value: 'javascript' },
  { label: 'JSX', value: 'jsx' },
  { label: 'JSON', value: 'json' },
  { label: 'Kotlin', value: 'kotlin' },
  { label: 'Less', value: 'less' },
  { label: 'Lua', value: 'lua' },
  { label: 'Makefile', value: 'makefile' },
  { label: 'Markdown', value: 'markdown' },
  { label: 'Objective-C', value: 'objectivec' },
  { label: 'Perl', value: 'perl' },
  { label: 'PHP', value: 'php' },
  { label: 'Python', value: 'python' },
  { label: 'R', value: 'r' },
  { label: 'Ruby', value: 'ruby' },
  { label: 'Rust', value: 'rust' },
  { label: 'Sass', value: 'sass' },
  { label: 'SCSS', value: 'scss' },
  { label: 'SQL', value: 'sql' },
  { label: 'Swift', value: 'swift' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'TSX', value: 'tsx' },
  { label: 'VB.NET', value: 'vbnet' },
  { label: 'YAML', value: 'yaml' },
];

const languageToCanonicalName = new Map(
  languages.map(lang => [Prism.languages[lang.value], lang.value])
);

const aliasesToCanonicalName = new Map(
  Object.keys(Prism.languages).flatMap(lang => {
    const canonicalName = languageToCanonicalName.get(Prism.languages[lang]);
    if (canonicalName === undefined) {
      return [];
    }
    return [[lang, canonicalName]];
  })
);
