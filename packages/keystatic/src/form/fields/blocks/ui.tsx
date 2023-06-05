'use client';
import { useLocalizedStringFormatter } from '@react-aria/i18n';
import { ActionButton, ButtonGroup, Button } from '@voussoir/button';
import { DialogContainer, Dialog, useDialogContainer } from '@voussoir/dialog';
import { FieldLabel } from '@voussoir/field';
import { Flex } from '@voussoir/layout';
import { Content } from '@voussoir/slots';
import { Heading, Text } from '@voussoir/typography';
import { useId, useState, useMemo } from 'react';
import {
  ArrayField,
  BasicFormField,
  ComponentSchema,
  ConditionalField,
  GenericPreviewProps,
  ParsedValueForComponentSchema,
} from '../../api';
import { clientSideValidateProp } from '../../errors';
import {
  ExtraFieldInputProps,
  FormValueContentFromPreviewProps,
} from '../../form-from-preview';
import {
  previewPropsToValue,
  valueToUpdater,
  setValueToPreviewProps,
} from '../../get-value';
import { getInitialPropsValue } from '../../initial-values';
import { ArrayFieldListView, ArrayFieldValidationMessages } from '../array/ui';
import l10nMessages from '../../../app/l10n/index.json';
import { createGetPreviewProps } from '../../preview-props';
import { Item } from '@react-stately/collections';
import { MenuTrigger, Menu } from '@voussoir/menu';

export function BlocksFieldInput<Key extends string>(
  props: GenericPreviewProps<
    ArrayField<
      ConditionalField<
        BasicFormField<Key> & {
          options: readonly { label: string; value: Key }[];
        },
        {
          [_ in `${Key}`]: ComponentSchema;
        }
      >
    >,
    unknown
  > &
    ExtraFieldInputProps
) {
  const labelId = useId();
  const descriptionId = useId();
  const stringFormatter = useLocalizedStringFormatter(l10nMessages);

  const [modalState, setModalState] = useState<
    | { kind: 'closed' }
    | { kind: 'new'; initial: { discriminant: Key; value: unknown } }
    | {
        kind: 'edit';
        idx: number;
        initial: { discriminant: Key; value: unknown };
      }
  >({ kind: 'closed' });

  const dismiss = () => {
    setModalState({ kind: 'closed' });
  };

  const formId = useId();

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
      <MenuTrigger>
        <ActionButton alignSelf="start">Add</ActionButton>
        <Menu
          items={props.schema.element.discriminant.options}
          onAction={key => {
            if (typeof key !== 'string') return;
            const discriminant = key as Key;
            setModalState({
              kind: 'new',
              initial: {
                discriminant,
                value: getInitialPropsValue(
                  props.schema.element.values[`${discriminant as Key}`]
                ),
              },
            });
          }}
        >
          {item => <Item key={item.value}>{item.label}</Item>}
        </Menu>
      </MenuTrigger>
      <ArrayFieldListView
        {...(props as any)}
        labelId={labelId}
        onOpenItem={idx => {
          setModalState({
            kind: 'edit',
            idx,
            initial: previewPropsToValue(props.elements[idx] as any),
          });
        }}
      />
      <ArrayFieldValidationMessages {...(props as any)} />

      <DialogContainer onDismiss={dismiss}>
        {(() => {
          if (modalState.kind === 'closed') {
            return null;
          }
          const discriminant = modalState.initial.discriminant as `${Key}`;
          return (
            <Dialog>
              <Heading>
                {modalState.kind === 'edit' ? 'Edit' : 'Add'}{' '}
                {
                  props.schema.element.discriminant.options.find(
                    x => x.value === discriminant
                  )?.label
                }
              </Heading>
              <Content>
                <ItemForm
                  id={formId}
                  schema={props.schema.element.values[discriminant]}
                  initialValue={modalState.initial.value}
                  onSubmit={val => {
                    dismiss();
                    if (modalState.kind === 'new') {
                      props.onChange([
                        ...props.elements.map(x => ({ key: x.key })),
                        {
                          key: undefined,
                          value: valueToUpdater(
                            { value: val, discriminant },
                            props.schema.element
                          ),
                        },
                      ]);
                      return;
                    }
                    setValueToPreviewProps(
                      val,
                      props.elements[modalState.idx].value
                    );
                  }}
                />
              </Content>
              <ButtonGroup>
                <Button onPress={dismiss}>
                  {stringFormatter.format('cancel')}
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

function ItemForm<Schema extends ComponentSchema>(props: {
  schema: ComponentSchema;
  initialValue: ParsedValueForComponentSchema<Schema>;
  onSubmit: (value: unknown) => void;
  id: string;
}) {
  const [value, setValue] = useState(props.initialValue);
  const [forceValidation, setForceValidation] = useState(false);
  const previewProps = useMemo(
    () => createGetPreviewProps(props.schema, setValue as any, () => undefined),
    [props.schema, setValue]
  )(value);
  const { dismiss } = useDialogContainer();

  return (
    <Flex
      id={props.id}
      elementType="form"
      onSubmit={event => {
        if (event.target !== event.currentTarget) return;
        event.preventDefault();
        if (!clientSideValidateProp(props.schema, value, undefined)) {
          setForceValidation(true);
          return;
        }
        props.onSubmit(value);
        dismiss();
      }}
      direction="column"
      gap="xxlarge"
    >
      <FormValueContentFromPreviewProps
        forceValidation={forceValidation}
        autoFocus
        {...(previewProps as any)}
      />
    </Flex>
  );
}
