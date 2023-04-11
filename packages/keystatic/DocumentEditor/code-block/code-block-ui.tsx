import { useMemo, useRef, useState } from 'react';
import { Transforms } from 'slate';
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

import { useToolbarState } from '../toolbar-state';
import {
  BlockPopover,
  BlockPopoverTrigger,
  BlockWrapper,
  ToolbarSeparator,
} from '../primitives';
import {
  aliasesToCanonicalName,
  aliasesToLabel,
  canonicalNameToLabel,
  labelToCanonicalName,
  languagesWithAliases,
} from './languages';

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
              width="scale.2000"
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
                } else if (typeof selection === 'string') {
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
                  const label = canonicalNameToLabel.get(selection);
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
