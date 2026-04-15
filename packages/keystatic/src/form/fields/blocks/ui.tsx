import { useLocalizedStringFormatter } from '@react-aria/i18n';
import { useField } from '@react-aria/label';
import { useEffect, useMemo, useState } from 'react';

import { Badge } from '@keystar/ui/badge';
import { ActionButton, Button } from '@keystar/ui/button';
import { Dialog, DialogTrigger } from '@keystar/ui/dialog';
import { FieldDescription, FieldLabel, FieldMessage } from '@keystar/ui/field';
import { Icon } from '@keystar/ui/icon';
import { chevronDownIcon } from '@keystar/ui/icon/icons/chevronDownIcon';
import { copyPlusIcon } from '@keystar/ui/icon/icons/copyPlusIcon';
import { plusIcon } from '@keystar/ui/icon/icons/plusIcon';
import { trash2Icon } from '@keystar/ui/icon/icons/trash2Icon';
import { Box, Divider, Flex, Grid, VStack } from '@keystar/ui/layout';
import { Item, Menu, MenuTrigger } from '@keystar/ui/menu';
import { SearchField } from '@keystar/ui/search-field';
import { Content } from '@keystar/ui/slots';
import { css, tokenSchema, transition } from '@keystar/ui/style';
import { Tooltip, TooltipTrigger } from '@keystar/ui/tooltip';
import { Heading, Text } from '@keystar/ui/typography';

import {
  ArrayField,
  BasicFormField,
  ComponentSchema,
  ConditionalField,
  GenericPreviewProps,
} from '../../api';
import {
  ExtraFieldInputProps,
  FormValueContentFromPreviewProps,
} from '../../form-from-preview';
import { previewPropsToValue, valueToUpdater } from '../../get-value';
import { getInitialPropsValue } from '../../initial-values';
import l10nMessages from '../../../app/l10n';
import { useArrayFieldValidationMessage } from '../array/ui';

type BlocksPreviewProps = GenericPreviewProps<
  ArrayField<
    ConditionalField<
      BasicFormField<string> & {
        options: readonly { label: string; value: string | boolean }[];
      },
      {
        [_ in string]: ComponentSchema;
      }
    >
  >,
  unknown
>;

type BlockChangeItem = Parameters<BlocksPreviewProps['onChange']>[0][number];

export function BlocksFieldInput(
  props: BlocksPreviewProps & ExtraFieldInputProps
) {
  const stringFormatter = useLocalizedStringFormatter(l10nMessages);
  const errorMessage = useArrayFieldValidationMessage(props);
  const minLength = props.schema.validation?.length?.min ?? 0;
  const [selectedKey, setSelectedKey] = useState<string | null>(
    props.elements[0]?.key ?? null
  );
  const [pendingSelectionIndex, setPendingSelectionIndex] = useState<
    number | null
  >(null);

  const {
    descriptionProps,
    errorMessageProps,
    fieldProps: groupProps,
    labelProps,
  } = useField({
    description: props.schema.description,
    errorMessage,
    isInvalid: !!errorMessage,
    label: props.schema.label,
    labelElementType: 'span',
  });

  useEffect(() => {
    if (pendingSelectionIndex !== null) {
      const nextSelected = props.elements[pendingSelectionIndex];
      if (nextSelected) {
        setSelectedKey(nextSelected.key);
        setPendingSelectionIndex(null);
        return;
      }
    }

    if (!props.elements.length) {
      if (selectedKey !== null) {
        setSelectedKey(null);
      }
      return;
    }

    if (
      selectedKey === null ||
      !props.elements.some(element => element.key === selectedKey)
    ) {
      setSelectedKey(props.elements[0].key);
    }
  }, [pendingSelectionIndex, props.elements, selectedKey]);

  const selectedIndex = props.elements.findIndex(x => x.key === selectedKey);
  const selectedBlock =
    selectedIndex === -1 ? undefined : props.elements[selectedIndex];

  const addBlock = (
    discriminant: string | boolean,
    index = props.elements.length
  ) => {
    const nextItems: BlockChangeItem[] = props.elements.map(element => ({
      key: element.key,
    }));
    const schemaForBlock = props.schema.element.values[discriminant.toString()];

    nextItems.splice(index, 0, {
      key: undefined,
      value: valueToUpdater(
        {
          discriminant,
          value: getInitialPropsValue(schemaForBlock),
        },
        props.schema.element
      ),
    });

    props.onChange(nextItems);
    setPendingSelectionIndex(index);
  };

  const moveBlock = (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= props.elements.length) {
      return;
    }

    const nextItems: BlockChangeItem[] = props.elements.map(element => ({
      key: element.key,
    }));
    const [moved] = nextItems.splice(index, 1);
    nextItems.splice(targetIndex, 0, moved);
    props.onChange(nextItems);
    setSelectedKey(props.elements[index].key);
  };

  const removeBlock = (key: string) => {
    props.onChange(
      props.elements
        .map(element => ({ key: element.key }))
        .filter(element => element.key !== key)
    );
  };

  const duplicateBlock = (index: number) => {
    const block = props.elements[index];
    const nextItems: BlockChangeItem[] = props.elements.map(element => ({
      key: element.key,
    }));

    nextItems.splice(index + 1, 0, {
      key: undefined,
      value: valueToUpdater(previewPropsToValue(block), props.schema.element),
    });

    props.onChange(nextItems);
    setPendingSelectionIndex(index + 1);
  };

  return (
    <VStack gap="medium" minWidth={0} role="group" {...groupProps}>
      <FieldLabel
        elementType="span"
        isRequired={minLength > 0}
        supplementRequiredState
        {...labelProps}
      >
        {props.schema.label}
      </FieldLabel>
      {props.schema.description && (
        <FieldDescription {...descriptionProps}>
          {props.schema.description}
        </FieldDescription>
      )}

      <Box
        borderRadius="large"
        overflow="hidden"
        UNSAFE_className={css({
          border: `${tokenSchema.size.border.regular} solid ${tokenSchema.color.border.neutral}`,
          background: `linear-gradient(180deg, ${tokenSchema.color.background.surface} 0%, ${tokenSchema.color.background.canvas} 100%)`,
          boxShadow: `0 18px 40px ${tokenSchema.color.shadow.muted}`,
        })}
      >
        <Flex
          alignItems="center"
          justifyContent="space-between"
          gap="regular"
          paddingX={{ mobile: 'large', tablet: 'xlarge' }}
          paddingY="large"
          wrap
          UNSAFE_className={css({
            borderBottom: `${tokenSchema.size.border.regular} solid ${tokenSchema.color.border.muted}`,
            background: `linear-gradient(135deg, ${tokenSchema.color.scale.indigo3} 0%, ${tokenSchema.color.scale.green3} 100%)`,
          })}
        >
          <VStack gap="small">
            <Flex alignItems="center" gap="small" wrap>
              <Heading elementType="h3" size="small">
                Page builder canvas
              </Heading>
              <Badge tone="accent">
                {props.elements.length}{' '}
                {props.elements.length === 1 ? 'block' : 'blocks'}
              </Badge>
            </Flex>
            <Text color="neutralSecondary" size="small">
              Add, reorder, duplicate, and edit blocks without leaving the page.
            </Text>
          </VStack>
          <AddBlockButton
            onAdd={addBlock}
            options={props.schema.element.discriminant.options}
          />
        </Flex>

        <Grid
          columns={{
            mobile: '1fr',
            tablet: 'minmax(0, 1.35fr) minmax(280px, 0.95fr)',
          }}
          gap="large"
        >
          <Box
            padding={{ mobile: 'large', tablet: 'xlarge' }}
            UNSAFE_className={css({
              minHeight: '420px',
            })}
          >
            {props.elements.length ? (
              <VStack gap="medium">
                {props.elements.map((block, index) => {
                  const typeLabel = getBlockTypeLabel(
                    props.schema.element.discriminant.options,
                    block.discriminant
                  );
                  const blockLabel =
                    props.schema.itemLabel?.(block) || typeLabel;
                  const summary = getBlockSummary(block.value);
                  const isSelected = block.key === selectedKey;

                  return (
                    <Box
                      key={block.key}
                      borderRadius="large"
                      padding="large"
                      role="button"
                      tabIndex={0}
                      onClick={() => setSelectedKey(block.key)}
                      onKeyDown={event => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          setSelectedKey(block.key);
                        }
                      }}
                      UNSAFE_className={css({
                        cursor: 'pointer',
                        border: `${tokenSchema.size.border.regular} solid ${
                          isSelected
                            ? tokenSchema.color.border.accent
                            : tokenSchema.color.border.neutral
                        }`,
                        backgroundColor: isSelected
                          ? tokenSchema.color.alias.backgroundSelected
                          : tokenSchema.color.background.surface,
                        boxShadow: isSelected
                          ? `0 18px 32px ${tokenSchema.color.shadow.regular}`
                          : `0 8px 18px ${tokenSchema.color.shadow.muted}`,
                        transition: transition([
                          'border-color',
                          'box-shadow',
                          'transform',
                          'background-color',
                        ]),
                        '&:hover': {
                          transform: 'translateY(-1px)',
                          borderColor: tokenSchema.color.border.accent,
                        },
                        '&:focus-visible': {
                          outline: `${tokenSchema.size.alias.focusRing} solid ${tokenSchema.color.alias.focusRing}`,
                          outlineOffset: tokenSchema.size.alias.focusRingGap,
                        },
                      })}
                    >
                      <VStack gap="medium">
                        <Flex
                          alignItems="center"
                          justifyContent="space-between"
                          gap="regular"
                          wrap
                        >
                          <Flex alignItems="center" gap="regular" minWidth={0}>
                            <Box
                              borderRadius="medium"
                              paddingX="regular"
                              paddingY="small"
                              UNSAFE_className={css({
                                background: getBlockTone(index),
                                color: tokenSchema.color.foreground.inverse,
                              })}
                            >
                              <Text size="small" weight="semibold">
                                {typeLabel}
                              </Text>
                            </Box>
                            <VStack gap="xsmall" minWidth={0}>
                              <Text
                                weight="semibold"
                                truncate
                                UNSAFE_style={{ lineHeight: 1.4 }}
                              >
                                {blockLabel}
                              </Text>
                              <Text
                                color="neutralSecondary"
                                size="small"
                                UNSAFE_style={{ lineHeight: 1.6 }}
                              >
                                Block {index + 1}
                              </Text>
                            </VStack>
                          </Flex>
                          <Flex gap="small" alignItems="center">
                            <TooltipTrigger>
                              <ActionButton
                                prominence="low"
                                isDisabled={index === 0}
                                onPress={() => moveBlock(index, -1)}
                              >
                                <Icon
                                  src={chevronDownIcon}
                                  UNSAFE_className={css({
                                    transform: 'rotate(180deg)',
                                  })}
                                />
                              </ActionButton>
                              <Tooltip>Move up</Tooltip>
                            </TooltipTrigger>
                            <TooltipTrigger>
                              <ActionButton
                                prominence="low"
                                isDisabled={index === props.elements.length - 1}
                                onPress={() => moveBlock(index, 1)}
                              >
                                <Icon src={chevronDownIcon} />
                              </ActionButton>
                              <Tooltip>Move down</Tooltip>
                            </TooltipTrigger>
                            <TooltipTrigger>
                              <ActionButton
                                prominence="low"
                                onPress={() => duplicateBlock(index)}
                              >
                                <Icon src={copyPlusIcon} />
                              </ActionButton>
                              <Tooltip>Duplicate block</Tooltip>
                            </TooltipTrigger>
                            <TooltipTrigger>
                              <ActionButton
                                prominence="low"
                                onPress={() => removeBlock(block.key)}
                              >
                                <Icon src={trash2Icon} />
                              </ActionButton>
                              <Tooltip>Delete block</Tooltip>
                            </TooltipTrigger>
                          </Flex>
                        </Flex>

                        <Divider />

                        <Text
                          color="neutralSecondary"
                          size="small"
                          UNSAFE_style={{ lineHeight: 1.7 }}
                        >
                          {summary}
                        </Text>
                      </VStack>
                    </Box>
                  );
                })}
              </VStack>
            ) : (
              <EmptyBuilderState
                onAdd={addBlock}
                options={props.schema.element.discriminant.options}
              />
            )}
          </Box>

          <Box
            padding={{ mobile: 'large', tablet: 'xlarge' }}
            UNSAFE_className={css({
              backgroundColor: tokenSchema.color.background.canvas,
              borderTop: `${tokenSchema.size.border.regular} solid ${tokenSchema.color.border.muted}`,
              '@media (min-width: 768px)': { borderTop: 0 },
            })}
          >
            {selectedBlock ? (
              <VStack gap="xlarge">
                <VStack gap="small">
                  <Text
                    size="small"
                    weight="semibold"
                    color="accent"
                    UNSAFE_className={css({
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                    })}
                  >
                    Inspector
                  </Text>
                  <Heading elementType="h4" size="small">
                    {props.schema.itemLabel?.(selectedBlock) ||
                      getBlockTypeLabel(
                        props.schema.element.discriminant.options,
                        selectedBlock.discriminant
                      )}
                  </Heading>
                  <Text color="neutralSecondary" size="small">
                    Fine tune the selected block here. Changes update the canvas
                    immediately.
                  </Text>
                </VStack>

                <Box
                  borderRadius="large"
                  padding="large"
                  UNSAFE_className={css({
                    border: `${tokenSchema.size.border.regular} solid ${tokenSchema.color.border.neutral}`,
                    backgroundColor: tokenSchema.color.background.surface,
                    boxShadow: `0 8px 20px ${tokenSchema.color.shadow.muted}`,
                  })}
                >
                  <FormValueContentFromPreviewProps
                    autoFocus={props.autoFocus}
                    forceValidation={props.forceValidation}
                    {...selectedBlock.value}
                  />
                </Box>

                <Flex gap="regular" wrap>
                  <Button
                    prominence="low"
                    onPress={() => duplicateBlock(selectedIndex)}
                  >
                    Duplicate
                  </Button>
                  <Button
                    prominence="low"
                    onPress={() => removeBlock(selectedBlock.key)}
                  >
                    Delete
                  </Button>
                </Flex>
              </VStack>
            ) : (
              <VStack
                gap="regular"
                alignItems="center"
                justifyContent="center"
                height="100%"
                minHeight="scale.2400"
              >
                <Text color="neutralSecondary" align="center">
                  Select a block to edit its content and settings.
                </Text>
              </VStack>
            )}
          </Box>
        </Grid>
      </Box>

      {errorMessage && (
        <FieldMessage {...errorMessageProps}>{errorMessage}</FieldMessage>
      )}
      {!errorMessage && (
        <Text color="neutralSecondary" size="small">
          {stringFormatter.format('add')} blocks to shape the page flow, then
          reorder them to get the final layout.
        </Text>
      )}
    </VStack>
  );
}

function AddBlockButton(props: {
  onAdd: (discriminant: string | boolean, index?: number) => void;
  options: readonly { label: string; value: string | boolean }[];
}) {
  const sortedOptions = useMemo(
    () =>
      [...props.options].sort((a, b) =>
        a.label.localeCompare(b.label, undefined, { sensitivity: 'base' })
      ),
    [props.options]
  );

  if (sortedOptions.length > 12) {
    return (
      <DialogTrigger>
        <Button prominence="high">
          <Icon src={plusIcon} />
          <Text>Add block</Text>
        </Button>
        {close => (
          <Dialog>
            <Heading>Add block</Heading>
            <Content>
              <SearchableBlockList
                options={sortedOptions}
                onAdd={props.onAdd}
                onClose={close}
              />
            </Content>
          </Dialog>
        )}
      </DialogTrigger>
    );
  }

  return (
    <MenuTrigger>
      <Button prominence="high">
        <Icon src={plusIcon} />
        <Text>Add block</Text>
      </Button>
      <Menu
        items={sortedOptions}
        onAction={value => {
          const option = sortedOptions.find(
            item => item.value.toString() === value.toString()
          );
          if (option) {
            props.onAdd(option.value);
          }
        }}
      >
        {item => (
          <Item key={item.value.toString()} textValue={item.label}>
            <Text>{item.label}</Text>
          </Item>
        )}
      </Menu>
    </MenuTrigger>
  );
}

function SearchableBlockList(props: {
  options: readonly { label: string; value: string | boolean }[];
  onAdd: (discriminant: string | boolean, index?: number) => void;
  onClose: () => void;
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const normalizedSearchTerm = searchTerm.trim().toLowerCase();
  const filteredOptions = useMemo(
    () =>
      props.options.filter(option =>
        option.label.toLowerCase().includes(normalizedSearchTerm)
      ),
    [normalizedSearchTerm, props.options]
  );

  return (
    <VStack gap="regular">
      <SearchField
        aria-label="Search blocks"
        autoFocus
        value={searchTerm}
        onChange={setSearchTerm}
        onClear={() => setSearchTerm('')}
        placeholder="Search block type"
      />
      <Box
        borderRadius="large"
        overflow="auto"
        maxHeight="scale.4600"
        padding="small"
        UNSAFE_className={css({
          border: `${tokenSchema.size.border.regular} solid ${tokenSchema.color.border.muted}`,
        })}
      >
        {filteredOptions.length ? (
          <VStack gap="small">
            {filteredOptions.map(option => (
              <Button
                key={option.value.toString()}
                prominence="low"
                onPress={() => {
                  props.onAdd(option.value);
                  props.onClose();
                }}
              >
                {option.label}
              </Button>
            ))}
          </VStack>
        ) : (
          <Text color="neutralSecondary" size="small">
            No block types match "{searchTerm}".
          </Text>
        )}
      </Box>
    </VStack>
  );
}

function EmptyBuilderState(props: {
  onAdd: (discriminant: string | boolean, index?: number) => void;
  options: readonly { label: string; value: string | boolean }[];
}) {
  return (
    <VStack
      gap="large"
      alignItems="center"
      justifyContent="center"
      minHeight="scale.3000"
      borderRadius="large"
      padding="xlarge"
      UNSAFE_className={css({
        border: `2px dashed ${tokenSchema.color.border.muted}`,
        background: `linear-gradient(180deg, ${tokenSchema.color.background.canvas} 0%, ${tokenSchema.color.background.surface} 100%)`,
      })}
    >
      <Box
        borderRadius="full"
        padding="regular"
        UNSAFE_className={css({
          backgroundColor: tokenSchema.color.scale.indigo3,
          color: tokenSchema.color.foreground.accent,
        })}
      >
        <Icon src={plusIcon} size="large" />
      </Box>
      <VStack gap="small" alignItems="center">
        <Heading elementType="h4" size="small">
          Start with your first block
        </Heading>
        <Text color="neutralSecondary" align="center" size="small">
          This builder is singleton-friendly: you can shape one full page with
          reusable blocks and edit each section inline.
        </Text>
      </VStack>
      <AddBlockButton onAdd={props.onAdd} options={props.options} />
    </VStack>
  );
}

function getBlockTypeLabel(
  options: readonly { label: string; value: string | boolean }[],
  discriminant: string | boolean
) {
  return (
    options.find(option => option.value === discriminant)?.label ??
    discriminant.toString()
  );
}

function getBlockSummary(props: GenericPreviewProps<ComponentSchema, unknown>) {
  try {
    const value = previewPropsToValue(props);
    const summary = summarizeValue(value);
    if (summary) {
      return summary;
    }
  } catch {}

  return 'Configure this block in the inspector to add content, media, and layout details.';
}

function summarizeValue(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) {
      return '';
    }
    return trimmed.length > 140 ? `${trimmed.slice(0, 137)}...` : trimmed;
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  if (Array.isArray(value)) {
    if (!value.length) {
      return '';
    }
    return `${value.length} ${value.length === 1 ? 'item' : 'items'}`;
  }

  if (typeof value === 'object') {
    const entries = Object.values(value as Record<string, unknown>)
      .map(summarizeValue)
      .filter(Boolean)
      .slice(0, 3);
    return entries.join(' / ');
  }

  return '';
}

function getBlockTone(index: number) {
  const tones = [
    `linear-gradient(135deg, ${tokenSchema.color.scale.indigo7}, ${tokenSchema.color.scale.green7})`,
    `linear-gradient(135deg, ${tokenSchema.color.scale.green7}, ${tokenSchema.color.scale.slate7})`,
    `linear-gradient(135deg, ${tokenSchema.color.scale.amber7}, ${tokenSchema.color.scale.red7})`,
    `linear-gradient(135deg, ${tokenSchema.color.scale.slate7}, ${tokenSchema.color.scale.indigo7})`,
  ];

  return tones[index % tones.length];
}
