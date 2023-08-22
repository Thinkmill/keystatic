'use client';

import { useEffect, useState } from 'react';
import { useSelected, useSlateStatic } from 'slate-react';
import { useOverlayTriggerState } from '@react-stately/overlays';

import {
  ActionButton,
  Button,
  ButtonGroup,
  ClearButton,
} from '@keystar/ui/button';
import { NotEditable, ObjectField, PreviewProps } from '@keystatic/core';
import { Dialog, DialogContainer, DialogTrigger } from '@keystar/ui/dialog';
import { Icon } from '@keystar/ui/icon';
import { imageIcon } from '@keystar/ui/icon/icons/imageIcon';
import { pencilIcon } from '@keystar/ui/icon/icons/pencilIcon';
import { trash2Icon } from '@keystar/ui/icon/icons/trash2Icon';
import { VStack, Flex, Box } from '@keystar/ui/layout';
import { TextLink } from '@keystar/ui/link';
import { ProgressCircle } from '@keystar/ui/progress';
import { Content } from '@keystar/ui/slots';
import { css, tokenSchema } from '@keystar/ui/style';
import { TextArea, TextField } from '@keystar/ui/text-field';
import { Tooltip, TooltipTrigger } from '@keystar/ui/tooltip';
import { Heading, Text } from '@keystar/ui/typography';

import { useConfig } from '../app/shell/context';
import { focusWithPreviousSelection } from '../form/fields/document/DocumentEditor/ui-utils';

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

function ImageDialog(props: {
  image?: ImageData;
  onCancel: () => void;
  onChange: (data: ImageData) => void;
  onClose: () => void;
}) {
  const { image, onCancel, onChange, onClose } = props;
  const [state, setState] = useState<ImageData>(cleanImageData(image));
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
      <Heading>Cloud image</Heading>
      <Content>
        <Flex
          elementType="form"
          id="example-form"
          onSubmit={e => {
            e.preventDefault();
            if (status !== 'good') return;
            onChange(state);
            onClose();
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
              } else {
                e.continuePropagation();
              }
            }}
            value={state.src}
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
              ) : state.src ? (
                <ClearButton
                  onPress={() => setState(cleanImageData())}
                  preventFocus
                />
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
        <Button onPress={onCancel}>Cancel</Button>
        <Button
          prominence="high"
          type="submit"
          form="example-form"
          isDisabled={status !== 'good'}
        >
          {image ? 'Done' : 'Insert'}
        </Button>
      </ButtonGroup>
    </Dialog>
  );
}

function Placeholder(props: {
  onChange: (data: ImageData) => void;
  onRemove: () => void;
}) {
  const editor = useSlateStatic();
  const selected = useSelected();
  const state = useOverlayTriggerState({ defaultOpen: false });

  useEffect(() => {
    if (selected) {
      state.open();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  const closeAndCleanup = () => {
    state.close();
    focusWithPreviousSelection(editor);
    editor.deleteBackward('block');
  };

  return (
    <NotEditable>
      <div
        data-selected={selected}
        className={css({
          alignItems: 'center',
          backgroundColor: tokenSchema.color.alias.backgroundIdle,
          borderRadius: tokenSchema.size.radius.regular,
          color: tokenSchema.color.alias.foregroundIdle,
          display: 'flex',
          gap: tokenSchema.size.space.regular,
          height: tokenSchema.size.element.large,
          justifyContent: 'start',
          paddingInline: tokenSchema.size.space.large,
        })}
      >
        <Icon src={imageIcon} />
        <Text>Awaiting configuration from Cloud images…</Text>
      </div>
      <DialogContainer onDismiss={closeAndCleanup}>
        {state.isOpen && (
          <ImageDialog
            onChange={props.onChange}
            onCancel={closeAndCleanup}
            onClose={state.close}
          />
        )}
      </DialogContainer>
    </NotEditable>
  );
}

function ImagePreview({
  image,
  onChange,
  onRemove,
}: {
  image: ImageData;
  onChange: (data: ImageData) => void;
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
          <DialogTrigger>
            <ActionButton>
              <Icon src={pencilIcon} />
            </ActionButton>
            {onClose => (
              <ImageDialog
                image={image}
                onChange={onChange}
                onCancel={onClose}
                onClose={onClose}
              />
            )}
          </DialogTrigger>
          <TooltipTrigger>
            <ActionButton onPress={onRemove}>
              <Icon src={trash2Icon} />
            </ActionButton>
            <Tooltip>Remove Image</Tooltip>
          </TooltipTrigger>
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
      onChange={props.onChange}
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

function getDimension(value: unknown) {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return value.toString();
  return '';
}

function useImageLibraryURL() {
  const config = useConfig();
  if (config.storage.kind !== 'cloud') return 'https://keystatic.cloud/';
  const [team, project] = config.storage.project;
  return `https://keystatic.cloud/teams/${team}/project/${project}/images`;
}
