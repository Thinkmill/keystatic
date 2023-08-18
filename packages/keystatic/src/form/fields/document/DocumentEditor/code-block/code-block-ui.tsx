import { useMemo, useRef, useState } from 'react';
import { Transforms } from 'slate';
import { ReactEditor, RenderElementProps, useSlateStatic } from 'slate-react';
import { Item } from '@react-stately/collections';
import { matchSorter } from 'match-sorter';

import { ActionButton } from '@keystar/ui/button';
import { Combobox } from '@keystar/ui/combobox';
import { codeIcon } from '@keystar/ui/icon/icons/codeIcon';
import { trash2Icon } from '@keystar/ui/icon/icons/trash2Icon';
import { Icon } from '@keystar/ui/icon';
import { Flex } from '@keystar/ui/layout';
import { Tooltip, TooltipTrigger } from '@keystar/ui/tooltip';
import { Kbd, Text } from '@keystar/ui/typography';

import { useDocumentEditorConfig, useToolbarState } from '../toolbar-state';
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
import {
  CustomAttributesDialog,
  CustomAttributesEditButton,
} from '../custom-attributes';

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

  const [dialogOpen, setDialogOpen] = useState(false);
  const { documentFeatures } = useDocumentEditorConfig();
  const customAttributesSchema =
    documentFeatures.formatting.blockTypes.code &&
    Object.keys(documentFeatures.formatting.blockTypes.code.schema.fields)
      .length
      ? documentFeatures.formatting.blockTypes.code.schema
      : undefined;

  return (
    <>
      <BlockWrapper>
        <BlockPopoverTrigger element={element}>
          <pre spellCheck="false" ref={triggerRef}>
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
              {customAttributesSchema !== undefined && (
                <CustomAttributesEditButton
                  onPress={() => setDialogOpen(true)}
                />
              )}
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
      {customAttributesSchema !== undefined && (
        <CustomAttributesDialog
          element={element}
          isOpen={dialogOpen}
          nodeLabel="Code block"
          schema={customAttributesSchema}
          onDismiss={() => {
            setDialogOpen(false);
          }}
        />
      )}
    </>
  );
}
