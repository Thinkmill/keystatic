import { useMemo, useRef, useState } from 'react';
import {
  Editor,
  Transforms,
  Element,
  Text as SlateText,
  Range,
  Point,
} from 'slate';
import { ReactEditor, RenderElementProps, useSlateStatic } from 'slate-react';
import { Item } from '@react-stately/collections';
import { matchSorter } from 'match-sorter';

import { ActionButton } from '@voussoir/button';
import { Combobox } from '@voussoir/combobox';
import { codeIcon } from '@voussoir/icon/icons/codeIcon';
import { trash2Icon } from '@voussoir/icon/icons/trash2Icon';
import { Icon } from '@voussoir/icon';
import { Flex } from '@voussoir/layout';
import { css, tokenSchema } from '@voussoir/style';
import { Tooltip, TooltipTrigger } from '@voussoir/tooltip';
import { Kbd, Text } from '@voussoir/typography';

import Prism from './prism';
import { useToolbarState } from './toolbar-state';
import {
  BlockPopover,
  BlockPopoverTrigger,
  BlockWrapper,
  ToolbarSeparator,
} from './primitives';
import { isBlock } from '.';

export function withCodeBlock(editor: Editor): Editor {
  const { insertBreak, normalizeNode } = editor;

  editor.insertBreak = () => {
    const [node, path] = Editor.above(editor, {
      match: isBlock,
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
  const [inputValue, setInputValue] = useState(
    element.language
      ? aliasesToLabel.get(element.language) ?? element.language
      : 'Plain text'
  );
  return (
    <BlockWrapper>
      <BlockPopoverTrigger element={element}>
        <pre
          spellCheck="false"
          className={css({
            backgroundColor: tokenSchema.color.background.surface,
            borderRadius: tokenSchema.size.radius.medium,
            color: tokenSchema.color.foreground.neutralEmphasis,
            fontFamily: tokenSchema.typography.fontFamily.code,
            fontSize: '0.85em',
            lineHeight: tokenSchema.typography.lineheight.medium,
            maxWidth: '100%',
            overflow: 'auto',
            padding: tokenSchema.size.space.medium,

            code: {
              fontFamily: 'inherit',
            },
          })}
          ref={triggerRef}
        >
          <code {...attributes}>{children}</code>
        </pre>
        <BlockPopover>
          <Flex gap="regular" padding="regular">
            <Combobox
              aria-label="Language"
              width="size.scale.2000"
              allowsCustomValue // allow consumers to support other languages
              inputValue={inputValue}
              onInputChange={setInputValue}
              onBlur={() => {
                const path = ReactEditor.findPath(editor, element);
                const canonicalName = aliasesToCanonicalName.get(inputValue);
                if (canonicalName !== undefined) {
                  if (canonicalName === 'plain') {
                    Transforms.unsetNodes(editor, 'language', { at: path });
                    return;
                  }
                  setInputValue(canonicalNameToLabel.get(canonicalName)!);
                  Transforms.setNodes(
                    editor,
                    { language: canonicalName },
                    { at: path }
                  );
                  return;
                }
                const nameFromLabel = labelToCanonicalName.get(inputValue);
                if (nameFromLabel !== undefined) {
                  if (nameFromLabel === 'plain') {
                    Transforms.unsetNodes(editor, 'language', { at: path });
                    return;
                  }
                  Transforms.setNodes(
                    editor,
                    { language: nameFromLabel },
                    { at: path }
                  );
                  return;
                }
                if (inputValue === '') {
                  Transforms.unsetNodes(editor, 'language', { at: path });
                  setInputValue('Plain text');
                  return;
                }
                if (inputValue !== element.language) {
                  Transforms.setNodes(
                    editor,
                    { language: inputValue },
                    { at: path }
                  );
                }
              }}
              onSelectionChange={selection => {
                const path = ReactEditor.findPath(editor, element);
                if (aliasesToCanonicalName.has(inputValue)) {
                  selection = aliasesToCanonicalName.get(inputValue)!;
                }
                if (selection === null) {
                  if (inputValue === '') {
                    Transforms.unsetNodes(editor, 'language', { at: path });
                  } else {
                    Transforms.setNodes(
                      editor,
                      { language: inputValue },
                      { at: path }
                    );
                  }
                } else {
                  if (selection === 'plain') {
                    Transforms.unsetNodes(editor, 'language', { at: path });
                    setInputValue('Plain text');
                    return;
                  }
                  Transforms.setNodes(
                    editor,
                    { language: selection as string },
                    { at: path }
                  );
                  const label = languages.find(
                    lang => lang.value === selection
                  )?.label;
                  if (label) {
                    setInputValue(label);
                  }
                }
              }}
              selectedKey={
                element.language
                  ? aliasesToCanonicalName.get(element.language)
                  : 'plain'
              }
              items={useMemo(
                () =>
                  inputValue === 'Plain text' ||
                  labelToCanonicalName.has(inputValue)
                    ? languagesWithAliases
                    : matchSorter(languagesWithAliases, inputValue, {
                        keys: ['label', 'value', 'aliases'],
                      }),
                [inputValue]
              )}
            >
              {item => <Item key={item.value}>{item.label}</Item>}
            </Combobox>
            <ToolbarSeparator />
            <TooltipTrigger>
              <ActionButton
                prominence="low"
                onPress={() => {
                  Transforms.removeNodes(editor, {
                    at: ReactEditor.findPath(editor, element),
                  });
                }}
              >
                <Icon src={trash2Icon} />
              </ActionButton>
              <Tooltip tone="critical">Remove</Tooltip>
            </TooltipTrigger>
          </Flex>
        </BlockPopover>
      </BlockPopoverTrigger>
    </BlockWrapper>
  );
}

const languages = [
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

const canonicalNameToLabel = new Map(languages.map(x => [x.value, x.label]));
const labelToCanonicalName = new Map(languages.map(x => [x.label, x.value]));

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

const languagesToAliases = new Map(
  languages.map(lang => [lang.value, [] as string[]])
);

for (const [alias, canonicalName] of aliasesToCanonicalName) {
  languagesToAliases.get(canonicalName)!.push(alias);
}
const languagesWithAliases = [
  { label: 'Plain text', value: 'plain', aliases: [] },
  ...[...languagesToAliases].map(([canonicalName, aliases]) => ({
    label: canonicalNameToLabel.get(canonicalName)!,
    value: canonicalName,
    aliases,
  })),
];
const aliasesToLabel = new Map(
  [...aliasesToCanonicalName].map(([alias, canonicalName]) => [
    alias,
    canonicalNameToLabel.get(canonicalName)!,
  ])
);
