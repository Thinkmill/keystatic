import { ButtonGroup, ActionButton, Button } from '@keystar/ui/button';
import { FieldDescription, FieldLabel, FieldMessage } from '@keystar/ui/field';
import { Flex } from '@keystar/ui/layout';
import { TextField } from '@keystar/ui/text-field';

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
    transformFilename: ((originalFilename: string) => string) | undefined;
  }
) {
  const { value } = props;
  const [blurred, onBlur] = useReducer(() => true, false);
  const isInEditor = useIsInDocumentEditor();
  const objectUrl = useObjectURL(value === null ? null : value.data, undefined);
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
            const file = await getUploadedFile('');
            if (file) {
              props.onChange({
                data: file.content,
                filename: props.transformFilename
                  ? props.transformFilename(file.filename)
                  : file.filename,
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
