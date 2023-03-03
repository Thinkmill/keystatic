import { ReactEditor, RenderElementProps, useSelected } from 'slate-react';
import { Editor, Transforms } from 'slate';
import { ActionButton, ButtonGroup } from '@voussoir/button';
import { FieldLabel } from '@voussoir/field';
import { Flex, Box } from '@voussoir/layout';
import { css, tokenSchema } from '@voussoir/style';
import { TextField } from '@voussoir/text-field';
import {
  getUploadedImage,
  useObjectURL,
} from './component-blocks/fields/image';
import {
  insertNodesButReplaceIfSelectionIsAtEmptyParagraphOrHeading,
  useElementWithSetNodes,
  useStaticEditor,
} from './utils';
import { Icon } from '@voussoir/icon';
import { imageIcon } from '@voussoir/icon/icons/imageIcon';
import { TooltipTrigger, Tooltip } from '@voussoir/tooltip';
import { Text } from '@voussoir/typography';

export const ImageElement = ({
  attributes,
  children,
  element: __elementForGettingPath,
}: RenderElementProps & { element: { type: 'image' } }) => {
  const editor = useStaticEditor();
  const [currentElement, setNode] = useElementWithSetNodes(
    editor,
    __elementForGettingPath
  );
  const objectUrl = useObjectURL(currentElement.src.content)!;
  const selected = useSelected();
  return (
    <div {...attributes} draggable="true">
      <div contentEditable={false} className={css({ position: 'relative' })}>
        <Flex
          direction="column"
          gap="small"
          paddingStart="xlarge"
          UNSAFE_className={css({
            '::before': {
              display: 'block',
              content: '" "',
              backgroundColor: selected
                ? tokenSchema.color.alias.borderSelected
                : tokenSchema.color.alias.borderIdle,
              borderRadius: 4,
              width: 4,
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              zIndex: 1,
            },
          })}
        >
          <FieldLabel>Image</FieldLabel>
          <Box
            alignSelf="start"
            backgroundColor="canvas"
            borderRadius="regular"
            border="neutral"
            padding="regular"
          >
            <img
              src={objectUrl}
              alt={currentElement.alt}
              title={currentElement.title}
              style={{
                display: 'block',
                maxHeight: tokenSchema.size.alias.singleLineWidth,
                maxWidth: '100%',
              }}
            />
          </Box>
          <TextField
            label="Filename"
            onChange={filename => {
              setNode({
                src: {
                  content: currentElement.src.content,
                  filename,
                },
              });
            }}
            value={currentElement.src.filename}
          />
          <TextField
            label="Alt Text"
            value={currentElement.alt}
            onChange={alt => {
              setNode({ alt });
            }}
          />
          <TextField
            label="Title"
            value={currentElement.title ?? ''}
            onChange={title => {
              setNode({ title });
            }}
          />
          <ButtonGroup>
            <ActionButton
              onPress={async () => {
                const src = await getUploadedImage();
                if (src) {
                  setNode({
                    src,
                  });
                }
              }}
            >
              Replace
            </ActionButton>
            <ActionButton
              onPress={() => {
                Transforms.removeNodes(editor, {
                  at: ReactEditor.findPath(editor, __elementForGettingPath),
                });
              }}
            >
              Remove
            </ActionButton>
          </ButtonGroup>
        </Flex>
      </div>
      {children}
    </div>
  );
};

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

// schema: GraphQLSchema;
// source: string | Source;
// rootValue?: unknown;
// contextValue?: unknown;
// variableValues?: Maybe<{
//   readonly [variable: string]: unknown;
// }>;
