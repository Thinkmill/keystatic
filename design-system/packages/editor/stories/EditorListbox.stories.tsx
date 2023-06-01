import { action, storiesOf } from '@voussoir/storybook';
import { useEffect, useRef, useState } from 'react';

import { fileCodeIcon } from '@voussoir/icon/icons/fileCodeIcon';
import { heading1Icon } from '@voussoir/icon/icons/heading1Icon';
import { heading2Icon } from '@voussoir/icon/icons/heading2Icon';
import { heading3Icon } from '@voussoir/icon/icons/heading3Icon';
import { heading4Icon } from '@voussoir/icon/icons/heading4Icon';
import { heading5Icon } from '@voussoir/icon/icons/heading5Icon';
import { heading6Icon } from '@voussoir/icon/icons/heading6Icon';
import { imageIcon } from '@voussoir/icon/icons/imageIcon';
import { listIcon } from '@voussoir/icon/icons/listIcon';
import { listOrderedIcon } from '@voussoir/icon/icons/listOrderedIcon';
import { quoteIcon } from '@voussoir/icon/icons/quoteIcon';
import { tableIcon } from '@voussoir/icon/icons/tableIcon';
import { separatorHorizontalIcon } from '@voussoir/icon/icons/separatorHorizontalIcon';
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
    id: 'code-block',
    label: 'Code block',
    description: 'Display code with syntax highlighting',
    kbd: '```',
    icon: fileCodeIcon,
  },
  {
    id: 'divider',
    label: 'Divider',
    description: 'A horizontal line to separate content',
    kbd: '---',
    icon: separatorHorizontalIcon,
  },
  {
    id: 'image',
    label: 'Image',
    description: 'Include an image with your content',
    icon: imageIcon,
  },
  {
    id: 'table',
    label: 'Table',
    description: 'Insert a table',
    // kbd: ['alt', 'shift', 'T'],
    icon: tableIcon,
  },
  // {
  //   id: 'link',
  //   label: 'Link',
  //   description: 'A link to another page or website',
  //   kbd: ['meta', 'k'],
  //   icon: linkIcon,
  // },
  {
    id: 'quote',
    label: 'Quote',
    description: 'Insert a quote or citation',
    kbd: ['meta', 'shift', '9'],
    icon: quoteIcon,
  },
  {
    id: 'list-unordered',
    label: 'Bullet list',
    description: 'Insert an unordered list',
    kbd: ['meta', 'shift', '8'],
    icon: listIcon,
  },
  {
    id: 'list-ordered',
    label: 'Numbered list',
    description: 'Insert an ordered list',
    kbd: ['meta', 'shift', '7'],
    icon: listOrderedIcon,
  },
  {
    id: 'heading-1',
    label: 'Heading 1',
    description: 'Use this for a top level heading',
    kbd: ['meta', 'alt', '1'],
    icon: heading1Icon,
  },
  {
    id: 'heading-2',
    label: 'Heading 2',
    description: 'Use this for key sections',
    kbd: ['meta', 'alt', '2'],
    icon: heading2Icon,
  },
  {
    id: 'heading-3',
    label: 'Heading 3',
    description: 'Use this for sub-sections and group headings',
    kbd: ['meta', 'alt', '3'],
    icon: heading3Icon,
  },
  {
    id: 'heading-4',
    label: 'Heading 4',
    description: 'Use this for deep headings',
    kbd: ['meta', 'alt', '4'],
    icon: heading4Icon,
  },
  {
    id: 'heading-5',
    label: 'Heading 5',
    description: 'Use this for grouping list items',
    kbd: ['meta', 'alt', '5'],
    icon: heading5Icon,
  },
  {
    id: 'heading-6',
    label: 'Heading 6',
    description: 'Use this for low-level headings',
    kbd: ['meta', 'alt', '6'],
    icon: heading6Icon,
  },
] as const;
let manyItems: any[] = [];
for (let i = 0; i < 50; i++) {
  manyItems.push({ label: 'Item ' + i, id: i });
}

storiesOf('Editor/Listbox', module)
  .add('default', () => {
    let listenerRef = useListenerRef();
    return (
      <EditorListbox
        aria-label="label"
        items={basicItems}
        listenerRef={listenerRef}
        width="alias.singleLineWidth"
        onAction={action('onAction')}
      />
    );
  })
  .add('many items', () => {
    let listenerRef = useListenerRef();
    return (
      <EditorListbox
        aria-label="label"
        items={manyItems}
        listenerRef={listenerRef}
        selectionMode="multiple"
        width="alias.singleLineWidth"
        height="alias.singleLineWidth"
      />
    );
  })
  .add('complex items', () => {
    let listenerRef = useListenerRef();
    return (
      <EditorListbox
        aria-label="label"
        items={complexItems}
        listenerRef={listenerRef}
        width="container.xsmall"
      />
    );
  })
  .add('within popover', () => {
    let listenerRef = useListenerRef();
    let [triggerRef, setTriggerRef] = useState<HTMLElement | null>(null);

    return (
      <>
        <Box
          paddingX="medium"
          ref={setTriggerRef}
          UNSAFE_style={{
            marginBottom: 600,
            marginTop: 600,
            marginInlineStart: 300,
          }}
        >
          <Text color="accent" weight="medium">
            /insert-menu
          </Text>
        </Box>
        {triggerRef && (
          <EditorPopover
            reference={triggerRef}
            placement="bottom-start"
            adaptToViewport="stretch"
          >
            <EditorListbox
              aria-label="label"
              items={basicItems}
              listenerRef={listenerRef}
              maxHeight="inherit"
              width="alias.singleLineWidth"
            />
          </EditorPopover>
        )}
      </>
    );
  });

function useListenerRef() {
  let listenerRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    listenerRef.current = document.documentElement;
  }, []);
  return listenerRef;
}
