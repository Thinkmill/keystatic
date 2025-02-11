import { useOverlayTriggerState } from '@react-stately/overlays';
import { ClipboardEvent, useEffect, useState } from 'react';
import { useSelected, useSlateStatic } from 'slate-react';
import * as s from 'superstruct';

import {
  ActionButton,
  Button,
  ButtonGroup,
  ClearButton,
  ToggleButton,
} from '@keystar/ui/button';
import { Dialog, DialogContainer, DialogTrigger } from '@keystar/ui/dialog';
import { FileTrigger } from '@keystar/ui/drag-and-drop';
import { Icon } from '@keystar/ui/icon';
import { imageIcon } from '@keystar/ui/icon/icons/imageIcon';
import { link2Icon } from '@keystar/ui/icon/icons/link2Icon';
import { link2OffIcon } from '@keystar/ui/icon/icons/link2OffIcon';
import { pencilIcon } from '@keystar/ui/icon/icons/pencilIcon';
import { trash2Icon } from '@keystar/ui/icon/icons/trash2Icon';
import { undo2Icon } from '@keystar/ui/icon/icons/undo2Icon';
import { Flex, HStack, VStack } from '@keystar/ui/layout';
import { TextLink } from '@keystar/ui/link';
import { NumberField } from '@keystar/ui/number-field';
import { ProgressCircle } from '@keystar/ui/progress';
import { Content } from '@keystar/ui/slots';
import { TextArea, TextField } from '@keystar/ui/text-field';
import { toastQueue } from '@keystar/ui/toast';
import { Tooltip, TooltipTrigger } from '@keystar/ui/tooltip';
import { Heading, Text } from '@keystar/ui/typography';
import { useId } from '@keystar/ui/utils';

import { useConfig } from '../app/shell/context';
import { focusWithPreviousSelection } from '../form/fields/document/DocumentEditor/ui-utils';
import {
  KEYSTATIC_CLOUD_API_URL,
  KEYSTATIC_CLOUD_HEADERS,
  getSplitCloudProject,
} from '../app/utils';
import { NotEditable } from '../form/fields/document/DocumentEditor/primitives';
import {
  PreviewProps,
  ObjectField,
  Config,
  ParsedValueForComponentSchema,
} from '..';
import { getCloudAuth } from '../app/auth';
import { BaseStyleProps } from '@keystar/ui/style';

export type CloudImageProps = {
  src: string;
  width?: number;
  height?: number;
  alt: string;
};

function slugify(input: string) {
  let slug = input.toLowerCase().trim();

  // remove accents from charaters
  slug = slug.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  // replace invalid chars with spaces
  slug = slug.replace(/[^a-z0-9\s-]/g, ' ').trim();
  // replace multiple spaces or hyphens with a single hyphen
  slug = slug.replace(/[\s-]+/g, '-');

  return slug;
}

const imageUploadResponse = s.type({
  src: s.string(),
  width: s.number(),
  height: s.number(),
});

function uploadImage(file: File, config: Config) {
  if (file.size > 10_000_000) {
    throw new Error('Images must be smaller than 10MB');
  }
  const auth = getCloudAuth(config);
  if (!auth) {
    throw new Error('You must be signed in to upload images');
  }
  const filenameMatch = /(.+)\.(png|jpe?g|gif|webp)$/.exec(file.name);
  if (!filenameMatch) {
    throw new Error(
      'Invalid image type, only PNG, JPEG, GIF, and WebP are supported'
    );
  }
  const filename = slugify(filenameMatch[1]);
  const ext = filenameMatch[2];
  const filenameWithExt = `${filename}.${ext}`;

  const newFile = new File([file], filenameWithExt, {
    type: `image/${filenameWithExt === 'jpg' ? 'jpeg' : filenameWithExt}`,
  });

  const formData = new FormData();
  formData.set('image', newFile, filenameWithExt);
  return (async () => {
    const res = await fetch(`${KEYSTATIC_CLOUD_API_URL}/v1/image`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${auth.accessToken}`,
        ...KEYSTATIC_CLOUD_HEADERS,
      },
      body: formData,
    });
    if (!res.ok) {
      throw new Error(`Failed to upload image: ${await res.text()}`);
    }
    const data = await res.json();

    let parsedData;
    try {
      parsedData = imageUploadResponse.create(data);
    } catch {
      throw new Error('Unexpected response from cloud');
    }
    return parsedData;
  })();
}

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

function useImageDimensions(src: string) {
  const [dimensions, setDimensions] = useState<ImageDimensions>({});
  useEffect(() => {
    if (!src || !isValidURL(src)) {
      setDimensions({});
      return;
    }
    let shouldSet = true;
    loadImageDimensions(src).then(dimensions => {
      if (shouldSet) setDimensions(dimensions);
    });
    return () => {
      shouldSet = false;
    };
  }, [src]);
  return dimensions;
}

function loadImageDimensions(url: string) {
  return new Promise<ImageDimensions>((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = () => {
      reject();
    };
    img.src = url;
  });
}

const imageDataSchema = s.type({
  src: s.string(),
  alt: s.string(),
  width: s.number(),
  height: s.number(),
});

export async function loadImageData(
  url: string,
  config: Config
): Promise<CloudImageProps> {
  const auth = getCloudAuth(config);
  if (auth) {
    const res = await fetch(
      `${KEYSTATIC_CLOUD_API_URL}/v1/image?${new URLSearchParams({ url })}`,
      {
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
          ...KEYSTATIC_CLOUD_HEADERS,
        },
      }
    );
    if (res.ok) {
      const data = await res.json();
      try {
        return imageDataSchema.create(data);
      } catch {}
    }
  }
  return loadImageDimensions(url).then(dimensions => ({
    src: url,
    alt: '',
    ...dimensions,
  }));
}

export function ImageDimensionsInput(props: {
  src: string;
  image: ImageDimensions;
  onChange: (image: ImageDimensions) => void;
}) {
  const dimensions = useImageDimensions(props.src);

  const [constrainProportions, setConstrainProportions] = useState(true);
  const revertLabel = `Revert to original (${dimensions.width} × ${dimensions.height})`;
  const dimensionsMatchOriginal =
    dimensions.width === props.image.width &&
    dimensions.height === props.image.height;

  return (
    <HStack gap="regular" alignItems="end">
      <NumberField
        label="Width"
        width="scale.1600"
        formatOptions={{ maximumFractionDigits: 0 }}
        value={props.image.width}
        onChange={width => {
          if (constrainProportions) {
            props.onChange({
              width,
              height: Math.round(width / getAspectRatio(props.image)),
            });
          } else {
            props.onChange({ width });
          }
        }}
      />
      <TooltipTrigger>
        <ToggleButton
          isSelected={constrainProportions}
          aria-label="Constrain proportions"
          prominence="low"
          onPress={() => {
            setConstrainProportions(state => !state);
          }}
        >
          <Icon src={constrainProportions ? link2Icon : link2OffIcon} />
        </ToggleButton>
        <Tooltip>Constrain proportions</Tooltip>
      </TooltipTrigger>
      <NumberField
        label="Height"
        width="scale.1600"
        formatOptions={{ maximumFractionDigits: 0 }}
        value={props.image.height}
        onChange={height => {
          if (constrainProportions) {
            props.onChange({
              height,
              width: Math.round(height * getAspectRatio(props.image)),
            });
          } else {
            props.onChange({ height });
          }
        }}
      />
      <TooltipTrigger>
        <ActionButton
          aria-label={revertLabel}
          isDisabled={
            dimensionsMatchOriginal || !dimensions.width || !dimensions.height
          }
          onPress={() => {
            props.onChange({
              height: dimensions.height,
              width: dimensions.width,
            });
          }}
        >
          <Icon src={undo2Icon} />
        </ActionButton>
        <Tooltip maxWidth="100%">{revertLabel}</Tooltip>
      </TooltipTrigger>
    </HStack>
  );
}

export type ImageStatus = '' | 'loading' | 'good' | 'error';
export const emptyImageData: CloudImageProps = { src: '', alt: '' };

const ALLOWED_IMAGE_EXTENSIONS = ['jpeg', 'jpg', 'png', 'gif', 'webp'];
const ACCEPTED_TYPES = ALLOWED_IMAGE_EXTENSIONS.map(ext => `image/${ext}`);

export function UploadImageButton(
  props: BaseStyleProps & {
    onUploaded: (data: CloudImageProps) => void;
  }
) {
  const { onUploaded, ...styleProps } = props;
  const config = useConfig();
  const [isUploading, setIsUploading] = useState(false);
  if (!config.cloud?.project) return null;

  return (
    <FileTrigger
      acceptedFileTypes={ACCEPTED_TYPES}
      onSelect={async items => {
        let files = Array.from(items || []);
        if (files[0]) {
          setIsUploading(true);
          try {
            const result = await uploadImage(files[0], config);
            props.onUploaded({ ...result, alt: '' });
            setIsUploading(false);
          } catch (err) {
            setIsUploading(false);
            toastQueue.critical((err as Error).message);
          }
        }
      }}
    >
      <ActionButton isDisabled={isUploading} {...styleProps}>
        {isUploading ? 'Uploading…' : 'Upload'}
      </ActionButton>
    </FileTrigger>
  );
}

function ImageDialog(props: {
  image?: CloudImageProps;
  onCancel: () => void;
  onChange: (data: CloudImageProps) => void;
  onClose: () => void;
}) {
  const { image, onCancel, onChange, onClose } = props;
  const [state, setState] = useState<CloudImageProps>(image ?? emptyImageData);
  const [status, setStatus] = useState<ImageStatus>(image ? 'good' : '');
  const formId = useId();
  const imageLibraryURL = useImageLibraryURL();

  const onPaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const text = event.clipboardData.getData('text/plain');
    setState(parseImageData(text));
  };
  const config = useConfig();

  const hasSetFields = !!(state.alt || state.width || state.height);

  useEffect(() => {
    if (!state.src) {
      setStatus('');
      return;
    }
    if (!isValidURL(state.src)) {
      return;
    }
    if (hasSetFields) {
      setStatus('good');
      return;
    }
    setStatus('loading');
    loadImageData(state.src, config)
      .then(newData => {
        setState(state => ({ ...state, ...newData }));
        setStatus('good');
      })
      .catch(() => {
        setStatus('error');
      });
  }, [config, hasSetFields, state.src]);

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
          <HStack alignItems="end" gap="medium">
            <TextField
              label="Image URL"
              flex
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
            <UploadImageButton
              onUploaded={data => {
                setState(data);
              }}
            />
          </HStack>
          {status === 'good' ? (
            <>
              <TextArea
                label="Alt text"
                value={state.alt}
                onChange={alt => setState(state => ({ ...state, alt }))}
              />
              <ImageDimensionsInput
                src={state.src}
                image={state}
                onChange={dimensions => {
                  setState(state => ({ ...state, ...dimensions }));
                }}
              />
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
  selected: boolean;
}) {
  const state = useOverlayTriggerState({ defaultOpen: false });

  const { open } = state;
  useEffect(() => {
    if (props.selected) {
      open();
    }
  }, [props.selected, open]);

  const closeAndCleanup = () => {
    state.close();
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
  selected,
}: {
  image: CloudImageProps;
  onChange: (data: CloudImageProps) => void;
  onRemove: () => void;
  selected: boolean;
}) {
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
  const selected = useSelected();
  const editor = useSlateStatic();

  if (!props.fields.src.value) {
    return (
      <Placeholder
        onChange={props.onChange}
        onRemove={() => {
          focusWithPreviousSelection(editor);
          props.onRemove();
        }}
        selected={selected}
      />
    );
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
      selected={selected}
    />
  );
}

export function handleFile(file: File, config: Config) {
  try {
    const result = uploadImage(file, config);
    toastQueue.info('Uploading image…');
    return result.then(data => {
      toastQueue.positive('Image uploaded');
      return {
        ...data,
        alt: '',
      };
    });
  } catch (err) {
    toastQueue.critical((err as any).message);
    return false;
  }
}

export function CloudImagePreviewForNewEditor(props: {
  onRemove: () => void;
  onChange: (
    data: ParsedValueForComponentSchema<
      ObjectField<typeof import('./cloud-image-schema').cloudImageSchema>
    >
  ) => void;
  value: ParsedValueForComponentSchema<
    ObjectField<typeof import('./cloud-image-schema').cloudImageSchema>
  >;
  isSelected: boolean;
}) {
  if (!props.value.src) {
    return (
      <Placeholder
        // @ts-ignore
        onChange={props.onChange}
        onRemove={props.onRemove}
        selected={props.isSelected}
      />
    );
  }

  return (
    <ImagePreview
      image={{
        src: props.value.src,
        alt: props.value.alt,
        width: props.value.width ?? undefined,
        height: props.value.height ?? undefined,
      }}
      // @ts-ignore
      onChange={props.onChange}
      onRemove={props.onRemove}
      selected={props.isSelected}
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
  const split = getSplitCloudProject(config);
  if (!split) return 'https://keystatic.cloud/';
  return `https://keystatic.cloud/teams/${split.team}/project/${split.project}/images`;
}

function getAspectRatio(state: ImageDimensions) {
  if (!state.width || !state.height) return 1;
  return state.width / state.height;
}

export const cloudImageToolbarIcon = imageIcon;
