import { useLocalizedStringFormatter } from '@react-aria/i18n';
import { assertNever } from 'emery';
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

import l10nMessages from '../app/l10n/index.json';

import {
  ArrayField,
  BasicFormField,
  ComponentSchema,
  ConditionalField,
  FormField,
  GenericPreviewProps,
  ObjectField,
} from './api';
import {
  previewPropsToValue,
  valueToUpdater,
  setValueToPreviewProps,
} from './get-value';
import { createGetPreviewProps } from './preview-props';
import { ReadonlyPropPath } from './fields/document/DocumentEditor/component-blocks/utils';
import { clientSideValidateProp } from './errors';
import {
  AddToPathProvider,
  PathContextProvider,
  SlugFieldInfo,
  SlugFieldProvider,
} from './fields/text/ui';
import { getSlugFromState } from '../app/utils';
import { getInitialPropsValue } from './initial-values';
import { useEventCallback } from './fields/document/DocumentEditor/ui-utils';

type DefaultFieldProps<Key> = GenericPreviewProps<
  Extract<ComponentSchema, { kind: Key }>,
  unknown
> & {
  autoFocus?: boolean;
  forceValidation?: boolean;
};

function ArrayFieldPreview(props: DefaultFieldProps<'array'>) {
  const labelId = useId();
  const descriptionId = useId();
  const stringFormatter = useLocalizedStringFormatter(l10nMessages);

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

  const onRemoveKey = useEventCallback((key: string) => {
    props.onChange(
      props.elements.map(x => ({ key: x.key })).filter(val => val.key !== key)
    );
  });
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
    const val: unknown[] = previewPropsToValue(props);
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
      <ListView
        aria-labelledby={labelId}
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
                <Tooltip tone="critical">
                  {stringFormatter.format('delete')}
                </Tooltip>
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
                    schema={props.schema.element}
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
    <Flex gap="large" direction="column">
      {Object.entries(fields).map(
        ([key, propVal]) =>
          isNonChildFieldPreviewProps(propVal) && (
            <AddToPathProvider key={key} part={key}>
              <InnerFormValueContentFromPreviewProps
                forceValidation={forceValidation}
                autoFocus={key === firstFocusable}
                {...propVal}
              />
            </AddToPathProvider>
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
    string | boolean,
    string | boolean
  >;
  return (
    <Flex gap="large" direction="column">
      {useMemo(
        () => (
          <AddToPathProvider part="discriminant">
            <schemaDiscriminant.Input
              autoFocus={!!autoFocus}
              value={discriminant}
              onChange={onChange}
              forceValidation={!!forceValidation}
            />
          </AddToPathProvider>
        ),
        [autoFocus, schemaDiscriminant, discriminant, onChange, forceValidation]
      )}
      {isNonChildFieldPreviewProps(value) && (
        <AddToPathProvider part="value">
          <InnerFormValueContentFromPreviewProps
            forceValidation={forceValidation}
            {...value}
          />
        </AddToPathProvider>
      )}
    </Flex>
  );
}

export type NonChildFieldComponentSchema =
  | FormField<any, any, any>
  | ObjectField
  | ConditionalField<BasicFormField<any>, { [key: string]: ComponentSchema }>
  | ArrayField<ComponentSchema>;

function isNonChildFieldPreviewProps(
  props: GenericPreviewProps<ComponentSchema, unknown>
): props is GenericPreviewProps<NonChildFieldComponentSchema, unknown> {
  return props.schema.kind !== 'child';
}

const fieldRenderers = {
  array: ArrayFieldPreview,
  child: () => null,
  form: FormFieldPreview,
  object: ObjectFieldPreview,
  conditional: ConditionalFieldPreview,
};

const InnerFormValueContentFromPreviewProps: MemoExoticComponent<
  (
    props: GenericPreviewProps<NonChildFieldComponentSchema, unknown> & {
      autoFocus?: boolean;
      forceValidation?: boolean;
    }
  ) => ReactElement
> = memo(function InnerFormValueContentFromPreview(props) {
  const Comp = fieldRenderers[props.schema.kind];
  return <Comp {...(props as any)} />;
});

const emptyArray: ReadonlyPropPath = [];
export const FormValueContentFromPreviewProps: MemoExoticComponent<
  (
    props: GenericPreviewProps<NonChildFieldComponentSchema, unknown> & {
      autoFocus?: boolean;
      forceValidation?: boolean;
      slugField?: SlugFieldInfo;
    }
  ) => ReactElement
> = memo(function FormValueContentFromPreview({ slugField, ...props }) {
  const Comp = fieldRenderers[props.schema.kind];
  return (
    <PathContextProvider value={emptyArray}>
      <SlugFieldProvider value={slugField}>
        <Comp {...(props as any)} />
      </SlugFieldProvider>
    </PathContextProvider>
  );
});
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
    schema.kind === 'form'
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
