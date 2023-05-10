import { action, storiesOf } from '@voussoir/storybook';

import { ActionButton } from '@voussoir/button';
import { Icon } from '@voussoir/icon';
import { boldIcon } from '@voussoir/icon/icons/boldIcon';
import { code2Icon } from '@voussoir/icon/icons/code2Icon';
import { componentIcon } from '@voussoir/icon/icons/componentIcon';
import { fileCodeIcon } from '@voussoir/icon/icons/fileCodeIcon';
import { indentIcon } from '@voussoir/icon/icons/indentIcon';
import { italicIcon } from '@voussoir/icon/icons/italicIcon';
import { strikethroughIcon } from '@voussoir/icon/icons/strikethroughIcon';
import { linkIcon } from '@voussoir/icon/icons/linkIcon';
import { listIcon } from '@voussoir/icon/icons/listIcon';
import { listOrderedIcon } from '@voussoir/icon/icons/listOrderedIcon';
// import { unlinkIcon } from '@voussoir/icon/icons/unlinkIcon';
import { Box, Divider, Flex } from '@voussoir/layout';
import { Heading, Text } from '@voussoir/typography';
import { HTMLProps, useEffect, useState } from 'react';

import {
  EditorPopover,
  EditorPopoverTrigger,
  EditorPopoverProvider,
} from '../src';
// import { Item, Menu } from '@voussoir/menu';
import { Combobox, Item } from '@voussoir/combobox';

storiesOf('Editor/Popover', module)
  .addDecorator(story => (
    <EditorPopoverProvider>{story()}</EditorPopoverProvider>
  ))
  .add('default', () => {
    let [isOpen, setOpen] = useState(false);
    let [triggerRef, setTriggerRef] = useState<HTMLButtonElement | null>(null);
    return (
      <Flex
        direction="column"
        maxWidth="container.xsmall"
        marginX="auto"
        gap="xlarge"
      >
        <ActionButton
          ref={setTriggerRef}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          type="button"
        >
          Press me
        </ActionButton>
        <EditorPopover isOpen={isOpen} reference={triggerRef}>
          <Box padding="regular">
            <Text>Popover content</Text>
          </Box>
        </EditorPopover>
      </Flex>
    );
  })
  .add('overlay children', () => {
    let [isOpen, setOpen] = useState(false);
    let [triggerRef, setTriggerRef] = useState<HTMLButtonElement | null>(null);
    return (
      <Flex
        direction="column"
        maxWidth="container.xsmall"
        marginX="auto"
        gap="xlarge"
      >
        <EditorPopoverTrigger>
          <ActionButton>Press me</ActionButton>
          <Flex padding="regular" gap="regular">
            <Combobox aria-label="Combobox" placeholder="Placeholder">
              <Item key="One">One</Item>
              <Item key="Two">Two</Item>
              <Item key="Three">Three has a long label that will wrap</Item>
            </Combobox>
          </Flex>
        </EditorPopoverTrigger>
      </Flex>
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
        <EditorPopover isOpen={isOpen} reference={triggerRef} sticky>
          <Box padding="regular" maxWidth="container.xsmall">
            <Text>
              This popover will overlap the target, staying in view when the
              parent is scrolled.
            </Text>
          </Box>
        </EditorPopover>
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
      </Flex>
    );
  })
  .add('range', () => {
    const range = useRangeFromDocumentSelection();

    return (
      <Flex direction="column" maxWidth="container.small" marginX="auto">
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
        <EditorPopover isOpen={!!range} reference={range}>
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
      </Flex>
    );
  })
  .add('content editable', () => {
    const range = useRangeFromDocumentSelection();

    return (
      <Flex
        direction="column"
        gap="large"
        maxWidth="container.small"
        marginX="auto"
      >
        <Node>
          Candy canes halvah bear claw wafer toffee cake wafer. Apple pie sweet
          roll gummi bears macaroon jelly beans. Dessert brownie tootsie roll
          cotton candy jelly-o. Halvah pudding cookie pastry cheesecake
          liquorice caramels macaroon gummies.
        </Node>
        <Node>
          Jelly marzipan halvah muffin halvah gummi bears sweet roll cookie.
          Powder cheesecake tiramisu halvah pie jelly-o cotton candy. Chupa
          chups topping marshmallow biscuit gingerbread. Cotton candy carrot
          cake candy cookie danish jelly.
        </Node>
        <Node>
          Shortbread sweet roll jujubes halvah sesame snaps wafer wafer. Sweet
          roll topping sugar plum fruitcake cookie soufflé sugar plum pastry
          sweet. Cake gummies sugar plum bear claw dessert. Pie cookie cake
          marzipan jelly beans.
        </Node>
        <Node>
          Wafer jelly-o jelly beans croissant tart fruitcake marzipan cake.
          Cheesecake gingerbread cake sesame snaps cheesecake powder chupa chups
          cheesecake shortbread. Chupa chups liquorice pastry dragée sesame
          snaps brownie chocolate bar lemon drops. Macaroon sesame snaps
          chocolate bar candy canes tootsie roll chocolate bar.
        </Node>
        <Node>
          Cake muffin cheesecake liquorice chupa chups. Cheesecake apple pie
          powder pudding gummi bears chocolate marshmallow sweet sugar plum.
          Marshmallow tiramisu cheesecake topping sweet jujubes biscuit jelly
          beans chupa chups.
        </Node>
        <EditorPopover isOpen={!!range} reference={range}>
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

function Node(props: HTMLProps<HTMLDivElement>) {
  let [isVisible, setVisible] = useState(false);
  let [isOpen, setOpen] = useState(false);
  let [floatingRef, setFloatingRef] = useState<HTMLDivElement | null>(null);
  let [triggerRef, setTriggerRef] = useState<HTMLDivElement | null>(null);
  return (
    <>
      <Flex
        alignItems="start"
        gap="regular"
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
      >
        <div
          onClick={() => setOpen(bool => !bool)}
          ref={setTriggerRef}
          style={{ opacity: isVisible ? 1 : 0 }}
        >
          <Icon src={componentIcon} color="neutralTertiary" />
        </div>
        <Text>{props.children}</Text>
      </Flex>

      <EditorPopover
        isOpen={isOpen}
        reference={triggerRef}
        ref={setFloatingRef}
        placement="bottom-start"
      >
        <Box padding="regular">
          <Text>Popover content.</Text>
        </Box>
      </EditorPopover>
    </>
  );
}
