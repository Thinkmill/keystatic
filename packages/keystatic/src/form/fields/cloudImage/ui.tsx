import { useEffect, useId, useState } from 'react';

import { ClearButton } from '@keystar/ui/button';
import { ObjectField, PreviewProps } from '@keystatic/core';
import { Box, Flex, VStack } from '@keystar/ui/layout';
import { TextLink } from '@keystar/ui/link';
import { ProgressCircle } from '@keystar/ui/progress';
import { TextArea, TextField } from '@keystar/ui/text-field';
import { Text } from '@keystar/ui/typography';
import { cloudImageSchema } from '../../../component-blocks/cloud-image-schema';
import {
  emptyImageData,
  parseImageData,
  useImageLibraryURL,
  CloudImageProps,
  ImageDimensionsInput,
  loadImageData,
} from '../../../component-blocks/cloud-image-preview';
import { isValidURL } from '../document/DocumentEditor/isValidURL';
import { useEventCallback } from '../document/DocumentEditor/ui-utils';
import { useConfig } from '../../../app/shell/context';

type ImageStatus = '' | 'loading' | 'good' | 'error';

function ImageField(props: {
  image: CloudImageProps;
  isRequired?: boolean;
  forceValidation?: boolean;
  autoFocus?: boolean;
  onChange: (data: CloudImageProps) => void;
}) {
  const { image, onChange } = props;
  const [status, setStatus] = useState<ImageStatus>(image.src ? 'good' : '');
  const imageLibraryURL = useImageLibraryURL();

  const onPaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const text = event.clipboardData.getData('text/plain');
    const parsed = parseImageData(text);
    props.onChange(parsed);
  };

  const onLoad = useEventCallback(data => {
    onChange(data);
    setStatus('good');
  });
  const config = useConfig();

  const hasSetFields = !!(
    props.image.alt ||
    props.image.width ||
    props.image.height
  );

  useEffect(() => {
    if (!props.image.src) {
      setStatus('');
      return;
    }
    if (!isValidURL(props.image.src)) {
      return;
    }
    if (hasSetFields) {
      setStatus('good');
      return;
    }
    setStatus('loading');
    loadImageData(props.image.src, config)
      .then(newData => {
        onLoad(newData);
      })
      .catch(() => {
        setStatus('error');
      });
  }, [config, hasSetFields, onLoad, props.image.src]);
  const [blurred, setBlurred] = useState(false);

  const errorMessage =
    (blurred || props.forceValidation) && props.isRequired && !image.src
      ? 'Image URL is required'
      : undefined;

  return (
    <VStack gap="xlarge">
      <TextField
        label="Image URL"
        errorMessage={errorMessage}
        autoFocus={props.autoFocus}
        onPaste={onPaste}
        onKeyDown={e => {
          if (e.code === 'Backspace' || e.code === 'Delete') {
            props.onChange(emptyImageData);
          }
        }}
        onBlur={() => setBlurred(true)}
        value={image.src}
        description={
          <Text>
            Copy an image URL from the{' '}
            <TextLink
              prominence="high"
              href={imageLibraryURL}
              target="_blank"
              rel="noreferrer"
            >
              Image Library
            </TextLink>{' '}
            and paste it into this field.
          </Text>
        }
        endElement={
          status === 'loading' ? (
            <Flex
              height="element.regular"
              width="element.regular"
              alignItems="center"
              justifyContent="center"
            >
              <ProgressCircle
                size="small"
                aria-label="Checking…"
                isIndeterminate
              />
            </Flex>
          ) : image.src ? (
            <ClearButton
              onPress={() => {
                props.onChange(emptyImageData);
                setStatus('');
              }}
              preventFocus
            />
          ) : null
        }
      />
      {status === 'good' ? (
        <>
          <Box width="scale.1600" height="scale.1600">
            <img
              alt={image.alt}
              src={image.src}
              style={{ objectFit: 'contain', height: '100%', width: '100%' }}
            />
          </Box>
          <TextArea
            label="Alt text"
            value={image.alt}
            onChange={alt => props.onChange({ ...image, alt })}
          />
          <ImageDimensionsInput
            src={image.src}
            image={image}
            onChange={dimensions => {
              onChange({ ...props.image, ...dimensions });
            }}
          />
        </>
      ) : null}
    </VStack>
  );
}

export function CloudImageFieldInput(
  props: PreviewProps<ObjectField<typeof cloudImageSchema>> & {
    autoFocus?: boolean;
    forceValidation?: boolean;
    isRequired?: boolean;
  }
) {
  const labelId = useId();
  const descriptionId = useId();
  return (
    <Flex
      role="group"
      gap="medium"
      marginY="large"
      aria-labelledby={labelId}
      aria-describedby={props.schema.description ? descriptionId : undefined}
      direction="column"
    >
      <Text color="neutral" size="medium" weight="medium" id={labelId}>
        {props.schema.label}
      </Text>
      {!!props.schema.description && (
        <Text id={descriptionId} size="regular" color="neutralSecondary">
          {props.schema.description}
        </Text>
      )}
      <ImageField
        image={{
          src: props.fields.src.value,
          alt: props.fields.alt.value,
          width: props.fields.width.value ?? undefined,
          height: props.fields.height.value ?? undefined,
        }}
        onChange={data => {
          props.onChange({
            src: data.src,
            alt: data.alt,
            width: data.width ?? null,
            height: data.height ?? null,
          });
        }}
        autoFocus={props.autoFocus}
        isRequired={props.isRequired}
        forceValidation={props.forceValidation}
      />
    </Flex>
  );
}
