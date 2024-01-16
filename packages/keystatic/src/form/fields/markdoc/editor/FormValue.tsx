import { Flex } from '@keystar/ui/layout';
import { Button, ButtonGroup } from '@keystar/ui/button';
import { useDialogContainer } from '@keystar/ui/dialog';
import { useId, useMemo, useState } from 'react';
import { FormValueContentFromPreviewProps } from '../../../form-from-preview';
import { Content } from '@keystar/ui/slots';
import { useLocalizedStringFormatter } from '@react-aria/i18n';
import { clientSideValidateProp } from '../../../errors';
import { createGetPreviewProps } from '../../../preview-props';
import l10nMessages from '../../../../app/l10n/index.json';
import { ComponentSchema } from '../../../api';

export function FormValue(props: {
  value: Record<string, unknown>;
  schema: ComponentSchema;
  onSave(value: Record<string, unknown>): void;
}) {
  const stringFormatter = useLocalizedStringFormatter(l10nMessages);
  const formId = useId();
  const [forceValidation, setForceValidation] = useState(false);
  const [state, setState] = useState(props.value);
  const previewProps = useMemo(
    () => createGetPreviewProps(props.schema, setState, () => undefined),
    [props.schema]
  )(state);
  const { dismiss } = useDialogContainer();

  return (
    <>
      <Content>
        <Flex
          id={formId}
          elementType="form"
          onSubmit={event => {
            if (event.target !== event.currentTarget) return;
            event.preventDefault();
            if (!clientSideValidateProp(props.schema, state, undefined)) {
              setForceValidation(true);
            } else {
              props.onSave(state);
              dismiss();
            }
          }}
          direction="column"
          gap="xxlarge"
        >
          <FormValueContentFromPreviewProps
            {...previewProps}
            forceValidation={forceValidation}
          />
        </Flex>
      </Content>
      <ButtonGroup>
        <Button onPress={dismiss}>{stringFormatter.format('cancel')}</Button>
        <Button form={formId} prominence="high" type="submit">
          Done
        </Button>
      </ButtonGroup>
    </>
  );
}
