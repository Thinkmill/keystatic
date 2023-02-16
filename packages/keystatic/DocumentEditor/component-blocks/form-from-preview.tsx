import { ActionButton, Button, ButtonGroup } from '@voussoir/button';
import { Dialog, DialogContainer } from '@voussoir/dialog';
import { ItemDropTarget, useDragAndDrop } from '@voussoir/drag-and-drop';
import { FieldLabel } from '@voussoir/field';
import { Icon } from '@voussoir/icon';
import { trash2Icon } from '@voussoir/icon/icons/trash2Icon';
import { Flex } from '@voussoir/layout';
import { Item, ListView } from '@voussoir/list-view';
import { Content } from '@voussoir/slots';
import { Tooltip, TooltipTrigger } from '@voussoir/tooltip';
import { Heading, Text } from '@voussoir/typography';
import {
  Key,
  MemoExoticComponent,
  ReactElement,
  memo,
  useCallback,
  useId,
  useMemo,
  useState,
} from 'react';
import { useEventCallback } from '../utils';

import {
  ArrayField,
  ComponentSchema,
  ConditionalField,
  FormField,
  GenericPreviewProps,
  ObjectField,
  RelationshipField,
} from './api';
import { previewPropsToValue, setValueToPreviewProps } from './get-value';
import { createGetPreviewProps } from './preview-props';
import { assertNever, clientSideValidateProp } from './utils';

type DefaultFieldProps<Key> = GenericPreviewProps<
  Extract<ComponentSchema, { kind: Key }>,
  unknown
> & {
  autoFocus?: boolean;
  forceValidation?: boolean;
};

function ArrayFieldPreview(props: DefaultFieldProps<'array'>) {
  const labelId = useId();

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
  const [modalState, setModalState] = useState<
    | { state: 'open'; value: unknown; forceValidation: boolean; index: number }
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

  const onRemoveKey = useEventCallback((key: string) => {
    props.onChange(
      props.elements.map(x => ({ key: x.key })).filter(val => val.key !== key)
    );
  });
  const addItem = () => {
    props.onChange([
      ...props.elements.map(x => ({ key: x.key })),
      { key: undefined },
    ]);
  };

  return (
    <Flex
      elementType="section"
      gap="medium"
      role="group"
      aria-labelledby={labelId}
      direction="column"
    >
      <FieldLabel elementType="h3" id={labelId}>
        {props.schema.label}
      </FieldLabel>
      <ActionButton
        autoFocus={props.autoFocus}
        onPress={addItem}
        alignSelf="start"
      >
        Add
      </ActionButton>
      <ListView
        aria-labelledby={labelId}
        items={props.elements}
        dragAndDropHooks={dragAndDropHooks}
        height={props.elements.length ? undefined : 'size.scale.2000'}
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
          setModalState({
            state: 'open',
            value: previewPropsToValue(props.elements[idx]),
            forceValidation: false,
            index: idx,
          });
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
                <Tooltip tone="critical">Delete</Tooltip>
              </TooltipTrigger>
            </Item>
          );
        }}
      </ListView>

      <DialogContainer
        onDismiss={() => {
          setModalState({ state: 'closed' });
        }}
      >
        {(() => {
          if (modalState.state !== 'open') return;
          const elementProps = props.elements[modalState.index];
          if (!isNonChildFieldPreviewProps(elementProps)) return;
          return (
            <Dialog>
              <Heading>Edit item</Heading>
              <Content>
                <Flex
                  id={formId}
                  elementType="form"
                  onSubmit={event => {
                    event.preventDefault();
                    if (modalState.state !== 'open') return;
                    if (
                      !clientSideValidateProp(
                        elementProps.schema,
                        modalState.value
                      )
                    ) {
                      setModalState(state => ({
                        ...state,
                        forceValidation: true,
                      }));
                      return;
                    }
                    setValueToPreviewProps(modalState.value, elementProps);
                    setModalState({ state: 'closed' });
                  }}
                  direction="column"
                  gap="xxlarge"
                >
                  <ArrayFieldItemModalContent
                    onChange={onModalChange}
                    schema={elementProps.schema}
                    value={modalState.value}
                  />
                </Flex>
              </Content>
              <ButtonGroup>
                <Button
                  onPress={() => {
                    setModalState({ state: 'closed' });
                  }}
                >
                  Cancel
                </Button>
                <Button form={formId} prominence="high" type="submit">
                  Done
                </Button>
              </ButtonGroup>
            </Dialog>
          );
        })()}
      </DialogContainer>
    </Flex>
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

function RelationshipFieldPreview({}: DefaultFieldProps<'relationship'>) {
  return null;
}

function FormFieldPreview({
  schema,
  autoFocus,
  forceValidation,
  onChange,
  value,
}: DefaultFieldProps<'form'>) {
  return (
    <schema.Input
      autoFocus={!!autoFocus}
      value={value}
      onChange={onChange}
      forceValidation={!!forceValidation}
    />
  );
}

function ObjectFieldPreview({
  schema,
  autoFocus,
  fields,
  forceValidation,
}: DefaultFieldProps<'object'>) {
  const firstFocusable = autoFocus
    ? findFocusableObjectFieldKey(schema)
    : undefined;
  return (
    <Flex gap="xlarge" direction="column">
      {Object.entries(fields).map(
        ([key, propVal]) =>
          isNonChildFieldPreviewProps(propVal) && (
            <FormValueContentFromPreviewProps
              forceValidation={forceValidation}
              autoFocus={key === firstFocusable}
              key={key}
              {...propVal}
            />
          )
      )}
    </Flex>
  );
}

function ConditionalFieldPreview({
  schema,
  autoFocus,
  discriminant,
  onChange,
  value,
  forceValidation,
}: DefaultFieldProps<'conditional'>) {
  const schemaDiscriminant = schema.discriminant as FormField<
    string | boolean,
    unknown
  >;
  return (
    <Flex gap="xlarge">
      {useMemo(
        () => (
          <schemaDiscriminant.Input
            autoFocus={!!autoFocus}
            value={discriminant}
            onChange={onChange}
            forceValidation={!!forceValidation}
          />
        ),
        [autoFocus, schemaDiscriminant, discriminant, onChange, forceValidation]
      )}
      {isNonChildFieldPreviewProps(value) && (
        <FormValueContentFromPreviewProps
          forceValidation={forceValidation}
          {...value}
        />
      )}
    </Flex>
  );
}

export type NonChildFieldComponentSchema =
  | FormField<any, any>
  | ObjectField
  | ConditionalField<FormField<any, any>, { [key: string]: ComponentSchema }>
  | RelationshipField<boolean>
  | ArrayField<ComponentSchema>;

function isNonChildFieldPreviewProps(
  props: GenericPreviewProps<ComponentSchema, unknown>
): props is GenericPreviewProps<NonChildFieldComponentSchema, unknown> {
  return props.schema.kind !== 'child';
}

const fieldRenderers = {
  array: ArrayFieldPreview,
  relationship: RelationshipFieldPreview,
  child: () => null,
  form: FormFieldPreview,
  object: ObjectFieldPreview,
  conditional: ConditionalFieldPreview,
};

export const FormValueContentFromPreviewProps: MemoExoticComponent<
  (
    props: GenericPreviewProps<NonChildFieldComponentSchema, unknown> & {
      autoFocus?: boolean;
      forceValidation?: boolean;
    }
  ) => ReactElement
> = memo(function FormValueContentFromPreview(props) {
  const Comp = fieldRenderers[props.schema.kind];
  return <Comp {...(props as any)} />;
});

function ArrayFieldItemModalContent(props: {
  schema: NonChildFieldComponentSchema;
  value: unknown;
  onChange: (cb: (value: unknown) => unknown) => void;
}) {
  const previewProps = useMemo(
    () => createGetPreviewProps(props.schema, props.onChange, () => undefined),
    [props.schema, props.onChange]
  )(props.value);
  return <FormValueContentFromPreviewProps autoFocus {...previewProps} />;
}

function findFocusableObjectFieldKey(schema: ObjectField): string | undefined {
  for (const [key, innerProp] of Object.entries(schema.fields)) {
    const childFocusable = canFieldBeFocused(innerProp);
    if (childFocusable) {
      return key;
    }
  }
  return undefined;
}

export function canFieldBeFocused(schema: ComponentSchema): boolean {
  if (
    schema.kind === 'array' ||
    schema.kind === 'conditional' ||
    schema.kind === 'form' ||
    schema.kind === 'relationship'
  ) {
    return true;
  }
  if (schema.kind === 'child') {
    return false;
  }
  if (schema.kind === 'object') {
    for (const innerProp of Object.values(schema.fields)) {
      if (canFieldBeFocused(innerProp)) {
        return true;
      }
    }
    return false;
  }
  assertNever(schema);
}
