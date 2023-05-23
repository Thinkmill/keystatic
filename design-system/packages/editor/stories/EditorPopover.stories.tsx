import { storiesOf } from '@voussoir/storybook';

import { ActionButton } from '@voussoir/button';
import { Combobox, Item } from '@voussoir/combobox';
import { Icon } from '@voussoir/icon';
import { boldIcon } from '@voussoir/icon/icons/boldIcon';
import { code2Icon } from '@voussoir/icon/icons/code2Icon';
import { fileCodeIcon } from '@voussoir/icon/icons/fileCodeIcon';
import { indentIcon } from '@voussoir/icon/icons/indentIcon';
import { italicIcon } from '@voussoir/icon/icons/italicIcon';
import { strikethroughIcon } from '@voussoir/icon/icons/strikethroughIcon';
import { linkIcon } from '@voussoir/icon/icons/linkIcon';
import { listIcon } from '@voussoir/icon/icons/listIcon';
import { listOrderedIcon } from '@voussoir/icon/icons/listOrderedIcon';
import { Menu } from '@voussoir/menu';
import { Box, Divider, Flex } from '@voussoir/layout';
import { Heading, Text } from '@voussoir/typography';
import { useEffect, useRef, useState } from 'react';

import { EditorPopover, EditorPopoverRef } from '../src';

storiesOf('Editor/Popover', module)
  .add('default', () => {
    let [isOpen, setOpen] = useState(false);
    let [triggerRef, setTriggerRef] = useState<HTMLButtonElement | null>(null);

    return (
      <>
        <ActionButton
          onPress={() => setOpen(bool => !bool)}
          ref={setTriggerRef}
        >
          Press me
        </ActionButton>
        {isOpen && triggerRef && (
          <EditorPopover reference={triggerRef}>
            <Box padding="regular">
              <Text>Popover content</Text>
            </Box>
          </EditorPopover>
        )}
      </>
    );
  })
  .add('refs', () => {
    let floating = useRef<EditorPopoverRef | null>(null);
    let [isOpen, setOpen] = useState(false);
    let [triggerRef, setTriggerRef] = useState<HTMLButtonElement | null>(null);

    return (
      <Flex gap="large">
        <ActionButton
          onPress={() => setOpen(bool => !bool)}
          ref={setTriggerRef}
        >
          Press me
        </ActionButton>
        {isOpen && (
          <ActionButton
            onPress={() => {
              console.log(floating.current);
            }}
          >
            Log ref data
          </ActionButton>
        )}
        {isOpen && triggerRef && (
          <EditorPopover ref={floating} reference={triggerRef}>
            <Box padding="regular">
              <Text>Popover content</Text>
            </Box>
          </EditorPopover>
        )}
      </Flex>
    );
  })
  .add('overlay children', () => {
    let [isOpen, setOpen] = useState(false);
    let [triggerRef, setTriggerRef] = useState<HTMLButtonElement | null>(null);

    return (
      <>
        <ActionButton
          onPress={() => setOpen(bool => !bool)}
          ref={setTriggerRef}
        >
          Press me
        </ActionButton>
        {isOpen && triggerRef && (
          <EditorPopover reference={triggerRef}>
            <Box padding="regular">
              <Combobox aria-label="Combobox" placeholder="Placeholder">
                <Item key="One">One</Item>
                <Item key="Two">Two</Item>
                <Item key="Three">Three has a long label that will wrap</Item>
              </Combobox>
            </Box>
          </EditorPopover>
        )}
      </>
    );
  })
  .add('sticky', () => {
    let [isOpen, setOpen] = useState(false);
    let [triggerRef, setTriggerRef] = useState<HTMLImageElement | null>(null);

    return (
      <Flex
        direction="column"
        maxWidth="container.xsmall"
        marginX="auto"
        gap="xlarge"
      >
        <Text>
          Sesame snaps soufflé cupcake cupcake tiramisu danish bear claw powder.
          Dessert gummi bears cookie shortbread lemon drops muffin tiramisu
          apple pie gummi bears. Cupcake tart oat cake macaroon candy apple pie
          biscuit dragée. Dessert cake sesame snaps jujubes ice cream jelly
          beans toffee. Wafer sweet pudding bonbon ice cream candy. Jelly wafer
          oat cake croissant chocolate carrot cake powder. Cookie cotton candy
          sweet gummi bears bear claw brownie. Chocolate bar jelly carrot cake
          cotton candy bonbon chupa chups dessert. Ice cream candy canes
          shortbread wafer biscuit bear claw jelly beans sugar plum. Chocolate
          bar dragée gummi bears jelly beans ice cream sweet biscuit cake
          fruitcake. Marzipan muffin pastry lollipop chocolate. Cake dessert
          croissant sweet roll topping. Chocolate bar sweet roll chocolate cake
          danish cheesecake carrot cake marshmallow. Carrot cake jelly beans
          sweet macaroon jujubes pudding.
        </Text>
        <Heading>
          Press the image below to focus it, and reveal the popover.
        </Heading>
        <img
          src="https://cupcakeipsum.com/images/happy_muffin.png"
          ref={setTriggerRef}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          tabIndex={0}
          style={{
            borderRadius: 8,
            height: 'auto',
            marginInline: 'auto',
            maxWidth: '100%',
            outline: isOpen ? '2px solid blue' : 'none',
            outlineOffset: -2,
          }}
        />
        <Text>
          Sesame snaps soufflé cupcake cupcake tiramisu danish bear claw powder.
          Dessert gummi bears cookie shortbread lemon drops muffin tiramisu
          apple pie gummi bears. Cupcake tart oat cake macaroon candy apple pie
          biscuit dragée. Dessert cake sesame snaps jujubes ice cream jelly
          beans toffee. Wafer sweet pudding bonbon ice cream candy. Jelly wafer
          oat cake croissant chocolate carrot cake powder. Cookie cotton candy
          sweet gummi bears bear claw brownie. Chocolate bar jelly carrot cake
          cotton candy bonbon chupa chups dessert. Ice cream candy canes
          shortbread wafer biscuit bear claw jelly beans sugar plum. Chocolate
          bar dragée gummi bears jelly beans ice cream sweet biscuit cake
          fruitcake. Marzipan muffin pastry lollipop chocolate. Cake dessert
          croissant sweet roll topping. Chocolate bar sweet roll chocolate cake
          danish cheesecake carrot cake marshmallow. Carrot cake jelly beans
          sweet macaroon jujubes pudding.
        </Text>
        {triggerRef && isOpen && (
          <EditorPopover sticky reference={triggerRef}>
            <Box padding="regular" maxWidth="container.xsmall">
              <Text>
                This popover will overlap the target, staying in view when the
                parent is scrolled.
              </Text>
            </Box>
          </EditorPopover>
        )}
      </Flex>
    );
  })
  .add('range', () => {
    const range = useRangeFromDocumentSelection();

    return (
      <Flex
        direction="column"
        maxWidth="container.xsmall"
        marginX="auto"
        gap="xlarge"
      >
        <Text>
          Sesame snaps soufflé cupcake cupcake tiramisu danish bear claw powder.
          Dessert gummi bears cookie shortbread lemon drops muffin tiramisu
          apple pie gummi bears. Cupcake tart oat cake macaroon candy apple pie
          biscuit dragée. Dessert cake sesame snaps jujubes ice cream jelly
          beans toffee. Wafer sweet pudding bonbon ice cream candy. Jelly wafer
          oat cake croissant chocolate carrot cake powder. Cookie cotton candy
          sweet gummi bears bear claw brownie. Chocolate bar jelly carrot cake
          cotton candy bonbon chupa chups dessert. Ice cream candy canes
          shortbread wafer biscuit bear claw jelly beans sugar plum. Chocolate
          bar dragée gummi bears jelly beans ice cream sweet biscuit cake
          fruitcake. Marzipan muffin pastry lollipop chocolate. Cake dessert
          croissant sweet roll topping. Chocolate bar sweet roll chocolate cake
          danish cheesecake carrot cake marshmallow. Carrot cake jelly beans
          sweet macaroon jujubes pudding.
        </Text>
        {range && (
          <EditorPopover reference={range}>
            <Flex padding="small" gap="small">
              <ActionButton prominence="low" aria-label="bold">
                <Icon src={boldIcon} />
              </ActionButton>
              <ActionButton prominence="low" aria-label="italic">
                <Icon src={italicIcon} />
              </ActionButton>
              <ActionButton prominence="low" aria-label="Strikethrough">
                <Icon src={strikethroughIcon} />
              </ActionButton>

              <Divider orientation="vertical" />

              <ActionButton prominence="low" aria-label="Link">
                <Icon src={linkIcon} />
              </ActionButton>

              <Divider orientation="vertical" />

              <ActionButton prominence="low" aria-label="Bulleted list">
                <Icon src={listIcon} />
              </ActionButton>
              <ActionButton prominence="low" aria-label="Ordered list">
                <Icon src={listOrderedIcon} />
              </ActionButton>

              <Divider orientation="vertical" />

              <ActionButton prominence="low" aria-label="Blockquote">
                <Icon src={indentIcon} />
              </ActionButton>

              <Divider orientation="vertical" />

              <ActionButton prominence="low" aria-label="Code">
                <Icon src={code2Icon} />
              </ActionButton>
              <ActionButton prominence="low" aria-label="Code block">
                <Icon src={fileCodeIcon} />
              </ActionButton>
            </Flex>
          </EditorPopover>
        )}
      </Flex>
    );
  })
  .add('content editable', () => {
    const [range, setRange] = useState<Range | null>(null);

    return (
      <Flex
        direction="column"
        width="container.xsmall"
        marginX="auto"
        gap="xlarge"
      >
        <div
          contentEditable
          onInput={e => {
            // @ts-expect-error
            if (e.nativeEvent?.data === '/') {
              let selection = window.getSelection();

              if (selection) {
                setRange(selection.getRangeAt(0));
              }
            } else {
              setRange(null);
            }
          }}
          dangerouslySetInnerHTML={{
            __html: `<p>Type "/" to reveal the popover.</p><p>Cupcake ipsum dolor sit amet
          shortbread tart. Cupcake jelly macaroon tart pie. Brownie jelly sugar
          plum oat cake wafer cheesecake oat cake pie caramels. Marshmallow
          brownie gingerbread topping brownie jelly beans.</p>`,
          }}
        />
        {range && (
          <EditorPopover reference={range} placement="bottom-start">
            <Menu aria-label="action menu">
              <Item>Edit</Item>
              <Item>Share</Item>
              <Item>Duplicate</Item>
            </Menu>
          </EditorPopover>
        )}
      </Flex>
    );
  });

function useRangeFromDocumentSelection() {
  const [range, setRange] = useState<Range | null>(null);

  useEffect(() => {
    let listener = () => {
      let selection = window.getSelection();

      if (selection && !selection.isCollapsed) {
        setRange(selection.getRangeAt(0));
      } else {
        setRange(null);
      }
    };

    document.addEventListener('selectionchange', listener);

    return () => document.removeEventListener('selectionchange', listener);
  }, []);

  return range;
}
