import { ButtonGroup, ActionButton } from '@keystar/ui/button';
import { FieldDescription, FieldLabel, FieldMessage } from '@keystar/ui/field';
import { Flex, Box } from '@keystar/ui/layout';
import { ProgressCircle } from '@keystar/ui/progress';
import { tokenSchema } from '@keystar/ui/style';
import { TextField } from '@keystar/ui/text-field';
import { Text } from '@keystar/ui/typography';

import { useIsInDocumentEditor } from '../document/DocumentEditor';
import { useState, useEffect, useReducer, useId } from 'react';
import { FormFieldInputProps } from '../../api';
import {
  compressImage,
  formatBytes,
  type ImageCompressionConfig,
} from './compress';

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

type CompressionInfo = {
  originalSize: number;
  compressedSize: number;
};

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
    compression: ImageCompressionConfig | undefined;
  }
) {
  const { value } = props;
  const [blurred, onBlur] = useReducer(() => true, false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionInfo, setCompressionInfo] =
    useState<CompressionInfo | null>(null);
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
          isDisabled={isCompressing}
          onPress={async () => {
            const file = await getUploadedFileObject('image/*');
            if (!file) return;

            const originalExtension = file.name.match(/\.([^.]+$)/)?.[1];
            if (!originalExtension) return;

            // If compression is configured, compress the image
            if (props.compression) {
              setIsCompressing(true);
              setCompressionInfo(null);
              try {
                const result = await compressImage(file, props.compression);
                setCompressionInfo({
                  originalSize: result.originalSize,
                  compressedSize: result.compressedSize,
                });
                // Update filename extension if format changed
                let filename = file.name;
                if (result.extension !== originalExtension.toLowerCase()) {
                  filename = file.name.replace(
                    /\.[^.]+$/,
                    `.${result.extension}`
                  );
                }
                if (props.transformFilename) {
                  filename = props.transformFilename(filename);
                }
                props.onChange({
                  data: result.data,
                  extension: result.extension,
                  filename,
                });
              } finally {
                setIsCompressing(false);
              }
            } else {
              // No compression, use original file
              const content = new Uint8Array(await file.arrayBuffer());
              props.onChange({
                data: content,
                extension: originalExtension,
                filename: props.transformFilename
                  ? props.transformFilename(file.name)
                  : file.name,
              });
            }
          }}
        >
          {isCompressing ? (
            <ProgressCircle size="small" aria-label="Compressing" />
          ) : (
            'Choose file'
          )}
        </ActionButton>
        {value !== null && (
          <ActionButton
            prominence="low"
            onPress={() => {
              props.onChange(null);
              setCompressionInfo(null);
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
      {compressionInfo &&
        compressionInfo.originalSize !== compressionInfo.compressedSize && (
          <Text size="small" color="neutralSecondary">
            {formatBytes(compressionInfo.originalSize)} →{' '}
            {formatBytes(compressionInfo.compressedSize)} (
            {Math.round(
              (1 -
                compressionInfo.compressedSize / compressionInfo.originalSize) *
                100
            )}
            % smaller)
          </Text>
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
