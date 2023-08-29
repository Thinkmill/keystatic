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
import { undo2Icon } from '@keystar/ui/icon/icons/undo2Icon';
import { Flex, HStack, VStack } from '@keystar/ui/layout';
import { TextLink } from '@keystar/ui/link';
import { NumberField } from '@keystar/ui/number-field';
import { ProgressCircle } from '@keystar/ui/progress';
import { Content } from '@keystar/ui/slots';
import { TextArea, TextField } from '@keystar/ui/text-field';
import { Tooltip, TooltipTrigger } from '@keystar/ui/tooltip';
import { Heading, Text } from '@keystar/ui/typography';
import { useId } from '@keystar/ui/utils';

import { useConfig } from '../app/shell/context';
import { focusWithPreviousSelection } from '../form/fields/document/DocumentEditor/ui-utils';
import { getSplitCloudProject, isCloudConfig } from '../app/utils';

export type CloudImageProps = {
  src: string;
  width?: number;
  height?: number;
  alt: string;
};

type ImageDimensions = Pick<CloudImageProps, 'width' | 'height'>;

export function parseImageData(data: string): CloudImageProps {
  try {
    const parsed: unknown = JSON.parse(data);
    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      'src' in parsed &&
      typeof parsed.src === 'string'
    ) {
      return {
        src: parsed.src,
        alt:
          'alt' in parsed && typeof parsed.alt === 'string' ? parsed.alt : '',
        height:
          'height' in parsed &&
          typeof parsed.height === 'number' &&
          Number.isInteger(parsed.height)
            ? parsed.height
            : undefined,
        width:
          'width' in parsed &&
          typeof parsed.width === 'number' &&
          Number.isInteger(parsed.width)
            ? parsed.width
            : undefined,
      };
    }
  } catch (err) {}
  const pattern = /^\s*!\[(.*)\]\(([a-z0-9_\-/:.]+)\)\s*$/;
  const match = data.match(pattern);
  if (match) {
    return { src: match[2], alt: match[1] };
  }
  return { src: data, alt: '' };
}

export const emptyImageData: CloudImageProps = { src: '', alt: '' };

type ImageStatus = '' | 'loading' | 'good' | 'error';

function ImageDialog(props: {
  image?: CloudImageProps;
  onCancel: () => void;
  onChange: (data: CloudImageProps) => void;
  onClose: () => void;
}) {
  const { image, onCancel, onChange, onClose } = props;
  const [state, setState] = useState<CloudImageProps>(image ?? emptyImageData);
  const [status, setStatus] = useState<ImageStatus>(image ? 'good' : '');
  const [dimensions, setDimensions] = useState<ImageDimensions>(emptyImageData);
  const formId = useId();
  const imageLibraryURL = useImageLibraryURL();

  const revertLabel = `Revert to original (${dimensions.width} × ${dimensions.height})`;
  const dimensionsMatchOriginal =
    dimensions.width === state.width && dimensions.height === state.height;

  const onPaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const text = event.clipboardData.getData('text/plain');
    setState(parseImageData(text));
  };

  useEffect(() => {
    if (!state.src) {
      setStatus('');
      return;
    }
    if (!isValidURL(state.src)) {
      return;
    }
    setStatus('loading');
    const img = new Image();
    img.onload = () => {
      const dimensions = { width: img.width, height: img.height };
      setState(state => ({ ...state, ...dimensions }));
      setDimensions(dimensions);
      setStatus('good');
    };
    img.onerror = () => {
      setStatus('error');
    };
    img.src = state.src;
    return () => {
      img.onload = null;
    };
  }, [state.src]);

  return (
    <Dialog>
      <Heading>Cloud image</Heading>
      <Content>
        <VStack
          elementType="form"
          id={formId}
          gap="xlarge"
          onSubmit={e => {
            e.preventDefault();
            if (status !== 'good') return;
            onChange(state);
            onClose();
          }}
        >
          <TextField
            label="Image URL"
            autoFocus
            onPaste={onPaste}
            onKeyDown={e => {
              if (e.code === 'Backspace' || e.code === 'Delete') {
                setState(emptyImageData);
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
                  onPress={() => setState(emptyImageData)}
                  preventFocus
                />
              ) : null
            }
          />
          {status === 'good' ? (
            <>
              <TextArea
                label="Alt text"
                value={state.alt}
                onChange={alt => setState(state => ({ ...state, alt }))}
              />
              <HStack gap="regular" alignItems="end">
                <NumberField
                  label="Width"
                  width="scale.1600"
                  formatOptions={{ maximumFractionDigits: 0 }}
                  value={state.width}
                  onChange={width => setState(state => ({ ...state, width }))}
                />
                <NumberField
                  label="Height"
                  width="scale.1600"
                  formatOptions={{ maximumFractionDigits: 0 }}
                  value={state.height}
                  onChange={height => setState(state => ({ ...state, height }))}
                />
                <TooltipTrigger>
                  <ActionButton
                    aria-label={revertLabel}
                    isDisabled={dimensionsMatchOriginal}
                    onPress={() => {
                      setState(state => ({
                        ...state,
                        height: dimensions.height,
                        width: dimensions.width,
                      }));
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
      </Content>
      <ButtonGroup>
        <Button onPress={onCancel}>Cancel</Button>
        <Button
          prominence="high"
          type="submit"
          form={formId}
          isDisabled={status !== 'good'}
        >
          {image ? 'Done' : 'Insert'}
        </Button>
      </ButtonGroup>
    </Dialog>
  );
}

function Placeholder(props: {
  onChange: (data: CloudImageProps) => void;
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
    props.onRemove();
  };

  return (
    <NotEditable>
      <Flex
        alignItems="center"
        backgroundColor="surface"
        borderRadius="regular"
        gap="regular"
        height="element.large"
        paddingX="large"
        onClick={() => state.open()}
      >
        <Icon src={imageIcon} />
        <Text>Cloud image{state.isOpen ? '' : '(click to configure)'}</Text>
      </Flex>
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
  image: CloudImageProps;
  onChange: (data: CloudImageProps) => void;
  onRemove: () => void;
}) {
  const selected = useSelected();
  const maxHeight = 368; // size.scale.4600 — TODO: it'd be nice to get this from some token artefact
  const maxWidth = 734; // roughly the max width that an editor container will allow

  return (
    <>
      <NotEditable>
        <VStack
          backgroundColor={selected ? 'accent' : 'surface'}
          borderRadius="medium"
          border={selected ? 'color.alias.borderFocused' : 'neutral'}
          overflow="hidden"
        >
          <Flex
            backgroundColor="canvas"
            justifyContent="center"
            UNSAFE_style={{ maxHeight }}
          >
            <img
              alt={image.alt}
              src={imageWithTransforms({
                source: image.src,
                // 2x for retina etc.
                height: maxHeight * 2,
                width: maxWidth * 2,
              })}
              style={{ objectFit: 'contain' }}
            />
          </Flex>
          <HStack
            padding="large"
            gap="xlarge"
            borderTop={selected ? 'color.alias.borderFocused' : 'neutral'}
          >
            <VStack flex="1" gap="medium" justifyContent="center">
              {image.alt ? <Text truncate={2}>{image.alt}</Text> : null}
              <Text color="neutralTertiary" size="small">
                {image.width} × {image.height}
              </Text>
            </VStack>
            <HStack gap="regular">
              <DialogTrigger>
                <TooltipTrigger>
                  <ActionButton>
                    <Icon src={pencilIcon} />
                  </ActionButton>
                  <Tooltip>Edit Image Options</Tooltip>
                </TooltipTrigger>
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
            </HStack>
          </HStack>
        </VStack>
      </NotEditable>
    </>
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
        width: props.fields.width.value ?? undefined,
        height: props.fields.height.value ?? undefined,
      }}
      onChange={props.onChange}
      onRemove={props.onRemove}
    />
  );
}

// Utils
// -----------------------------------------------------------------------------

type TransformFit = 'contain' | 'cover' | 'crop' | 'scale-down';

function imageWithTransforms(options: {
  fit?: TransformFit;
  source: string;
  height: number;
  width: number;
}) {
  let { fit = 'scale-down', source, height, width } = options;

  if (!/^https?:\/\/[^\.]+\.keystatic\.net/.test(source)) {
    return source;
  }

  return (
    `${source}?` +
    new URLSearchParams({
      fit,
      height: height.toString(),
      width: width.toString(),
    }).toString()
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

export function useImageLibraryURL() {
  const config = useConfig();
  if (!isCloudConfig(config)) return 'https://keystatic.cloud/';
  const { project, team } = getSplitCloudProject(config);
  return `https://keystatic.cloud/teams/${team}/project/${project}/images`;
}
