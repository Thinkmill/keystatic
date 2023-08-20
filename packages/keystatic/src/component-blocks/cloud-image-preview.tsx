'use client';

import { useEffect, useState } from 'react';
import { NotEditable, ObjectField, PreviewProps } from '@keystatic/core';
import { TextField } from '@keystar/ui/text-field';
import { ActionButton } from '@keystar/ui/button';
import { VStack, Flex } from '@keystar/ui/layout';
import { Text } from '@keystar/ui/typography';
import { Icon } from '@keystar/ui/icon';
import { externalLinkIcon } from '@keystar/ui/icon/icons/externalLinkIcon';
import { useConfig } from '../app/shell/context';

import { detect } from 'detect-browser';

const browser = detect();
const metaSymbol = browser?.os === 'Mac OS' ? '⌘' : 'Ctrl';
const isMobile = browser?.os === 'iOS' || browser?.os === 'Android OS';

type ImageData = {
  src: string;
  width: string;
  height: string;
  alt: string;
};

function cleanImageData(
  data: {
    src: string;
    width?: string | number;
    height?: string | number;
    alt?: string | number;
  } = { src: '' }
): ImageData {
  return {
    src: data.src,
    alt: 'alt' in data && typeof data.alt === 'string' ? data.alt : '',
    height: 'height' in data ? getDimension(data.height) : '',
    width: 'width' in data ? getDimension(data.width) : '',
  };
}

function Placeholder({ onChange }: { onChange: (data: ImageData) => void }) {
  const [isFocused, setIsFocused] = useState(false);
  const [pastedData, setPastedData] = useState<ImageData>(cleanImageData());
  const [status, setStatus] = useState('');

  const config = useConfig();

  const onPaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const text = event.clipboardData.getData('text/plain');
    try {
      const data: any = JSON.parse(text);
      if (
        typeof data === 'object' &&
        data !== null &&
        'src' in data &&
        typeof data.src === 'string'
      ) {
        setPastedData(cleanImageData(data));
        return;
      }
    } catch (err) {}
    const pattern = /^\s*!\[(.*)\]\(([a-z0-9_\-/:.]+)\)\s*$/;
    const match = text.match(pattern);
    if (match) {
      setPastedData(
        cleanImageData({
          src: match[2],
          alt: match[1],
        })
      );
      return;
    }
    setPastedData(cleanImageData({ src: text }));
  };

  useEffect(() => {
    if (!pastedData || !pastedData.src) {
      setStatus('');
      return;
    }
    if (!isValidURL(pastedData.src)) {
      setStatus('The pasted data is not a valid Image URL');
      return;
    }
    const img = new Image();
    setStatus('Checking pasted data...');
    img.onload = () => {
      onChange({
        ...pastedData,
        width: img.width.toString(),
        height: img.height.toString(),
      });
    };
    img.onerror = () => {
      setStatus('The pasted data is not a valid Image URL');
      console.log('Invalid Image URL pasted:', pastedData);
    };
    img.src = pastedData.src;
    return () => {
      img.onload = null;
    };
  }, [pastedData, onChange]);

  return (
    <NotEditable>
      <VStack gap="regular">
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            value=""
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onClick={() => {
              document.execCommand('paste');
            }}
            onPaste={onPaste}
            style={{
              position: 'absolute',
              cursor: 'default',
              fontSize: '16px',
              border: 'none',
              outline: isFocused ? '2px solid #30a46c' : 'none',
              background: 'transparent',
              padding: 0,
              paddingLeft: '2%',
              margin: 0,
              opacity: 0,
              color: 'transparent',
              borderRadius: '6px',
              width: '98%',
              height: '100%',
            }}
          />
          {isFocused ? (
            <Flex
              backgroundColor="positive"
              border="positive"
              color="positive"
              justifyContent="center"
              borderRadius="regular"
              padding="regular"
            >
              {isMobile ? 'Tap' : `Press ${metaSymbol} + V`} to paste an Image
              URL
            </Flex>
          ) : (
            <Flex
              border="neutral"
              color="neutral"
              justifyContent="center"
              borderRadius="regular"
              padding="regular"
            >
              {isMobile ? 'Tap' : 'Click'} here to paste an Image URL
            </Flex>
          )}
        </div>
        {config.storage.kind === 'cloud' && (
          <div>
            <ActionButton
              href={getProjectImagesURL(config.storage.project)}
              target="_blank"
              rel="noreferrer noopener"
            >
              <Text>Open Cloud Images</Text>
              <Icon src={externalLinkIcon} />
            </ActionButton>
          </div>
        )}
        <Flex justifyContent="center">{status}</Flex>
      </VStack>
    </NotEditable>
  );
}

export function CloudImagePreview(
  props: PreviewProps<
    ObjectField<typeof import('./cloud-image-schema').cloudImageSchema>
  > & {
    onRemove(): void;
  }
) {
  const src = props.fields.src.value;
  const alt = props.fields.alt.value;

  const dimensions = useImageDimensions(src);

  if (!props.fields.src.value) {
    return <Placeholder onChange={props.onChange} />;
  }

  const clear = () => {
    props.onChange(cleanImageData());
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
            flex="1"
          />
          <div>
            <ActionButton onPress={clear}>Change</ActionButton>
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

function getDimension(value: unknown) {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return value.toString();
  return '';
}

function getProjectImagesURL(projectConfig: string) {
  const [team, project] = projectConfig.split('/');
  return `https://keystatic.cloud/teams/${team}/project/${project}/images`;
}
