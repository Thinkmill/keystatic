import { useLocalizedStringFormatter } from '@react-aria/i18n';
import { ReactNode, useMemo, useState, useCallback, Fragment } from 'react';
import { RenderElementProps, useSelected } from 'slate-react';

import { ActionButton, Button } from '@voussoir/button';
import { FieldMessage } from '@voussoir/field';
import { trash2Icon } from '@voussoir/icon/icons/trash2Icon';
import { Icon } from '@voussoir/icon';
import { Flex } from '@voussoir/layout';
import { css, tokenSchema } from '@voussoir/style';
import { Tooltip, TooltipTrigger } from '@voussoir/tooltip';
import { Text } from '@voussoir/typography';

import l10nMessages from '../../app/l10n/index.json';
import {
  PreviewPropsForToolbar,
  ObjectField,
  ComponentSchema,
  ComponentBlock,
  NotEditable,
  GenericPreviewProps,
} from './api';
import { clientSideValidateProp } from './utils';
import {
  FormValueContentFromPreviewProps,
  NonChildFieldComponentSchema,
} from './form-from-preview';

export function ChromefulComponentBlockElement(props: {
  children: ReactNode;
  renderedBlock: ReactNode;
  componentBlock: ComponentBlock & { chromeless?: false };
  previewProps: PreviewPropsForToolbar<
    ObjectField<Record<string, ComponentSchema>>
  >;
  elementProps: Record<string, unknown>;
  onRemove: () => void;
  attributes: RenderElementProps['attributes'];
}) {
  const selected = useSelected();

  const isValid = useMemo(
    () =>
      clientSideValidateProp(
        { kind: 'object', fields: props.componentBlock.schema },
        props.elementProps,
        undefined
      ),

    [props.componentBlock, props.elementProps]
  );

  const [editMode, setEditMode] = useState(false);
  const onCloseEditMode = useCallback(() => {
    setEditMode(false);
  }, []);
  const onShowEditMode = useCallback(() => {
    setEditMode(true);
  }, []);

  const ChromefulToolbar =
    props.componentBlock.toolbar ?? DefaultToolbarWithChrome;
  return (
    <Flex
      {...props.attributes}
      marginY="xlarge"
      paddingStart="xlarge"
      gap="medium"
      direction="column"
      position="relative"
      UNSAFE_className={css({
        '::before': {
          display: 'block',
          content: '" "',
          backgroundColor: selected
            ? tokenSchema.color.alias.borderSelected
            : editMode
            ? tokenSchema.color.alias.borderFocused
            : tokenSchema.color.alias.borderIdle,
          borderRadius: 4,
          width: 4,
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 1,
        },
      })}
    >
      <NotEditable>
        <Text
          casing="uppercase"
          color="neutralSecondary"
          weight="medium"
          size="small"
        >
          {props.componentBlock.label}
        </Text>
      </NotEditable>
      {editMode ? (
        <Fragment>
          <FormValue
            isValid={isValid}
            props={props.previewProps}
            onClose={onCloseEditMode}
          />
          <div className={css({ display: 'none' })}>{props.children}</div>
        </Fragment>
      ) : (
        <Fragment>
          {props.renderedBlock}
          <ChromefulToolbar
            isValid={isValid}
            onRemove={props.onRemove}
            onShowEditMode={onShowEditMode}
            props={props.previewProps}
          />
        </Fragment>
      )}
    </Flex>
  );
}

function DefaultToolbarWithChrome({
  onShowEditMode,
  onRemove,
  isValid,
}: {
  onShowEditMode(): void;
  onRemove(): void;
  props: any;
  isValid: boolean;
}) {
  const stringFormatter = useLocalizedStringFormatter(l10nMessages);
  return (
    <NotEditable>
      <Flex direction="column" gap="medium">
        <Flex alignItems="center" gap="regular">
          <ActionButton onPress={() => onShowEditMode()}>
            {stringFormatter.format('edit')}
          </ActionButton>
          <TooltipTrigger>
            <ActionButton prominence="low" onPress={onRemove}>
              <Icon src={trash2Icon} />
            </ActionButton>
            <Tooltip tone="critical">
              {stringFormatter.format('delete')}
            </Tooltip>
          </TooltipTrigger>
        </Flex>
        {!isValid && (
          <FieldMessage>Contains invalid fields. Please edit.</FieldMessage>
        )}
      </Flex>
    </NotEditable>
  );
}

function FormValue({
  onClose,
  props,
  isValid,
}: {
  props: GenericPreviewProps<NonChildFieldComponentSchema, unknown>;
  onClose(): void;
  isValid: boolean;
}) {
  const [forceValidation, setForceValidation] = useState(false);

  return (
    <Flex
      direction="column"
      gap="medium"
      contentEditable={false}
      UNSAFE_className={css({ whiteSpace: 'initial' })}
    >
      <FormValueContentFromPreviewProps
        {...props}
        forceValidation={forceValidation}
      />
      <Button
        alignSelf="start"
        tone="accent"
        onPress={() => {
          if (isValid) {
            onClose();
          } else {
            setForceValidation(true);
          }
        }}
      >
        Done
      </Button>
    </Flex>
  );
}
