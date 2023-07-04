'use client';
import { ButtonGroup, ActionButton, Button } from '@keystar/ui/button';
import { FieldLabel, FieldMessage } from '@keystar/ui/field';
import { Flex } from '@keystar/ui/layout';
import { TextField } from '@keystar/ui/text-field';
import { Text } from '@keystar/ui/typography';

import { useIsInDocumentEditor } from '../document/DocumentEditor';
import { useReducer } from 'react';
import { FormFieldInputProps } from '../../api';
import { getUploadedFile, useObjectURL } from '../image/ui';

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
  return (
    <Flex direction="column" gap="medium">
      <FieldLabel>{props.label}</FieldLabel>
      {props.description && (
        <Text size="small" color="neutralSecondary">
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
