import { ButtonGroup, ActionButton } from '@voussoir/button';
import { FieldLabel } from '@voussoir/field';
import { Flex, Box } from '@voussoir/layout';
import { tokenSchema } from '@voussoir/style';
import { TextField } from '@voussoir/text-field';
import { useState, useEffect, useRef, useMemo } from 'react';
import { useIsInDocumentEditor } from '../..';
import { fixPath } from '../../../app/path-utils';
import { FormFieldWithFileNotRequiringContentsForReader } from '../api';

export function image({
  label,
  directory,
}: {
  label: string;
  directory?: string;
}): FormFieldWithFileNotRequiringContentsForReader<
  | {
      kind: 'uploaded';
      data: Uint8Array;
      extension: string;
      filename: string;
    }
  | { kind: 'none' },
  undefined,
  string | null
> {
  function useObjectURL(data: Uint8Array | null) {
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
  return {
    kind: 'form',
    Input({ onChange, value }) {
      const inputRef = useRef<HTMLInputElement | null>(null);
      const isInEditor = useIsInDocumentEditor();
      const objectUrl = useObjectURL(
        value.kind === 'uploaded' ? value.data : null
      );

      // eslint-disable-next-line react-hooks/exhaustive-deps
      const inputKey = useMemo(() => Math.random(), [value]);
      return (
        <Flex direction="column" gap="medium">
          <FieldLabel>{label}</FieldLabel>

          <ButtonGroup>
            <ActionButton
              onPress={() => {
                inputRef.current?.click();
              }}
            >
              Choose file
            </ActionButton>
            {value.kind === 'uploaded' && (
              <ActionButton
                prominence="low"
                onPress={() => {
                  onChange({ kind: 'none' });
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
          <input
            style={{ display: 'none' }}
            type="file"
            accept="image/*"
            key={inputKey}
            ref={inputRef}
            onChange={async event => {
              const file = event.target.files?.[0];
              const extension = file?.name.match(/\.([^.]+$)/)?.[1];
              if (file && extension) {
                onChange({
                  kind: 'uploaded',
                  data: new Uint8Array(await file.arrayBuffer()),
                  extension,
                  filename: file.name,
                });
              }
            }}
          />
          {isInEditor && value.kind === 'uploaded' && (
            <TextField
              label="Filename"
              onChange={filename => {
                onChange({ ...value, filename });
              }}
              value={value.filename}
            />
          )}
        </Flex>
      );
    },
    options: undefined,
    defaultValue: { kind: 'none' },
    validate() {
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
          if (!value) return null;
          return typeof value === 'string'
            ? value
            : suggestedFilenamePrefix + '.' + (value as any).extension;
        },
      },
    },
  };
}
