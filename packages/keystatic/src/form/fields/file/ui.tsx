'use client';
import { ButtonGroup, ActionButton, Button } from '@voussoir/button';
import { FieldLabel, FieldMessage } from '@voussoir/field';
import { Flex } from '@voussoir/layout';
import { TextField } from '@voussoir/text-field';
import { Text } from '@voussoir/typography';

import { useIsInDocumentEditor } from '../document/DocumentEditor';
import { useId, useReducer } from 'react';
import { FormFieldInputProps } from '../../api';
import { getUploadedFile, useObjectURL } from '../image/ui';

// TODO: button labels ("Choose file", "Remove", "Download") need i18n support
export function FileFieldInput(
  props: FormFieldInputProps<{
    data: Uint8Array;
    extension: string;
    filename: string;
  } | null> & {
    label: string;
    description: string | undefined;
    validation: { isRequired?: boolean } | undefined;
  }
) {
  const { value } = props;
  const [blurred, onBlur] = useReducer(() => true, false);
  const isInEditor = useIsInDocumentEditor();
  const objectUrl = useObjectURL(value === null ? null : value.data);
  const labelId = useId();
  const descriptionId = useId();
  return (
    <Flex
      aria-aria-describedby={props.description ? descriptionId : undefined}
      aria-labelledby={labelId}
      direction="column"
      gap="medium"
      role="group"
    >
      <FieldLabel id={labelId} elementType="span">
        {props.label}
      </FieldLabel>
      {props.description && (
        <Text size="small" color="neutralSecondary" id={descriptionId}>
          {props.description}
        </Text>
      )}
      <ButtonGroup>
        <ActionButton
          onPress={async () => {
            const file = await getUploadedFile('');
            if (file) {
              props.onChange({
                data: file.content,
                filename: file.filename,
                extension: file.filename.match(/\.([^.]+$)/)?.[1] ?? '',
              });
            }
          }}
        >
          Choose file
        </ActionButton>
        {value !== null && (
          <>
            <ActionButton
              prominence="low"
              onPress={() => {
                props.onChange(null);
                onBlur();
              }}
            >
              Remove
            </ActionButton>
            {objectUrl && (
              <Button
                href={objectUrl}
                download={value.filename}
                prominence="low"
              >
                Download
              </Button>
            )}
          </>
        )}
      </ButtonGroup>
      {isInEditor && value !== null && (
        <TextField
          label="Filename"
          onChange={filename => {
            props.onChange({ ...value, filename });
          }}
          value={value.filename}
        />
      )}
      {(props.forceValidation || blurred) &&
        props.validation?.isRequired &&
        value === null && (
          <FieldMessage>{props.label} is required</FieldMessage>
        )}
    </Flex>
  );
}
