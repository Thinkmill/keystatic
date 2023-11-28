---
title: DropZone
description:
  A DropZone is an area into which one or many objects can be dragged and
  dropped.
category: Forms
---

## Example

```jsx {% live=true %}
let [dropped, setDropped] = React.useState(false);

return (
  <DropZone onDrop={() => setDropped(true)} width="container.xsmall">
    <Text slot="label" marginX="auto" marginY="large" align="center">
      {dropped ? 'You dropped something' : 'Drag and drop here'}
    </Text>
  </DropZone>
);
```

## Patterns

### Labelling

A visual label should be provided to `DropZone` using either a
[Text](/package/typography/text) or [Heading](/package/typography/heading)
element attributed with `slot="label"`.

```jsx
<DropZone>
  <Heading slot="label">Drag and drop here</Heading>
</DropZone>
```

Alternatively, an `aria-label` or `aria-labelledby` prop must be passed to
identify the element to assistive technology.

```jsx
<DropZone aria-label="Drag and drop here">
  <Icon src={imagePlusIcon} />
</DropZone>
```

### Render prop

You can pass a function to `children`, which will provide access to state.

```jsx {% live=true %}
<DropZone>
  {({ isDropTarget }) => {
    let icon = isDropTarget ? uploadCloudIcon : filePlusIcon;
    let label = isDropTarget ? 'Drop to upload' : 'Drag and drop files…';
    return (
      <VStack padding="xxlarge" gap="large" alignItems="center">
        <Icon size="large" src={icon} />
        <Text slot="label" weight="medium">
          {label}
        </Text>
      </VStack>
    );
  }}
</DropZone>
```

## Events

`DropZone` supports drop operations via mouse, keyboard, and touch. You can
handle all of these via the onDrop prop. In addition, the `onDropEnter`,
`onDropMove`, and `onDropExit` events are fired as the user enters and exits the
dropzone during a drag operation.

The following example uses an `onDrop` handler to update the filled status
stored in React state.

```jsx {% live=true %}
let [file, setFile] = React.useState();
return (
  <DropZone
    onDrop={e => {
      setFile(e.items.find(item => item.kind === 'file'));
    }}
  >
    <VStack padding="xxlarge" gap="large" alignItems="center">
      {file && (
        <Icon
          size="large"
          src={file.type.startsWith('image') ? imageIcon : fileIcon}
        />
      )}
      <Text slot="label" weight="medium">
        {file ? file.name : 'Drag and drop a file'}
      </Text>
    </VStack>
  </DropZone>
);
```

## File trigger

A `FileTrigger` is commonly paired with a `DropZone` to allow a user to choose
files from their device.

The example below allows multiple files with the `allowsMultiple` prop, but only
certain images are accepted by providing the `acceptedFileTypes` prop.

```jsx {% live=true %}
let ALLOWED_TYPES = [
  'image/png',
  'image/jpg',
  'image/jpeg',
  'image/gif',
  'image/webp',
];
let [files, setFiles] = React.useState([]);
return (
  <VStack gap="large">
    <DropZone
      onDrop={async function onDrop(e) {
        let files = e.items.filter(item => {
          return (
            item.kind === 'file' && ALLOWED_TYPES.some(t => t === item.type)
          );
        });

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
          Drag and drop images
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
        <Item key={item.name} textValue={item.name}>
          <Image src={item.src} alt="" aspectRatio="1" />
          <Text>{item.name}</Text>
        </Item>
      )}
    </ListView>
  </VStack>
);
```
