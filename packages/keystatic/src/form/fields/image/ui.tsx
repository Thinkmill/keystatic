'use client';
import { ButtonGroup, ActionButton } from '@voussoir/button';
import { FieldLabel, FieldMessage } from '@voussoir/field';
import { Flex, Box } from '@voussoir/layout';
import { tokenSchema } from '@voussoir/style';
import { TextField } from '@voussoir/text-field';
import { Text } from '@voussoir/typography';

import { useIsInDocumentEditor } from '../document/DocumentEditor';
import { useState, useEffect, useReducer } from 'react';
import { FormFieldInputProps } from '../../api';

export function getUploadedFile(
  accept: string
): Promise<{ content: Uint8Array; filename: string } | undefined> {
  return new Promise(resolve => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = accept;
    let didChange = false;
    input.onchange = () => {
      didChange = true;
      const file = input.files?.[0];
      if (file) {
        file.arrayBuffer().then(buffer => {
          resolve({
            content: new Uint8Array(buffer),
            filename: file.name,
          });
        });
      }
    };
    const cancelDetector = () => {
      window.removeEventListener('focus', cancelDetector);
      setTimeout(() => {
        if (input.files?.length === 0 && !didChange) {
          resolve(undefined);
        }
      }, 500);
      if ([...document.body.childNodes].includes(input)) {
        document.body.removeChild(input);
      }
    };
    input.addEventListener('click', () => {
      window.addEventListener('focus', cancelDetector, true);
    });
    document.body.appendChild(input);
    input.click();
  });
}

export function getUploadedImage(): Promise<
  { content: Uint8Array; filename: string } | undefined
> {
  return getUploadedFile('image/*');
}

export function useObjectURL(data: Uint8Array | null) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    if (data) {
      const url = URL.createObjectURL(new Blob([data]));
      setUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setUrl(null);
    }
  }, [data]);
  return url;
}

export function ImageFieldInput(
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
            const image = await getUploadedImage();
            if (image) {
              const extension = image.filename.match(/\.([^.]+$)/)?.[1];
              if (extension) {
                props.onChange({
                  data: image.content,
                  extension,
                  filename: image.filename,
                });
              }
            }
          }}
        >
          Choose file
        </ActionButton>
        {value !== null && (
          <ActionButton
            prominence="low"
            onPress={() => {
              props.onChange(null);
              onBlur();
            }}
          >
            Remove
          </ActionButton>
        )}
      </ButtonGroup>
      {objectUrl && (
        <Box
          alignSelf="start"
          backgroundColor="canvas"
          borderRadius="regular"
          border="neutral"
          padding="regular"
        >
          <img
            src={objectUrl}
            alt=""
            style={{
              display: 'block',
              maxHeight: tokenSchema.size.alias.singleLineWidth,
              maxWidth: '100%',
            }}
          />
        </Box>
      )}
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
