'use client';

import { useEffect, useId, useState } from 'react';

import { ActionButton, ClearButton } from '@keystar/ui/button';
import { ObjectField, PreviewProps } from '@keystatic/core';
import { Icon } from '@keystar/ui/icon';
import { undo2Icon } from '@keystar/ui/icon/icons/undo2Icon';
import { Box, Flex, HStack, VStack } from '@keystar/ui/layout';
import { TextLink } from '@keystar/ui/link';
import { NumberField } from '@keystar/ui/number-field';
import { ProgressCircle } from '@keystar/ui/progress';
import { TextArea, TextField } from '@keystar/ui/text-field';
import { Tooltip, TooltipTrigger } from '@keystar/ui/tooltip';
import { Text } from '@keystar/ui/typography';
import { cloudImageSchema } from '../../../component-blocks/cloud-image-schema';
import {
  emptyImageData,
  parseImageData,
  useImageLibraryURL,
  CloudImageProps,
} from '../../../component-blocks/cloud-image-preview';
import { isValidURL } from '../document/DocumentEditor/isValidURL';
import { useEventCallback } from '../document/DocumentEditor/ui-utils';

type ImageDimensions = Pick<CloudImageProps, 'width' | 'height'>;

type ImageStatus = '' | 'loading' | 'good' | 'error';

function useImageDimensions(src: string) {
  const [dimensions, setDimensions] = useState<ImageDimensions>({});
  useEffect(() => {
    if (!src || !isValidURL(src)) {
      setDimensions({});
      return;
    }
    const img = new Image();
    img.onload = () => {
      setDimensions({ width: img.width, height: img.height });
    };
    img.src = src;
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);
  return dimensions;
}

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
  const dimensions = useImageDimensions(image.src);
  const revertLabel = `Revert to original (${dimensions.width} × ${dimensions.height})`;
  const dimensionsMatchOriginal =
    dimensions.width === image.width && dimensions.height === image.height;

  const [lastPastedUrl, setLastPastedUrl] = useState<string | null>(null);

  const onPaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const text = event.clipboardData.getData('text/plain');
    const parsed = parseImageData(text);
    setLastPastedUrl(parsed.src);
    props.onChange(parsed);
  };

  const onLoad = useEventCallback((img: HTMLImageElement) => {
    const dimensions = { width: img.width, height: img.height };
    onChange({ ...image, ...dimensions });
    setStatus('good');
  });
  const urlForAutoDimensions = lastPastedUrl === image.src ? lastPastedUrl : '';

  useEffect(() => {
    if (!urlForAutoDimensions) return;
    if (!isValidURL(urlForAutoDimensions)) {
      setStatus('');
      return;
    }
    setStatus('loading');
    const img = new Image();
    img.onload = () => onLoad(img);
    img.onerror = () => {
      setStatus('error');
    };
    img.src = urlForAutoDimensions;
    return () => {
      img.onload = null;
      img.onerror = null;
      setStatus('');
    };
  }, [urlForAutoDimensions, onLoad]);

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
          <HStack gap="regular" alignItems="end">
            <NumberField
              label="Width"
              width="scale.1600"
              formatOptions={{ maximumFractionDigits: 0 }}
              value={image.width}
              onChange={width => props.onChange({ ...image, width })}
            />
            <NumberField
              label="Height"
              width="scale.1600"
              formatOptions={{ maximumFractionDigits: 0 }}
              value={image.height}
              onChange={height => props.onChange({ ...image, height })}
            />
            <TooltipTrigger>
              <ActionButton
                aria-label={revertLabel}
                isDisabled={
                  dimensionsMatchOriginal ||
                  !dimensions.width ||
                  !dimensions.height
                }
                onPress={() => {
                  props.onChange({
                    ...image,
                    height: dimensions.height,
                    width: dimensions.width,
                  });
                }}
              >
                <Icon src={undo2Icon} />
              </ActionButton>
              <Tooltip>{revertLabel}</Tooltip>
            </TooltipTrigger>
          </HStack>
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
