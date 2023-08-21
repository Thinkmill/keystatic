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

type InsertStatus = '' | 'loading' | 'good' | 'error';

function InsertImageDialog({
  onChange,
  onClose,
}: {
  onChange: (data: ImageData) => void;
  onClose: () => void;
}) {
  const [state, setState] = useState<ImageData>(cleanImageData());
  const [status, setStatus] = useState<InsertStatus>('');
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
      setState(state => ({
        ...state,
        width: img.width.toString(),
        height: img.height.toString(),
      }));
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
          <Box marginBottom="medium">
            <Text>
              Copy an Image URL from the Image Library and paste in the field
              below to insert.
            </Text>
          </Box>
          <TextField
            label="Image URL"
            autoFocus
            onPaste={onPaste}
            value={state.src}
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
              <TextArea label="Alt Text" value={state.alt} />
              <Flex gap="regular">
                <TextField
                  label="Width"
                  value={state.width}
                  width="scale.1000"
                />
                <TextField
                  label="Height"
                  value={state.height}
                  width="scale.1000"
                />
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
            {close => <InsertImageDialog onChange={onChange} onClose={close} />}
          </DialogTrigger>
        </Box>
        <Button prominence="low" tone="critical" onPress={onRemove}>
          <Icon src={trash2Icon} />
        </Button>
      </Flex>
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

function useImageLibraryURL() {
  // const config = useConfig();
  const [team, project] =
    /* config.storage.project */ 'thinkmill-labs/keystatic-site'.split('/');
  return `https://keystatic.cloud/teams/${team}/project/${project}/images`;
}
