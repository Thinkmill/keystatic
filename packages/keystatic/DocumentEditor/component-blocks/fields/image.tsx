import { ButtonGroup, ActionButton } from '@voussoir/button';
import { FieldLabel, FieldMessage } from '@voussoir/field';
import { Flex, Box } from '@voussoir/layout';
import { tokenSchema } from '@voussoir/style';
import { TextField } from '@voussoir/text-field';
import { useState, useEffect, useReducer } from 'react';
import { useIsInDocumentEditor } from '../..';
import { fixPath } from '../../../app/path-utils';
import { FormFieldWithFileNotRequiringContentsForReader } from '../api';
import { RequiredValidation } from './utils';

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

export function getUploadedImage(): Promise<
  { content: Uint8Array; filename: string } | undefined
> {
  return new Promise(resolve => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    let didChange = false;
    input.onchange = () => {
      didChange = true;
      const file = input.files?.[0];
      const extension = file?.name.match(/\.([^.]+$)/)?.[1];
      if (file && extension) {
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

export function image<IsRequired extends boolean | undefined>({
  label,
  directory,
  validation,
}: {
  label: string;
  directory?: string;
  validation?: { isRequired?: IsRequired };
} & RequiredValidation<IsRequired>): FormFieldWithFileNotRequiringContentsForReader<
  | {
      kind: 'uploaded';
      data: Uint8Array;
      extension: string;
      filename: string;
    }
  | { kind: 'none' },
  undefined,
  string | (IsRequired extends true ? never : null)
> {
  return {
    kind: 'form',
    Input({ onChange, value, forceValidation }) {
      const [blurred, onBlur] = useReducer(() => true, false);
      const isInEditor = useIsInDocumentEditor();
      const objectUrl = useObjectURL(
        value.kind === 'uploaded' ? value.data : null
      );
      return (
        <Flex direction="column" gap="medium">
          <FieldLabel>{label}</FieldLabel>

          <ButtonGroup>
            <ActionButton
              onPress={async () => {
                const image = await getUploadedImage();
                if (image) {
                  const extension = image.filename.match(/\.([^.]+$)/)?.[1];
                  if (extension) {
                    onChange({
                      kind: 'uploaded',
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
            {value.kind === 'uploaded' && (
              <ActionButton
                prominence="low"
                onPress={() => {
                  onChange({ kind: 'none' });
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
          {isInEditor && value.kind === 'uploaded' && (
            <TextField
              label="Filename"
              onChange={filename => {
                onChange({ ...value, filename });
              }}
              value={value.filename}
            />
          )}
          {(forceValidation || blurred) &&
            validation?.isRequired &&
            value.kind === 'none' && (
              <FieldMessage>{label} is required</FieldMessage>
            )}
        </Flex>
      );
    },
    options: undefined,
    defaultValue: { kind: 'none' },
    validate(value) {
      if (
        typeof value === 'object' &&
        value !== null &&
        'kind' in value &&
        value.kind === 'none' &&
        validation?.isRequired
      ) {
        return false;
      }
      return true;
    },
    serializeToFile: {
      kind: 'asset',
      directory: directory ? fixPath(directory) : undefined,
      filename(value, suggestedFilenamePrefix) {
        if (typeof value === 'string') return value;
        if (
          typeof value === 'object' &&
          value !== null &&
          'extension' in value &&
          typeof value.extension === 'string'
        ) {
          return suggestedFilenamePrefix + '.' + value.extension;
        }
      },
      parse({ content, value }) {
        return content
          ? {
              kind: 'uploaded',
              data: content,
              extension:
                value && typeof value === 'object' && 'extension' in value
                  ? (value as any).extension
                  : typeof value === 'string'
                  ? value.match(/\.([^.]+$)/)?.[1]
                  : '',
              filename: typeof value === 'string' ? value : '',
            }
          : { kind: 'none' };
      },
      serialize(value, suggestedFilenamePrefix) {
        if (value.kind === 'none') {
          return { value: null, content: undefined };
        }
        const filename = suggestedFilenamePrefix
          ? suggestedFilenamePrefix + '.' + value.extension
          : value.filename;
        return { value: filename, content: value.data, filename };
      },
      reader: {
        requiresContentInReader: false,
        parseToReader({ value, suggestedFilenamePrefix }) {
          if (!value) return null as any;
          return typeof value === 'string'
            ? value
            : suggestedFilenamePrefix + '.' + (value as any).extension;
        },
      },
    },
  };
}
