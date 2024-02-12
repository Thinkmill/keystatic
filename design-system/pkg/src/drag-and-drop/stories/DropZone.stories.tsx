import { useState } from 'react';

import { ActionButton } from '@keystar/ui/button';
import { Icon } from '@keystar/ui/icon';
import { imagePlusIcon } from '@keystar/ui/icon/icons/imagePlusIcon';
import { uploadCloudIcon } from '@keystar/ui/icon/icons/uploadCloudIcon';
import { VStack } from '@keystar/ui/layout';
import { action } from '@keystar/ui-storybook';
import { Text } from '@keystar/ui/typography';

import { DropZone, FileDropItem, isFileDropItem } from '../index';
import { FileTrigger } from '../FileTrigger';
import { Image } from '@keystar/ui/image';
import { ListView, Item } from '@keystar/ui/list-view';

export default {
  title: 'Components/DropZone',
};

export const Default = () => {
  let [files, setFiles] = useState<string[]>([]);
  return (
    <VStack gap="large" alignItems="start">
      <ActionButton onPress={() => setFiles([])}>Clear</ActionButton>
      <DropZone
        onDrop={async function onDrop(e) {
          let files = e.items.filter(isFileDropItem);

          if (files.length > 0) {
            setFiles(files.map(file => file.name));
          }
        }}
        onDropEnter={action('onDropEnter')}
        onDropExit={action('onDropExit')}
      >
        <VStack padding="xlarge" gap="large" alignItems="center">
          <Text slot="label">
            {files.length ? files.join(', ') : 'Drag and drop here'}
          </Text>
        </VStack>
      </DropZone>
    </VStack>
  );
};
Default.storyName = 'default';

// const ALLOWED_EXTENSIONS = ['png', 'jpg', 'jpeg', 'gif', 'webp'];
const ALLOWED_EXTENSIONS = ['png', 'jpg', 'jpeg', 'webp'];
const ALLOWED_TYPES = ALLOWED_EXTENSIONS.map(ext => `image/${ext}`);
export const UsingRenderProp = () => {
  let [files, setFiles] = useState<string[]>([]);
  return (
    <VStack gap="large" width="container.xsmall">
      <ActionButton alignSelf="start" onPress={() => setFiles([])}>
        Clear
      </ActionButton>
      <DropZone
        getDropOperation={types => {
          if (ALLOWED_TYPES.some(type => types.has(type))) {
            return 'copy';
          }
          return 'cancel';
        }}
        onDrop={async function onDrop(e) {
          let files = e.items
            .filter(isFileDropItem)
            .filter(file => ALLOWED_TYPES.includes(file.type));

          if (files.length > 0) {
            setFiles(files.map(file => file.name));
          }
        }}
        onDropEnter={action('onDropEnter')}
        onDropExit={action('onDropExit')}
      >
        {({ isDropTarget }) => (
          <VStack padding="xlarge" gap="large" alignItems="center">
            <Icon
              size="large"
              src={isDropTarget ? uploadCloudIcon : imagePlusIcon}
            />
            <Text slot="label" weight="medium">
              {isDropTarget ? 'Drop to upload' : 'Drag and drop images…'}
            </Text>
          </VStack>
        )}
      </DropZone>
      {files.length ? (
        files.map(name => <Text key={name}>{name}</Text>)
      ) : (
        <Text>Waiting for files…</Text>
      )}
    </VStack>
  );
};
UsingRenderProp.storyName = 'using render prop';

export const WithFileTrigger = () => {
  let [files, setFiles] = useState<string[]>([]);
  return (
    <VStack gap="large" width="container.xsmall">
      <ActionButton alignSelf="start" onPress={() => setFiles([])}>
        Clear
      </ActionButton>
      <DropZone
        getDropOperation={types => {
          if (ALLOWED_TYPES.some(type => types.has(type))) {
            return 'copy';
          }
          return 'cancel';
        }}
        onDrop={function onDrop(e) {
          let files = e.items
            .filter(isFileDropItem)
            .filter(file => ALLOWED_TYPES.includes(file.type));

          if (files.length > 0) {
            setFiles(files.map(file => file.name));
          }
        }}
        onDropEnter={action('onDropEnter')}
        onDropExit={action('onDropExit')}
      >
        {({ isDropTarget }) => (
          <VStack padding="xlarge" gap="large" alignItems="center">
            <Icon
              size="large"
              src={isDropTarget ? uploadCloudIcon : imagePlusIcon}
            />
            <Text slot="label" weight="medium">
              {isDropTarget ? 'Drop to upload' : 'Drag and drop images…'}
            </Text>
            <FileTrigger
              acceptedFileTypes={ALLOWED_TYPES}
              allowsMultiple
              onSelect={items => {
                let files = Array.from(items || []);
                if (files.length > 0) {
                  setFiles(files.map(file => file.name));
                }
              }}
            >
              <ActionButton>Browse</ActionButton>
            </FileTrigger>
          </VStack>
        )}
      </DropZone>
      {files.length ? (
        files.map(name => <Text key={name}>{name}</Text>)
      ) : (
        <Text>Waiting for files…</Text>
      )}
    </VStack>
  );
};
WithFileTrigger.storyName = 'with file trigger';

export const RenderingContent = () => {
  let [files, setFiles] = useState<{ src: string; name: string }[]>([]);

  console.log(files);

  let extensions = ['png', 'jpg', 'jpeg', 'gif', 'webp'];
  let ALLOWED_TYPES = extensions.map(ext => `image/${ext}`);

  return (
    <VStack gap="large" width="container.xsmall">
      <DropZone
        onDrop={async function onDrop(e) {
          let files = e.items.filter(item => {
            return (
              item.kind === 'file' && ALLOWED_TYPES.some(t => t === item.type)
            );
          }) as FileDropItem[];

          if (files.length > 0) {
            let items = [];
            for (let item of files) {
              items.push({
                src: URL.createObjectURL(await item.getFile()),
                name: item.name,
              });
            }
            setFiles(items);
          }
        }}
      >
        <VStack padding="xxlarge" gap="large" alignItems="center">
          <Text slot="label" weight="medium">
            Drag and drop here
          </Text>
          <FileTrigger
            acceptedFileTypes={ALLOWED_TYPES}
            allowsMultiple
            onSelect={filelist => {
              let files = Array.from(filelist || []);
              if (files.length > 0) {
                let items = [];
                for (let item of files) {
                  items.push({
                    src: URL.createObjectURL(item),
                    name: item.name,
                  });
                }
                setFiles(items);
              }
            }}
          >
            <ActionButton>Browse</ActionButton>
          </FileTrigger>
        </VStack>
      </DropZone>
      <ListView
        aria-label="files"
        items={files}
        minHeight="element.large"
        renderEmptyState={() => (
          <VStack gap="large" alignItems="center">
            <Text>No files…</Text>
          </VStack>
        )}
      >
        {item => (
          <Item key={item.src} textValue={item.name}>
            <Image src={item.src} alt="" aspectRatio="1" />
            <Text>{item.name}</Text>
          </Item>
        )}
      </ListView>
    </VStack>
  );
};
RenderingContent.storyName = 'rendering content';
