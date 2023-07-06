import { ActionButton, Button, ButtonGroup } from '@keystar/ui/button';
import { Dialog, DialogContainer } from '@keystar/ui/dialog';
import { ItemDropTarget, useDragAndDrop } from '@keystar/ui/drag-and-drop';
import { FieldLabel, FieldMessage } from '@keystar/ui/field';
import { Icon } from '@keystar/ui/icon';
import { trash2Icon } from '@keystar/ui/icon/icons/trash2Icon';
import { Flex } from '@keystar/ui/layout';
import { Item, ListView } from '@keystar/ui/list-view';
import { Content } from '@keystar/ui/slots';
import { Tooltip, TooltipTrigger } from '@keystar/ui/tooltip';
import { Heading, Text } from '@keystar/ui/typography';
import { useLocalizedStringFormatter } from '@react-aria/i18n';

import {
  previewPropsToValue,
  valueToUpdater,
  setValueToPreviewProps,
} from '../../get-value';
import { createGetPreviewProps } from '../../preview-props';

import l10nMessages from '../../../app/l10n/index.json';
import { useId, Key, useMemo, useState, useCallback } from 'react';
import { getSlugFromState } from '../../../app/utils';
import { clientSideValidateProp } from '../../errors';
import {
  NonChildFieldComponentSchema,
  FormValueContentFromPreviewProps,
  ExtraFieldInputProps,
} from '../../form-from-preview';
import { getInitialPropsValue } from '../../initial-values';
import { useEventCallback } from '../document/DocumentEditor/ui-utils';
import { SlugFieldInfo } from '../text/ui';
import { ArrayField, ComponentSchema, GenericPreviewProps } from '../../api';

export function ArrayFieldInput<Element extends ComponentSchema>(
  props: GenericPreviewProps<ArrayField<Element>, unknown> &
    ExtraFieldInputProps
) {
  const labelId = useId();
  const descriptionId = useId();
  const stringFormatter = useLocalizedStringFormatter(l10nMessages);

  const [modalState, setModalState] = useState<
    | {
        state: 'open';
        value: unknown;
        forceValidation: boolean;
        index: number | undefined;
      }
    | { state: 'closed' }
  >({ state: 'closed' });
  const onModalChange = useCallback(
    (cb: (value: unknown) => unknown) => {
      setModalState(state => {
        if (state.state === 'open') {
          return {
            state: 'open',
            forceValidation: state.forceValidation,
            value: cb(state.value),
            index: state.index,
          };
        }
        return state;
      });
    },
    [setModalState]
  );
  const formId = useId();

  const modalStateIndex =
    modalState.state === 'open' ? modalState.index : undefined;
  const slugInfo = useMemo(() => {
    if (
      props.schema.slugField === undefined ||
      modalState.state !== 'open' ||
      props.schema.element.kind !== 'object'
    ) {
      return;
    }
    const val: unknown[] = previewPropsToValue(props as any);
    const schema = props.schema.element.fields;
    const slugField = props.schema.slugField;
    const slugs = new Set(
      val
        .filter((x, i) => i !== modalStateIndex)
        .map(x =>
          getSlugFromState({ schema, slugField }, x as Record<string, unknown>)
        )
    );
    return { slugs, field: slugField, glob: '*' as const };
  }, [modalStateIndex, props, modalState.state]);

  return (
    <Flex
      elementType="section"
      gap="medium"
      role="group"
      aria-labelledby={labelId}
      aria-describedby={props.schema.description ? descriptionId : undefined}
      direction="column"
    >
      <FieldLabel elementType="h3" id={labelId}>
        {props.schema.label}
      </FieldLabel>
      {props.schema.description && (
        <Text id={descriptionId} size="small" color="neutralSecondary">
          {props.schema.description}
        </Text>
      )}
      <ActionButton
        autoFocus={props.autoFocus}
        onPress={() => {
          setModalState({
            state: 'open',
            value: getInitialPropsValue(props.schema.element),
            forceValidation: false,
            index: undefined,
          });
        }}
        alignSelf="start"
      >
        {stringFormatter.format('add')}
      </ActionButton>
      <ArrayFieldListView
        {...props}
        labelId={labelId}
        onOpenItem={idx => {
          setModalState({
            state: 'open',
            value: previewPropsToValue(props.elements[idx]),
            forceValidation: false,
            index: idx,
          });
        }}
      />
      <ArrayFieldValidationMessages {...props} />

      <DialogContainer
        onDismiss={() => {
          setModalState({ state: 'closed' });
        }}
      >
        {(() => {
          if (
            modalState.state !== 'open' ||
            props.schema.element.kind === 'child'
          ) {
            return;
          }
          return (
            <Dialog>
              <Heading>Edit item</Heading>
              <Content>
                <Flex
                  id={formId}
                  elementType="form"
                  onSubmit={event => {
                    if (event.target !== event.currentTarget) return;
                    event.preventDefault();
                    if (modalState.state !== 'open') return;
                    if (
                      !clientSideValidateProp(
                        props.schema.element,
                        modalState.value,
                        undefined
                      )
                    ) {
                      setModalState(state => ({
                        ...state,
                        forceValidation: true,
                      }));
                      return;
                    }
                    if (modalState.index === undefined) {
                      props.onChange([
                        ...props.elements.map(x => ({
                          key: x.key,
                        })),
                        {
                          key: undefined,
                          value: valueToUpdater(
                            modalState.value,
                            props.schema.element
                          ),
                        },
                      ]);
                    } else {
                      setValueToPreviewProps(
                        modalState.value,
                        props.elements[modalState.index]
                      );
                    }
                    setModalState({ state: 'closed' });
                  }}
                  direction="column"
                  gap="xxlarge"
                >
                  <ArrayFieldItemModalContent
                    onChange={onModalChange}
                    schema={props.schema.element as any}
                    value={modalState.value}
                    slugField={slugInfo}
                  />
                </Flex>
              </Content>
              <ButtonGroup>
                <Button
                  onPress={() => {
                    setModalState({ state: 'closed' });
                  }}
                >
                  {stringFormatter.format('cancel')}
                </Button>
                <Button form={formId} prominence="high" type="submit">
                  {modalState.index === undefined
                    ? stringFormatter.format('add')
                    : 'Done'}
                </Button>
              </ButtonGroup>
            </Dialog>
          );
        })()}
      </DialogContainer>
    </Flex>
  );
}

export function ArrayFieldValidationMessages<Element extends ComponentSchema>(
  props: GenericPreviewProps<ArrayField<Element>, unknown> &
    ExtraFieldInputProps
) {
  return (
    <>
      {props.forceValidation &&
        (props.schema.validation?.length?.min !== undefined &&
        props.elements.length < props.schema.validation.length.min ? (
          <FieldMessage>
            Must have at least {props.schema.validation.length.min} item
            {props.schema.validation.length.min === 1 ? '' : 's'}
          </FieldMessage>
        ) : props.schema.validation?.length?.max !== undefined &&
          props.elements.length > props.schema.validation.length.max ? (
          <FieldMessage>
            Must have at most {props.schema.validation.length.max} item
            {props.schema.validation.length.max === 1 ? '' : 's'}
          </FieldMessage>
        ) : undefined)}
    </>
  );
}

export function ArrayFieldListView<Element extends ComponentSchema>(
  props: GenericPreviewProps<ArrayField<Element>, unknown> &
    ExtraFieldInputProps & {
      labelId: string;
      onOpenItem: (index: number) => void;
    }
) {
  let onMove = (keys: Key[], target: ItemDropTarget) => {
    const targetIndex = props.elements.findIndex(x => x.key === target.key);
    if (targetIndex === -1) return;
    const allKeys = props.elements.map(x => ({ key: x.key }));
    const indexToMoveTo =
      target.dropPosition === 'before' ? targetIndex : targetIndex + 1;
    const indices = keys.map(key => allKeys.findIndex(x => x.key === key));
    props.onChange(move(allKeys, indices, indexToMoveTo));
  };

  const dragType = useMemo(() => Math.random().toString(36), []);

  let { dragAndDropHooks } = useDragAndDrop({
    getItems(keys) {
      // Use a drag type so the items can only be reordered within this list
      // and not dragged elsewhere.
      return [...keys].map(key => {
        key = JSON.stringify(key);
        return {
          [dragType]: key,
          'text/plain': key,
        };
      });
    },
    getAllowedDropOperations() {
      return ['move', 'cancel'];
    },
    async onDrop(e) {
      if (e.target.type !== 'root' && e.target.dropPosition !== 'on') {
        let keys = [];
        for (let item of e.items) {
          if (item.kind === 'text') {
            let key;
            if (item.types.has(dragType)) {
              key = JSON.parse(await item.getText(dragType));
              keys.push(key);
            } else if (item.types.has('text/plain')) {
              // Fallback for Chrome Android case: https://bugs.chromium.org/p/chromium/issues/detail?id=1293803
              // Multiple drag items are contained in a single string so we need to split them out
              key = await item.getText('text/plain');
              keys = key.split('\n').map(val => val.replaceAll('"', ''));
            }
          }
        }
        onMove(keys, e.target);
      }
    },
    getDropOperation(target) {
      if (target.type === 'root' || target.dropPosition === 'on') {
        return 'cancel';
      }

      return 'move';
    },
  });
  const onRemoveKey = useEventCallback((key: string) => {
    props.onChange(
      props.elements.map(x => ({ key: x.key })).filter(val => val.key !== key)
    );
  });

  const stringFormatter = useLocalizedStringFormatter(l10nMessages);

  return (
    <ListView
      aria-labelledby={props.labelId}
      items={props.elements}
      dragAndDropHooks={dragAndDropHooks}
      height={props.elements.length ? undefined : 'scale.2000'}
      renderEmptyState={() => (
        <Flex
          direction="column"
          gap="large"
          alignItems="center"
          justifyContent="center"
          height="100%"
          padding="regular"
        >
          <Text
            elementType="h3"
            align="center"
            color="neutralSecondary"
            size="large"
            weight="medium"
          >
            Empty list
          </Text>
          <Text align="center" color="neutralTertiary">
            Add the first item to see it here.
          </Text>
        </Flex>
      )}
      onAction={key => {
        const idx = props.elements.findIndex(x => x.key === key);
        if (idx === -1) return;
        props.onOpenItem(idx);
      }}
    >
      {item => {
        const label =
          props.schema.itemLabel?.(item) ||
          `Item ${props.elements.indexOf(item) + 1}`;
        return (
          <Item key={item.key} textValue={label}>
            <Text>{label}</Text>
            <TooltipTrigger placement="start">
              <ActionButton
                onPress={() => {
                  onRemoveKey(item.key);
                }}
              >
                <Icon src={trash2Icon} />
              </ActionButton>
              <Tooltip tone="critical">
                {stringFormatter.format('delete')}
              </Tooltip>
            </TooltipTrigger>
          </Item>
        );
      }}
    </ListView>
  );
}

// https://github.com/adobe/react-spectrum/blob/97ff9f95d91befaf87251e52ea484f81daae8f3a/packages/%40react-stately/data/src/useListData.ts#L263
function move<T>(
  items: ReadonlyArray<T>,
  indices: number[],
  toIndex: number
): Array<T> {
  // Shift the target down by the number of items being moved from before the target
  toIndex -= indices.filter(index => index < toIndex).length;

  let moves = indices.map(from => ({
    from,
    to: toIndex++,
  }));

  // Shift later from indices down if they have a larger index
  for (let i = 0; i < moves.length; i++) {
    let a = moves[i].from;
    for (let j = i; j < moves.length; j++) {
      let b = moves[j].from;

      if (b > a) {
        moves[j].from--;
      }
    }
  }

  // Interleave the moves so they can be applied one by one rather than all at once
  for (let i = 0; i < moves.length; i++) {
    let a = moves[i];
    for (let j = moves.length - 1; j > i; j--) {
      let b = moves[j];

      if (b.from < a.to) {
        a.to++;
      } else {
        b.from++;
      }
    }
  }

  let copy = items.slice();
  for (let move of moves) {
    let [item] = copy.splice(move.from, 1);
    copy.splice(move.to, 0, item);
  }

  return copy;
}

function ArrayFieldItemModalContent(props: {
  schema: NonChildFieldComponentSchema;
  value: unknown;
  onChange: (cb: (value: unknown) => unknown) => void;
  slugField: SlugFieldInfo | undefined;
}) {
  const previewProps = useMemo(
    () => createGetPreviewProps(props.schema, props.onChange, () => undefined),
    [props.schema, props.onChange]
  )(props.value);
  return (
    <FormValueContentFromPreviewProps
      slugField={props.slugField}
      autoFocus
      {...previewProps}
    />
  );
}
