'use client';

import { useEffect, useState } from 'react';
import { getDefaultSrcSet } from '../../utils';
import { CONTENT_MAX_WIDTH_DESKTOP } from '../../constants';
import { NotEditable, ObjectField, PreviewProps } from '@keystatic/core';
import { TextField } from '@keystar/ui/text-field';
import { ActionButton } from '@keystar/ui/button';
import { VStack, Flex } from '@keystar/ui/layout';
import { Text } from '@keystar/ui/typography';
import { Icon } from '@keystar/ui/icon';
import { externalLinkIcon } from '@keystar/ui/icon/icons/externalLinkIcon';

export function CloudImage2Preview(
  props: PreviewProps<
    ObjectField<typeof import('../../../keystatic.config').cloudImage2Schema>
  > & { onRemove(): void }
) {
  const src = props.fields.src.value;
  const alt = props.fields.alt.value;

  const dimensions = useImageDimensions(src);

  useEffect(() => {
    if (
      dimensions &&
      props.fields.width.value === '' &&
      props.fields.height.value === ''
    ) {
      props.onChange({
        height: dimensions.height.toString(),
        width: dimensions.width.toString(),
      });
    }
  });

  const onBrowse = () => {
    window.open('https://keystatic.cloud/', '_blank');
  };

  const onPaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    const text = event.clipboardData.getData('text/plain');
    try {
      const data = JSON.parse(text);
      if (typeof data === 'object' && typeof data.src === 'string') {
        event.preventDefault();
        props.onChange({
          src: data.src,
          alt: typeof data.alt === 'string' ? data.alt || '' : '',
          height: ['string', 'number'].includes(typeof data.height)
            ? `${data.height}` || ''
            : '',
          width: ['string', 'number'].includes(typeof data.width)
            ? `${data.width}` || ''
            : '',
        });
        return;
      }
    } catch (err) {}
    const pattern = /^\s*!\[(.*)\]\(([a-z0-9_\-/:.]+)\)\s*$/;
    const match = text.match(pattern);
    if (match) {
      event.preventDefault();
      props.onChange({
        src: match[2],
        alt: match[1],
        height: '',
        width: '',
      });
      return;
    }
  };

  return (
    <NotEditable>
      <VStack
        gap="medium"
        border="neutral"
        padding="medium"
        borderRadius="regular"
      >
        <Flex gap="regular" alignItems="end">
          <TextField
            label="Cloud Image"
            value={props.fields.src.value}
            onChange={props.fields.src.onChange}
            onPaste={onPaste}
            flex="1"
          />
          <div>
            <ActionButton onPress={onBrowse}>
              <Text>Browse</Text>
              <Icon src={externalLinkIcon} />
            </ActionButton>
          </div>
          <div>
            <ActionButton onPress={props.onRemove}>Remove</ActionButton>
          </div>
        </Flex>
        <img alt={alt} src={isValidURL(src) ? src : ''} />
        <Flex gap="regular" alignItems="end">
          <TextField
            label="Width"
            value={props.fields.width.value}
            onChange={props.fields.width.onChange}
            width="scale.1200"
          />
          <TextField
            label="Height"
            value={props.fields.height.value}
            onChange={props.fields.height.onChange}
            width="scale.1200"
          />
          {dimensions &&
          (`${dimensions.width}` !== props.fields.width.value ||
            `${dimensions.height}` !== props.fields.height.value) ? (
            <div>
              <ActionButton
                isDisabled={dimensions === null}
                alignSelf="start"
                onPress={() => {
                  if (dimensions) {
                    props.onChange({
                      height: dimensions.height.toString(),
                      width: dimensions.width.toString(),
                    });
                  }
                }}
              >
                Set to{' '}
                {dimensions
                  ? `${dimensions.width} x ${dimensions.height}`
                  : null}
              </ActionButton>
            </div>
          ) : null}
        </Flex>
        <TextField
          label="Alt text"
          value={props.fields.alt.value}
          onChange={props.fields.alt.onChange}
        />
      </VStack>
    </NotEditable>
  );
}

function isValidURL(str: string) {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

function useImageDimensions(src: string) {
  const [dimensions, setDimensions] = useState<null | {
    width: number;
    height: number;
  }>(null);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setDimensions({ width: img.width, height: img.height });
    };
    img.src = src;
    return () => {
      img.onload = null;
      setDimensions(null);
    };
  }, [src]);

  return dimensions;
}
