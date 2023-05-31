import { storiesOf } from '@voussoir/storybook';
import { useEffect, useRef, useState } from 'react';

import { Box } from '@voussoir/layout';
import { Text } from '@voussoir/typography';

import { EditorListbox, EditorPopover } from '../src';

let basicItems = [
  { id: 1, label: 'Echidna' },
  { id: 2, label: 'Dingo' },
  { id: 3, label: 'Kangaroo' },
  { id: 4, label: 'Quokka' },
  { id: 5, label: 'Platypus' },
  { id: 6, label: 'Koala' },
  { id: 7, label: 'Cassowary' },
  { id: 8, label: 'Wallaby' },
  { id: 9, label: 'Bilby' },
];
let complexItems = [
  {
    id: 1,
    label: 'Code snippet',
    description: 'Display code with syntax highlighting',
    kbd: '```',
  },
  {
    id: 2,
    label: 'Divider',
    description: 'A horizontal line to separate content',
    kbd: '---',
  },
  {
    id: 3,
    label: 'Heading',
    description: 'A heading with a level from 1 to 6',
    kbd: '#..###',
  },
  { id: 4, label: 'Image', description: 'Display an image' },
  {
    id: 5,
    label: 'Link',
    description: 'A link to another page or website',
    kbd: { meta: true, text: 'k' },
  },
  {
    id: 6,
    label: 'Bullet list',
    description: 'Insert an unordered list',
    kbd: { meta: true, shift: true, text: '8' },
  },
  {
    id: 7,
    label: 'Numbered list',
    description: 'Insert an ordered list',
    kbd: { meta: true, shift: true, text: '7' },
  },
];
let manyItems: any[] = [];
for (let i = 0; i < 50; i++) {
  manyItems.push({ label: 'Item ' + i, id: i });
}

storiesOf('Editor/Listbox', module)
  .add('default', () => {
    let listenerRef = useListenerRef();
    return (
      <Box width="alias.singleLineWidth" ref={listenerRef} tabIndex={0}>
        <EditorListbox
          aria-label="label"
          items={basicItems}
          listenerRef={listenerRef}
        />
      </Box>
    );
  })
  .add('many items', () => {
    let listenerRef = useListenerRef();
    return (
      <Box
        width="alias.singleLineWidth"
        ref={listenerRef}
        tabIndex={0}
        height="alias.singleLineWidth"
        overflow="auto"
      >
        <EditorListbox
          aria-label="label"
          items={manyItems}
          listenerRef={listenerRef}
        />
      </Box>
    );
  })
  .add('complex items', () => {
    let listenerRef = useListenerRef();
    return (
      <Box width="container.xsmall" ref={listenerRef} tabIndex={0}>
        <EditorListbox
          aria-label="label"
          items={complexItems}
          listenerRef={listenerRef}
        />
      </Box>
    );
  })
  .add('within popover', () => {
    let listenerRef = useRef(document.documentElement);
    let [triggerRef, setTriggerRef] = useState<HTMLElement | null>(null);

    return (
      <>
        <Box paddingX="medium" ref={setTriggerRef}>
          <Text color="accent" weight="medium">
            /insert-menu
          </Text>
        </Box>
        {triggerRef && (
          <EditorPopover reference={triggerRef} placement="bottom-start">
            <Box
              width="alias.singleLineWidth"
              height="alias.singleLineWidth"
              overflow="auto"
            >
              <EditorListbox
                aria-label="label"
                items={basicItems}
                listenerRef={listenerRef}
              />
            </Box>
          </EditorPopover>
        )}
      </>
    );
  });

function useListenerRef() {
  let listenerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    listenerRef.current?.focus();
  }, []);
  return listenerRef;
}
