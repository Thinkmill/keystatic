import { action, storiesOf } from '@voussoir/storybook';
import { Key, ReactElement, useEffect, useRef, useState } from 'react';

import { Icon } from '@voussoir/icon';
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
import { Kbd, KbdProps, Text } from '@voussoir/typography';

import { EditorListbox, EditorPopover, Item, Section } from '../src';

type KbdOption = 'alt' | 'meta' | 'shift';
type KbdOptions = KbdOption[];
type KbdFormat = readonly [...KbdOptions, Key] | string;
type ItemType = {
  description?: string;
  icon?: ReactElement;
  id: Key;
  kbd?: KbdFormat;
  label: string;
};

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
let manyItems: any[] = [];
for (let i = 0; i < 50; i++) {
  manyItems.push({ label: 'Item ' + i, id: i });
}

storiesOf('Editor/Listbox', module)
  .add('default', () => {
    let listenerRef = useListenerRef();
    return (
      <EditorListbox
        aria-label="default example"
        items={basicItems}
        children={childRenderer}
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
        aria-label="many items example"
        items={manyItems}
        children={childRenderer}
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
        aria-label="complex items example"
        items={complexItems}
        children={section => (
          <Section key={section.id} aria-label={section.label}>
            {section.children.map(childRenderer)}
          </Section>
        )}
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
              aria-label="popover example"
              items={basicItems}
              children={childRenderer}
              listenerRef={listenerRef}
              maxHeight="inherit"
              width="alias.singleLineWidth"
            />
          </EditorPopover>
        )}
      </>
    );
  });

// Utils
// -----------------------------------------------------------------------------

function useListenerRef() {
  let listenerRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    listenerRef.current = document.documentElement;
  }, []);
  return listenerRef;
}

function childRenderer(item: ItemType) {
  return (
    <Item key={item.id} textValue={item.label}>
      <Text>{item.label}</Text>
      {item.description && <Text slot="description">{item.description}</Text>}
      {item.kbd && <Kbd {...getKbdProps(item.kbd)} />}
      {item.icon && <Icon src={item.icon} />}
    </Item>
  );
}
function getKbdProps(format: KbdFormat) {
  if (typeof format === 'string') {
    return { children: format };
  }

  let [children, ...options] = [...format].reverse();
  let props: KbdProps = { children };
  for (let option of options as KbdOptions) {
    props[option] = true;
  }

  return props;
}

// Story blocks
// -----------------------------------------------------------------------------

let complexItems = [
  {
    id: 'common-blocks',
    label: 'Common blocks',
    children: [
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
    ],
  },
  {
    id: 'custom-blocks',
    label: 'custom blocks',
    children: [
      {
        id: 'custom-1',
        label: 'Custom node 1',
        description: 'Description of custom node (potentially)',
      },
      {
        id: 'custom-2',
        label: 'Custom node 2',
        description: 'Description of custom node (potentially)',
      },
    ],
  },
] as const;
