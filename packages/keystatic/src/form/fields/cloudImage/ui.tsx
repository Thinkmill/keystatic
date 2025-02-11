import { ClipboardEvent, useEffect, useId, useState } from 'react';

import { ObjectField, PreviewProps } from '@keystatic/core';
import { ClearButton } from '@keystar/ui/button';
import { Icon } from '@keystar/ui/icon';
import { imageIcon } from '@keystar/ui/icon/icons/imageIcon';
import { Box, Flex, VStack } from '@keystar/ui/layout';
import { TextLink } from '@keystar/ui/link';
import { ProgressCircle } from '@keystar/ui/progress';
import { tokenSchema } from '@keystar/ui/style';
import { TextArea, TextField } from '@keystar/ui/text-field';
import { Text } from '@keystar/ui/typography';

import { cloudImageSchema } from '../../../component-blocks/cloud-image-schema';
import {
  CloudImageProps,
  ImageDimensionsInput,
  ImageStatus,
  UploadImageButton,
  emptyImageData,
  loadImageData,
  parseImageData,
  useImageLibraryURL,
} from '../../../component-blocks/cloud-image-preview';
import { useConfig } from '../../../app/shell/context';
import { isValidURL } from '../document/DocumentEditor/isValidURL';
import { useEventCallback } from '../document/DocumentEditor/ui-utils';

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

  const onPaste = (event: ClipboardEvent<HTMLInputElement>) => {
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
      ? 'Image URL is required.'
      : undefined;

  return (
    <VStack gap="xlarge" padding="large">
      <VStack gap="medium">
        <TextField
          label="Image URL"
          isRequired={props.isRequired}
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
              Upload an image, or copy a URL from the{' '}
              <TextLink
                prominence="high"
                href={imageLibraryURL}
                target="_blank"
                rel="noreferrer"
              >
                Image&nbsp;Library
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
        <UploadImageButton
          alignSelf="start"
          onUploaded={data => {
            onChange(data);
          }}
        />
      </VStack>
      {status === 'good' ? (
        <>
          <Box
            alignSelf="start"
            backgroundColor="canvas"
            borderRadius="regular"
            border="neutral"
            padding="regular"
          >
            <img
              alt={image.alt}
              src={image.src}
              style={{
                display: 'block',
                maxHeight: tokenSchema.size.alias.singleLineWidth,
                maxWidth: '100%',
              }}
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
      ) : (
        <VStack
          aria-hidden
          alignItems="center"
          backgroundColor="surface"
          borderRadius="regular"
          gap="medium"
          paddingX="large"
          paddingY="xlarge"
        >
          <Icon src={imageIcon} color="neutralSecondary" size="medium" />
          <Text align="center" color="neutralSecondary" size="small">
            Awaiting URL to display image preview and information…
          </Text>
        </VStack>
      )}
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
    <VStack
      aria-labelledby={labelId}
      aria-describedby={props.schema.description ? descriptionId : undefined}
      border="muted"
      borderRadius="medium"
      minWidth={0}
      role="group"
    >
      <VStack
        backgroundColor="surface"
        borderBottom="muted"
        borderTopStartRadius="medium"
        borderTopEndRadius="medium"
        gap="medium"
        minWidth={0}
        padding="large"
      >
        <Text
          color="neutralEmphasis"
          size="medium"
          weight="medium"
          id={labelId}
        >
          {props.schema.label}
        </Text>
        {!!props.schema.description && (
          <Text id={descriptionId} size="regular" color="neutralSecondary">
            {props.schema.description}
          </Text>
        )}
      </VStack>
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
    </VStack>
  );
}
