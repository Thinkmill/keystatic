import { useLocalizedStringFormatter } from '@react-aria/i18n';
import { useMemo, useState } from 'react';
import { ReactEditor, RenderElementProps, useSlateStatic } from 'slate-react';
import { Editor, Transforms } from 'slate';

import { ActionButton, Button, ButtonGroup } from '@keystar/ui/button';
import {
  Dialog,
  DialogContainer,
  useDialogContainer,
} from '@keystar/ui/dialog';
import { Icon } from '@keystar/ui/icon';
import { fileUpIcon } from '@keystar/ui/icon/icons/fileUpIcon';
import { imageIcon } from '@keystar/ui/icon/icons/imageIcon';
import { editIcon } from '@keystar/ui/icon/icons/editIcon';
import { trash2Icon } from '@keystar/ui/icon/icons/trash2Icon';
import { Divider, Flex } from '@keystar/ui/layout';
import { Content } from '@keystar/ui/slots';
import { css, tokenSchema, transition } from '@keystar/ui/style';
import { TextField } from '@keystar/ui/text-field';
import { TooltipTrigger, Tooltip } from '@keystar/ui/tooltip';
import { Heading, Text } from '@keystar/ui/typography';

import l10nMessages from '../../../../app/l10n';
import { getUploadedImage, useObjectURL } from '../../image/ui';
import {
  focusWithPreviousSelection,
  insertNodesButReplaceIfSelectionIsAtEmptyParagraphOrHeading,
  useElementWithSetNodes,
} from './ui-utils';
import {
  BlockPopover,
  BlockPopoverTrigger,
  BlockWrapper,
  NotEditable,
  useActiveBlockPopover,
} from './primitives';
import { createGetPreviewProps } from '../../../preview-props';
import { fields } from '../../../api';
import { useDocumentEditorConfig } from './toolbar-state';
import { FormValueContentFromPreviewProps } from '../../../form-from-preview';
import { clientSideValidateProp } from '../../../errors';

export const ImageElement = ({
  attributes,
  children,
  element: __elementForGettingPath,
}: RenderElementProps & { element: { type: 'image' } }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<number>();
  const stringFormatter = useLocalizedStringFormatter(l10nMessages);
  const editor = useSlateStatic();
  const [currentElement, setNode] = useElementWithSetNodes(
    editor,
    __elementForGettingPath
  );
  const objectUrl = useObjectURL(
    currentElement.src.content,
    currentElement.src.filename.endsWith('.svg') ? 'image/svg+xml' : undefined
  )!;
  const activePopoverElement = useActiveBlockPopover();
  const selected = activePopoverElement === __elementForGettingPath;

  return (
    <>
      <BlockWrapper attributes={attributes}>
        {children}
        <BlockPopoverTrigger
          element={__elementForGettingPath}
          key={aspectRatio} // Force the popover to re-render when the aspect ratio changes.
        >
          <div
            style={{
              alignItems: 'center',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <NotEditable>
              <img
                {...attributes}
                src={objectUrl}
                alt={currentElement.alt}
                data-selected={selected}
                onLoad={e => {
                  const target = e.target as HTMLImageElement;
                  setAspectRatio(target.width / target.height);
                }}
                className={css({
                  boxSizing: 'border-box',
                  borderRadius: tokenSchema.size.radius.regular,
                  display: 'block',
                  maxHeight: tokenSchema.size.scale[3600],
                  maxWidth: '100%',
                  transition: transition('box-shadow'),

                  '&[data-selected=true]': {
                    boxShadow: `0 0 0 ${tokenSchema.size.border.regular} ${tokenSchema.color.alias.borderSelected}`,
                  },
                })}
              />
            </NotEditable>
          </div>

          <BlockPopover hideArrow>
            <Flex gap="regular" padding="regular">
              <Flex gap="small">
                <TooltipTrigger>
                  <ActionButton
                    prominence="low"
                    onPress={() => setDialogOpen(true)}
                  >
                    <Icon src={editIcon} />
                  </ActionButton>
                  <Tooltip>{stringFormatter.format('edit')}</Tooltip>
                </TooltipTrigger>
                <TooltipTrigger>
                  <ActionButton
                    prominence="low"
                    onPress={async () => {
                      const src = await getUploadedImage();
                      if (src) {
                        setNode({ src });
                      }
                    }}
                  >
                    <Icon src={fileUpIcon} />
                  </ActionButton>
                  <Tooltip>Choose file</Tooltip>
                </TooltipTrigger>
              </Flex>
              <Divider orientation="vertical" />
              <TooltipTrigger>
                <ActionButton
                  prominence="low"
                  onPress={() => {
                    Transforms.removeNodes(editor, {
                      at: ReactEditor.findPath(editor, __elementForGettingPath),
                    });
                  }}
                >
                  <Icon src={trash2Icon} />
                </ActionButton>
                <Tooltip tone="critical">Remove</Tooltip>
              </TooltipTrigger>
            </Flex>
          </BlockPopover>
        </BlockPopoverTrigger>
      </BlockWrapper>

      <DialogContainer
        onDismiss={() => {
          setDialogOpen(false);
          focusWithPreviousSelection(editor);
        }}
      >
        {dialogOpen && (
          <ImageDialog
            alt={currentElement.alt}
            title={currentElement.title}
            filename={currentElement.src.filename}
            onSubmit={({ alt, filename, title }) => {
              setNode({
                alt,
                title,
                src: {
                  content: currentElement.src.content,
                  filename,
                },
              });
            }}
          />
        )}
      </DialogContainer>
    </>
  );
};

function ImageDialog(props: {
  alt: string;
  title: string;
  filename: string;
  onSubmit: (value: { alt: string; filename: string; title: string }) => void;
}) {
  const { images } = useDocumentEditorConfig().documentFeatures;
  if (!images) {
    throw new Error('unexpected image rendered when images are disabled');
  }
  const schema = useMemo(() => fields.object(images.schema), [images]);
  const [state, setState] = useState({ alt: props.alt, title: props.title });
  const previewProps = useMemo(
    () => createGetPreviewProps(schema, setState, () => undefined),
    [schema]
  )(state);

  const [filenameWithoutExtension, filenameExtension] = splitFilename(
    props.filename
  );
  const [forceValidation, setForceValidation] = useState(false);
  let [fileName, setFileName] = useState(filenameWithoutExtension);
  let [fileNameTouched, setFileNameTouched] = useState(false);

  let { dismiss } = useDialogContainer();
  let stringFormatter = useLocalizedStringFormatter(l10nMessages);

  return (
    <Dialog size="small">
      <form
        style={{ display: 'contents' }}
        onSubmit={event => {
          if (event.target !== event.currentTarget) return;
          event.preventDefault();
          setForceValidation(true);
          if (fileName && clientSideValidateProp(schema, state, undefined)) {
            dismiss();
            props.onSubmit({
              alt: state.alt,
              title: state.title,
              filename: [fileName, filenameExtension].join('.'),
            });
          }
        }}
      >
        <Heading>Image details</Heading>
        <Content>
          <Flex gap="large" direction="column">
            <TextField
              label="File name"
              onChange={setFileName}
              onBlur={() => setFileNameTouched(true)}
              value={fileName}
              isRequired
              errorMessage={
                (fileNameTouched || forceValidation) && !fileName
                  ? 'Please provide a file name.'
                  : undefined
              }
              endElement={
                filenameExtension ? (
                  <Flex
                    alignItems="center"
                    justifyContent="center"
                    paddingEnd="regular"
                  >
                    <Text color="neutralTertiary">.{filenameExtension}</Text>
                  </Flex>
                ) : null
              }
            />
            <FormValueContentFromPreviewProps
              forceValidation={forceValidation}
              autoFocus
              {...previewProps}
            />
          </Flex>
        </Content>
        <ButtonGroup>
          <Button onPress={dismiss}>{stringFormatter.format('cancel')}</Button>
          <Button prominence="high" type="submit">
            {stringFormatter.format('save')}
          </Button>
        </ButtonGroup>
      </form>
    </Dialog>
  );
}

function splitFilename(filename: string): [string, string] {
  const dotIndex = filename.lastIndexOf('.');
  if (dotIndex === -1) {
    return [filename, ''];
  }
  return [filename.substring(0, dotIndex), filename.substring(dotIndex + 1)];
}

let _imageIcon = <Icon src={imageIcon} />;

function ImageButton() {
  const editor = useSlateStatic();

  return (
    <>
      <ActionButton
        prominence="low"
        onPress={async () => {
          const src = await getUploadedImage();
          if (src) {
            Transforms.insertNodes(editor, {
              type: 'image',
              src,
              alt: '',
              title: '',
              children: [{ text: '' }],
            });
          }
        }}
      >
        {_imageIcon}
      </ActionButton>
    </>
  );
}

export const imageButton = (
  <TooltipTrigger>
    <ImageButton />
    <Tooltip>
      <Text>Image</Text>
    </Tooltip>
  </TooltipTrigger>
);

export function withImages(editor: Editor): Editor {
  const { insertData } = editor;

  editor.insertData = data => {
    const images = Array.from(data.files).filter(x =>
      x.type.startsWith('image/')
    );
    if (images.length) {
      Promise.all(
        images.map(async file => ({
          name: file.name,
          data: new Uint8Array(await file.arrayBuffer()),
        }))
      ).then(images => {
        insertNodesButReplaceIfSelectionIsAtEmptyParagraphOrHeading(editor, {
          type: 'image',
          src: {
            content: images[0].data,
            filename: images[0].name,
          },
          alt: '',
          title: '',
          children: [{ text: '' }],
        });
      });
      return;
    }

    insertData(data);
  };

  return editor;
}
