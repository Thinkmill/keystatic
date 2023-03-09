import { useLocalizedStringFormatter } from '@react-aria/i18n';
import { useState } from 'react';
import { ReactEditor, RenderElementProps } from 'slate-react';
import { Editor, Transforms } from 'slate';

import { ActionButton, Button, ButtonGroup } from '@voussoir/button';
import { Dialog, DialogContainer, useDialogContainer } from '@voussoir/dialog';
import { Icon } from '@voussoir/icon';
import { fileUpIcon } from '@voussoir/icon/icons/fileUpIcon';
import { imageIcon } from '@voussoir/icon/icons/imageIcon';
import { editIcon } from '@voussoir/icon/icons/editIcon';
import { trash2Icon } from '@voussoir/icon/icons/trash2Icon';
import { Divider, Flex } from '@voussoir/layout';
import { Content } from '@voussoir/slots';
import { css, tokenSchema } from '@voussoir/style';
import { TextField } from '@voussoir/text-field';
import { TooltipTrigger, Tooltip } from '@voussoir/tooltip';
import { Heading, Text } from '@voussoir/typography';

import l10nMessages from '../app/l10n/index.json';
import {
  getUploadedImage,
  useObjectURL,
} from './component-blocks/fields/image';
import {
  focusWithPreviousSelection,
  insertNodesButReplaceIfSelectionIsAtEmptyParagraphOrHeading,
  useElementWithSetNodes,
  useSelectedOrFocusWithin,
  useStaticEditor,
} from './utils';
import {
  BlockPopover,
  BlockPopoverTrigger,
  BlockWrapper,
  NotEditable,
} from './primitives';

export const ImageElement = ({
  attributes,
  children,
  element: __elementForGettingPath,
}: RenderElementProps & { element: { type: 'image' } }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<number>();
  const stringFormatter = useLocalizedStringFormatter(l10nMessages);
  const editor = useStaticEditor();
  const [currentElement, setNode] = useElementWithSetNodes(
    editor,
    __elementForGettingPath
  );
  const objectUrl = useObjectURL(currentElement.src.content)!;
  const [selected, targetProps] = useSelectedOrFocusWithin();

  return (
    <>
      <BlockWrapper draggable attributes={attributes}>
        <BlockPopoverTrigger
          // isOpen={selected}
          key={aspectRatio} // Force the popover to re-render when the aspect ratio changes.
        >
          <NotEditable style={{ display: 'inline-block', lineHeight: 1 }}>
            <img
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
                display: 'inline-block',
                maxHeight: tokenSchema.size.alias.singleLineWidth,
                maxWidth: '100%',

                '&[data-selected=true]': {
                  boxShadow: `0 0 0 ${tokenSchema.size.border.regular} ${tokenSchema.color.alias.borderSelected}`,
                },
              })}
            />
          </NotEditable>

          <BlockPopover hideArrow>
            <Flex gap="regular" padding="regular" {...targetProps}>
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

        {children}
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
            filename={currentElement.src.filename}
            onSubmit={({ alt, filename }) => {
              setNode({
                alt,
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

function ImageDialog({
  onSubmit,
  ...props
}: {
  alt?: string;
  filename: string;
  onSubmit: (value: { alt: string; filename: string }) => void;
}) {
  const [filenameWithoutExtension, filenameExtension] = splitFilename(
    props.filename
  );
  let [altText, setAltText] = useState(props.alt || '');
  let [fileName, setFileName] = useState(filenameWithoutExtension || '');
  let [fileNameTouched, setFileNameTouched] = useState(false);

  let { dismiss } = useDialogContainer();
  let stringFormatter = useLocalizedStringFormatter(l10nMessages);

  return (
    <Dialog size="small">
      <form
        style={{ display: 'contents' }}
        onSubmit={event => {
          event.preventDefault();
          if (fileName) {
            dismiss();
            onSubmit({
              alt: altText,
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
                fileNameTouched && !fileName
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
            <TextField
              autoFocus
              label="Alt text"
              description="This text will be used by screen readers and search engines."
              onChange={setAltText}
              value={altText}
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
  const editor = useStaticEditor();

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
  const { insertData, isVoid } = editor;

  editor.isVoid = element => isVoid(element) || element.type === 'image';

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
