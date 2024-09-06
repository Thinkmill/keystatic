import { createGetPreviewProps } from '../../../preview-props';
import { ObjectField } from '../../../api';
import {
  Dialog,
  DialogContainer,
  useDialogContainer,
} from '@keystar/ui/dialog';
import { useLocalizedStringFormatter } from '@react-aria/i18n';
import { clientSideValidateProp } from '../../../errors';
import { Content } from '@keystar/ui/slots';
import { FormValueContentFromPreviewProps } from '../../../form-from-preview';
import { ButtonGroup, Button, ActionButton } from '@keystar/ui/button';
import { Heading } from '@keystar/ui/typography';
import { useState, useMemo } from 'react';
import l10nMessages from '../../../../app/l10n';
import { focusWithPreviousSelection } from './ui-utils';
import { ReactEditor, useSlateStatic } from 'slate-react';
import { Element, Transforms } from 'slate';
import { Icon } from '@keystar/ui/icon';
import { editIcon } from '@keystar/ui/icon/icons/editIcon';
import { TooltipTrigger, Tooltip } from '@keystar/ui/tooltip';
import { getInitialPropsValueFromInitializer } from '../../../initial-values';

function CustomAttributesDialogInner(props: {
  element: Element;
  schema: ObjectField;
  nodeLabel: string;
}) {
  const editor = useSlateStatic();
  const [state, setState] = useState(() => {
    return getInitialPropsValueFromInitializer(
      props.schema,
      Object.fromEntries(
        Object.keys(props.schema.fields).map(key => [
          key,
          (props.element as any)[key],
        ])
      )
    );
  });
  const [forceValidation, setForceValidation] = useState(false);

  const previewProps = useMemo(
    () => createGetPreviewProps(props.schema, setState, () => undefined),
    [props.schema]
  )(state);

  let { dismiss } = useDialogContainer();
  const stringFormatter = useLocalizedStringFormatter(l10nMessages);

  return (
    <Dialog size="small">
      <form
        style={{ display: 'contents' }}
        onSubmit={event => {
          if (event.target !== event.currentTarget) return;
          event.preventDefault();
          setForceValidation(true);
          if (clientSideValidateProp(props.schema, state, undefined)) {
            dismiss();
            const path = ReactEditor.findPath(editor, props.element);
            console.log(state);
            Transforms.setNodes(editor, state, { at: path });
          }
        }}
      >
        <Heading>{props.nodeLabel} details</Heading>
        <Content>
          <FormValueContentFromPreviewProps
            forceValidation={forceValidation}
            autoFocus
            {...previewProps}
          />
        </Content>
        <ButtonGroup>
          <Button onPress={dismiss}>{stringFormatter.format('cancel')}</Button>
          <Button prominence="high" type="submit">
            {stringFormatter.format('save')}
          </Button>
        </ButtonGroup>
      </form>
    </Dialog>
  );
}

export function CustomAttributesEditButton(props: { onPress: () => void }) {
  const stringFormatter = useLocalizedStringFormatter(l10nMessages);
  return (
    <TooltipTrigger>
      <ActionButton prominence="low" onPress={props.onPress}>
        <Icon src={editIcon} />
      </ActionButton>
      <Tooltip>{stringFormatter.format('edit')}</Tooltip>
    </TooltipTrigger>
  );
}

export function CustomAttributesDialog(props: {
  onDismiss: () => void;
  isOpen: boolean;
  schema: ObjectField;
  nodeLabel: string;
  element: Element;
}) {
  const editor = useSlateStatic();
  return (
    <DialogContainer
      onDismiss={() => {
        props.onDismiss();
        focusWithPreviousSelection(editor);
      }}
    >
      {props.isOpen && (
        <CustomAttributesDialogInner
          element={props.element}
          nodeLabel={props.nodeLabel}
          schema={props.schema}
        />
      )}
    </DialogContainer>
  );
}
