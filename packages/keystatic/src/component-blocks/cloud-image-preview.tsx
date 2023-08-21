'use client';

import { useEffect, useState } from 'react';
import { NotEditable, ObjectField, PreviewProps } from '@keystatic/core';
import { TextArea, TextField } from '@keystar/ui/text-field';
import { ActionButton, Button, ButtonGroup } from '@keystar/ui/button';
import { VStack, Flex, Box } from '@keystar/ui/layout';
import { Heading, Text } from '@keystar/ui/typography';
import { Icon } from '@keystar/ui/icon';
import { externalLinkIcon } from '@keystar/ui/icon/icons/externalLinkIcon';
import { imageIcon } from '@keystar/ui/icon/icons/imageIcon';
import { trash2Icon } from '@keystar/ui/icon/icons/trash2Icon';
import { xIcon } from '@keystar/ui/icon/icons/xIcon';
// import { useConfig } from '../app/shell/context';

import { ClassList, css, tokenSchema } from '@keystar/ui/style';
import { Dialog, DialogTrigger } from '@keystar/ui/dialog';
import { Content, Header } from '@keystar/ui/slots';
import { ProgressCircle } from '@keystar/ui/progress';

const classList = new ClassList('ImageURLField');

type ImageData = {
  src: string;
  width: string;
  height: string;
  alt: string;
};

type ImageDimensions = Pick<ImageData, 'width' | 'height'>;

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

type ImageStatus = '' | 'loading' | 'good' | 'error';

function ImageDialog({
  onChange,
  onClose,
}: {
  onChange: (data: ImageData) => void;
  onClose: () => void;
}) {
  const [state, setState] = useState<ImageData>(cleanImageData());
  const [status, setStatus] = useState<ImageStatus>('');
  const [dimensions, setDimensions] = useState<ImageDimensions>(
    cleanImageData()
  );
  const imageLibraryURL = useImageLibraryURL();

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
        setState(cleanImageData(data));
        return;
      }
    } catch (err) {}
    const pattern = /^\s*!\[(.*)\]\(([a-z0-9_\-/:.]+)\)\s*$/;
    const match = text.match(pattern);
    if (match) {
      setState(
        cleanImageData({
          src: match[2],
          alt: match[1],
        })
      );
      return;
    }
    setState(cleanImageData({ src: text }));
  };

  const src = state.src;

  useEffect(() => {
    if (!src) {
      setStatus('');
      return;
    }
    if (!isValidURL(src)) {
      return;
    }
    setStatus('loading');
    const img = new Image();
    img.onload = () => {
      const dimensions = {
        width: img.width.toString(),
        height: img.height.toString(),
      };
      setState(state => ({
        ...state,
        ...dimensions,
      }));
      setDimensions(dimensions);
      setStatus('good');
    };
    img.onerror = () => {
      setStatus('error');
    };
    img.src = src;
    return () => {
      img.onload = null;
    };
  }, [src]);

  return (
    <Dialog>
      <Heading>
        <Flex alignItems="center" gap="regular">
          Insert Cloud Image
        </Flex>
      </Heading>
      <Header>
        <Button
          href={imageLibraryURL}
          target="_blank"
          rel="noreferrer"
          prominence="low"
          tone="accent"
        >
          <Text>Open Image Library</Text>
          <Icon src={externalLinkIcon} />
        </Button>
      </Header>
      <Content>
        <Flex
          elementType="form"
          id="example-form"
          onSubmit={e => {
            e.preventDefault();
            if (status !== 'good') return;
            onChange(state);
            close();
          }}
          direction="column"
          gap="large"
        >
          <TextField
            label="Image URL"
            autoFocus
            onPaste={onPaste}
            onKeyDown={e => {
              if (e.code === 'Backspace' || e.code === 'Delete') {
                setState(cleanImageData());
              }
            }}
            value={state.src}
            description="Copy an Image URL from the Image Library and paste in this field to insert it."
            UNSAFE_className={classList.declare('input')}
            endElement={
              status === 'loading' ? (
                <div
                  className={css({
                    width: tokenSchema.size.element.regular,
                    height: tokenSchema.size.element.regular,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  })}
                >
                  <ProgressCircle
                    size="small"
                    aria-label="Checking…"
                    isIndeterminate
                  />
                </div>
              ) : state.src ? (
                <ActionButton
                  prominence="low"
                  onPress={() => setState(cleanImageData())}
                >
                  <Icon src={xIcon} />
                </ActionButton>
              ) : null
            }
          />
          {status === 'good' ? (
            <>
              <TextArea
                label="Alt Text"
                value={state.alt}
                onChange={alt => setState(state => ({ ...state, alt }))}
              />
              <Flex gap="regular" alignItems="end">
                <TextField
                  label="Width"
                  value={state.width}
                  width="scale.1000"
                  onChange={width => setState(state => ({ ...state, width }))}
                />
                <TextField
                  label="Height"
                  value={state.height}
                  width="scale.1000"
                  onChange={height => setState(state => ({ ...state, height }))}
                />
                {dimensions &&
                (`${dimensions.width}` !== state.width ||
                  `${dimensions.height}` !== state.height) ? (
                  <div>
                    <ActionButton
                      isDisabled={dimensions === null}
                      alignSelf="start"
                      onPress={() => {
                        setState(state => ({
                          ...state,
                          height: dimensions.height,
                          width: dimensions.width,
                        }));
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
            </>
          ) : null}
        </Flex>
      </Content>
      <ButtonGroup>
        <Button onPress={onClose}>Cancel</Button>
        <Button
          prominence="high"
          type="submit"
          form="example-form"
          isDisabled={status !== 'good'}
        >
          Insert
        </Button>
      </ButtonGroup>
    </Dialog>
  );
}

function Placeholder({
  onChange,
  onRemove,
}: {
  onChange: (data: ImageData) => void;
  onRemove: () => void;
}) {
  return (
    <NotEditable>
      <Flex gap="regular">
        <Box flex="1">
          <DialogTrigger>
            <Button
              prominence="low"
              width="100%"
              UNSAFE_className={css({
                backgroundColor: tokenSchema.color.background.surface,
                color: tokenSchema.color.foreground.neutralSecondary,
                justifyContent: 'start',

                ':hover': {
                  backgroundColor:
                    tokenSchema.color.background.surfaceSecondary,
                  color: tokenSchema.color.foreground.neutral,
                },
              })}
            >
              <Flex gap="regular" alignItems="center">
                <Icon src={imageIcon} size="medium" />
                <div>Click to add Cloud Image...</div>
              </Flex>
            </Button>
            {close => <ImageDialog onChange={onChange} onClose={close} />}
          </DialogTrigger>
        </Box>
        <Button prominence="low" tone="critical" onPress={onRemove}>
          <Icon src={trash2Icon} />
        </Button>
      </Flex>
    </NotEditable>
  );
}

function ImagePreview({
  image,
  onRemove,
}: {
  image: ImageData;
  onRemove: () => void;
}) {
  return (
    <NotEditable>
      <VStack
        backgroundColor="surface"
        borderRadius="medium"
        border="neutral"
        overflow="hidden"
      >
        <Flex justifyContent="center">
          <img
            alt={image.alt}
            src={image.src}
            className={css({
              maxWidth: image.width,
              maxHeight: image.height,
            })}
          />
        </Flex>
        <Flex padding="large" gap="medium" borderTop="neutral">
          <VStack flex="1" gap="large" justifyContent="center">
            <Box>
              <Text
                size="small"
                weight="bold"
                UNSAFE_className={css({
                  fontFamily: tokenSchema.typography.fontFamily.code,
                })}
              >
                W {image.width} x H {image.height}
              </Text>
            </Box>
            <Box>
              {image.alt ? (
                <Text>{image.alt}</Text>
              ) : (
                <Text
                  size="small"
                  UNSAFE_className={css({
                    fontFamily: tokenSchema.typography.fontFamily.code,
                  })}
                >
                  {image.src}
                </Text>
              )}
            </Box>
          </VStack>
          <ActionButton>Edit</ActionButton>
          <ActionButton onPress={onRemove}>
            <Icon src={trash2Icon} />
          </ActionButton>
        </Flex>
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
    return <Placeholder onChange={props.onChange} onRemove={props.onRemove} />;
  }

  return (
    <ImagePreview
      image={{
        src: props.fields.src.value,
        alt: props.fields.alt.value,
        width: props.fields.width.value,
        height: props.fields.height.value,
      }}
      onRemove={props.onRemove}
    />
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

function useImageLibraryURL() {
  // const config = useConfig();
  const [team, project] =
    /* config.storage.project */ 'thinkmill-labs/keystatic-site'.split('/');
  return `https://keystatic.cloud/teams/${team}/project/${project}/images`;
}
