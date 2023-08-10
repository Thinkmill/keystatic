'use client';

import { useEffect, useState } from 'react';
import { getDefaultSrcSet } from '../../utils';
import { CONTENT_MAX_WIDTH_DESKTOP } from '../../constants';
import { NotEditable, ObjectField, PreviewProps } from '@keystatic/core';
import { TextField } from '@keystar/ui/text-field';
import { ActionButton } from '@keystar/ui/button';
import { VStack } from '@keystar/ui/layout';

export function CloudImage2Preview(
  props: PreviewProps<
    ObjectField<typeof import('../../../keystatic.config').cloudImage2Schema>
  >
) {
  const src = props.fields.src.value;
  const alt = props.fields.alt.value;

  const dimensions = useImageDimensions(src);

  return (
    <NotEditable>
      <VStack gap="regular">
        <TextField
          label="Image URL"
          value={props.fields.src.value}
          onChange={props.fields.src.onChange}
        />
        <TextField
          label="Alt text"
          value={props.fields.src.value}
          onChange={props.fields.src.onChange}
        />
        <TextField
          label="Width"
          value={props.fields.width.value}
          onChange={props.fields.width.onChange}
        />
        <TextField
          label="Height"
          value={props.fields.height.value}
          onChange={props.fields.height.onChange}
        />
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
          Use Suggested Dimensions{' '}
          {dimensions ? `(${dimensions.width}x${dimensions.height})` : null}
        </ActionButton>

        <img
          alt={alt}
          src={isValidURL(src) ? src : ''}
          srcSet={getDefaultSrcSet({ src })}
          sizes={`${parseInt(CONTENT_MAX_WIDTH_DESKTOP) * 16}px`}
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
