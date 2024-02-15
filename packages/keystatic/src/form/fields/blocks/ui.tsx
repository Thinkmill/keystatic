import { useLocalizedStringFormatter } from '@react-aria/i18n';
import { ActionButton, ButtonGroup, Button } from '@keystar/ui/button';
import {
  DialogContainer,
  Dialog,
  useDialogContainer,
} from '@keystar/ui/dialog';
import { FieldLabel } from '@keystar/ui/field';
import { Flex } from '@keystar/ui/layout';
import { Content } from '@keystar/ui/slots';
import { Heading, Text } from '@keystar/ui/typography';
import { useId, useState, useMemo } from 'react';
import {
  ArrayField,
  BasicFormField,
  ComponentSchema,
  ConditionalField,
  GenericPreviewProps,
} from '../../api';
import { clientSideValidateProp } from '../../errors';
import {
  ExtraFieldInputProps,
  FormValueContentFromPreviewProps,
} from '../../form-from-preview';
import { valueToUpdater } from '../../get-value';
import { ArrayFieldListView, ArrayFieldValidationMessages } from '../array/ui';
import l10nMessages from '../../../app/l10n/index.json';
import { createGetPreviewProps } from '../../preview-props';
import { Item } from '@react-stately/collections';
import { MenuTrigger, Menu } from '@keystar/ui/menu';
import { getInitialPropsValue } from '../../initial-values';

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
export function BlocksFieldInput(
  props: BlocksPreviewProps & ExtraFieldInputProps
) {
  const labelId = useId();
  const descriptionId = useId();
  const stringFormatter = useLocalizedStringFormatter(l10nMessages);

  const [modalState, setModalState] = useState<
    | { kind: 'closed' }
    | { kind: 'new'; discriminant: string | boolean }
    | { kind: 'edit'; idx: number }
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
          onAction={discriminant => {
            const val = props.schema.element.discriminant.options.find(
              x => x.value.toString() === discriminant.toString()
            )?.value;
            if (val === undefined) return;
            setModalState({
              kind: 'new',
              discriminant: val,
            });
          }}
        >
          {item => <Item key={item.value.toString()}>{item.label}</Item>}
        </Menu>
      </MenuTrigger>
      <ArrayFieldListView
        {...(props as any)}
        labelId={labelId}
        onOpenItem={idx => {
          setModalState({
            kind: 'edit',
            idx,
          });
        }}
      />
      <ArrayFieldValidationMessages {...(props as any)} />

      <DialogContainer onDismiss={dismiss}>
        {(() => {
          if (modalState.kind === 'closed') {
            return null;
          }
          if (modalState.kind === 'edit') {
            const idx = modalState.idx;
            const previewProps = props.elements[idx].value;
            const { discriminant } = props.elements[idx];
            return (
              <Dialog>
                <Heading>
                  Edit{' '}
                  {
                    props.schema.element.discriminant.options.find(
                      x => x.value === discriminant
                    )?.label
                  }
                </Heading>
                <BlocksEditItemModalContent
                  formId={formId}
                  onClose={dismiss}
                  previewProps={previewProps}
                  modalStateIndex={idx}
                />
                <ButtonGroup>
                  <Button form={formId} prominence="high" type="submit">
                    Done
                  </Button>
                </ButtonGroup>
              </Dialog>
            );
          }
          const discriminant = modalState.discriminant;
          return (
            <Dialog>
              <Heading>
                Add
                {
                  props.schema.element.discriminant.options.find(
                    x => x.value === discriminant
                  )?.label
                }
              </Heading>
              <Content>
                <BlocksAddItemModalContent
                  discriminant={discriminant}
                  formId={formId}
                  previewProps={props}
                />
              </Content>
              <ButtonGroup>
                <Button onPress={dismiss}>
                  {stringFormatter.format('cancel')}
                </Button>
                <Button form={formId} prominence="high" type="submit">
                  {stringFormatter.format('add')}
                </Button>
              </ButtonGroup>
            </Dialog>
          );
        })()}
      </DialogContainer>
    </Flex>
  );
}

function BlocksEditItemModalContent(props: {
  formId: string;
  onClose: () => void;
  previewProps: GenericPreviewProps<ComponentSchema, unknown>;
  modalStateIndex: number;
}) {
  return (
    <Content>
      <Flex
        id={props.formId}
        elementType="form"
        onSubmit={event => {
          if (event.target !== event.currentTarget) return;
          event.preventDefault();
          props.onClose();
        }}
        direction="column"
        gap="xxlarge"
      >
        <FormValueContentFromPreviewProps autoFocus {...props.previewProps} />
      </Flex>
    </Content>
  );
}

function BlocksAddItemModalContent(props: {
  previewProps: BlocksPreviewProps;
  discriminant: string | boolean;
  formId: string;
}) {
  const schema =
    props.previewProps.schema.element.values[props.discriminant.toString()];
  console.log(schema);
  const [value, setValue] = useState(() => getInitialPropsValue(schema));
  const [forceValidation, setForceValidation] = useState(false);
  const previewProps = useMemo(
    () => createGetPreviewProps(schema, setValue as any, () => undefined),
    [schema, setValue]
  )(value);
  const { dismiss } = useDialogContainer();

  return (
    <Flex
      id={props.formId}
      elementType="form"
      onSubmit={event => {
        if (event.target !== event.currentTarget) return;
        event.preventDefault();
        if (!clientSideValidateProp(schema, value, undefined)) {
          setForceValidation(true);
          return;
        }
        props.previewProps.onChange([
          ...props.previewProps.elements.map(x => ({ key: x.key })),
          {
            key: undefined,
            value: valueToUpdater(
              { value, discriminant: props.discriminant },
              props.previewProps.schema.element
            ),
          },
        ]);
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
