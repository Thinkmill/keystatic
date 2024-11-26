import { ButtonGroup, ActionButton } from '@keystar/ui/button';
import { FieldDescription, FieldLabel, FieldMessage } from '@keystar/ui/field';
import { Flex, Box } from '@keystar/ui/layout';
import { tokenSchema } from '@keystar/ui/style';
import { TextField } from '@keystar/ui/text-field';

import { useIsInDocumentEditor } from '../document/DocumentEditor';
import { useState, useEffect, useReducer, useId } from 'react';
import { FormFieldInputProps } from '../../api';

export function getUploadedFileObject(
  accept: string
): Promise<File | undefined> {
  return new Promise(resolve => {
    const input = document.createElement('input');
    input.type = 'file';
    input.style.display = 'none';
    input.accept = accept;
    input.onchange = () => {
      const file = input.files?.[0];
      if (file) {
        resolve(file);
      }
    };
    document.body.appendChild(input);
    input.click();
  });
}

export async function getUploadedFile(
  accept: string
): Promise<{ content: Uint8Array; filename: string } | undefined> {
  const file = await getUploadedFileObject(accept);
  if (!file) return undefined;
  return {
    content: new Uint8Array(await file.arrayBuffer()),
    filename: file.name,
  };
}

export function getUploadedImage(): Promise<
  { content: Uint8Array; filename: string } | undefined
> {
  return getUploadedFile('image/*');
}

export function useObjectURL(
  data: Uint8Array | null,
  contentType: string | undefined
) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    if (data) {
      const url = URL.createObjectURL(new Blob([data], { type: contentType }));
      setUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setUrl(null);
    }
  }, [contentType, data]);
  return url;
}

// TODO: button labels ("Choose file", "Remove") need i18n support
export function ImageFieldInput(
  props: FormFieldInputProps<{
    data: Uint8Array;
    extension: string;
    filename: string;
  } | null> & {
    label: string;
    description: string | undefined;
    validation: { isRequired?: boolean } | undefined;
    transformFilename: ((originalFile: string) => string) | undefined;
  }
) {
  const { value } = props;
  const [blurred, onBlur] = useReducer(() => true, false);
  const isInEditor = useIsInDocumentEditor();
  const objectUrl = useObjectURL(
    value === null ? null : value.data,
    value?.extension === 'svg' ? 'image/svg+xml' : undefined
  );
  const labelId = useId();
  const descriptionId = useId();
  return (
    <Flex
      aria-describedby={props.description ? descriptionId : undefined}
      aria-labelledby={labelId}
      direction="column"
      gap="medium"
      role="group"
    >
      <FieldLabel
        id={labelId}
        elementType="span"
        isRequired={props.validation?.isRequired}
      >
        {props.label}
      </FieldLabel>
      {props.description && (
        <FieldDescription id={descriptionId}>
          {props.description}
        </FieldDescription>
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
                  filename: props.transformFilename
                    ? props.transformFilename(image.filename)
                    : image.filename,
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
