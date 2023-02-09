import { action } from '@storybook/addon-actions';
import { ArgTypes, storiesOf } from '@storybook/react';

import { Item, Menu, MenuTrigger, Section } from '../src';
import { alignCenterVerticalIcon } from '@voussoir/icon/icons/alignCenterVerticalIcon';
import { alignStartVerticalIcon } from '@voussoir/icon/icons/alignStartVerticalIcon';
import { alignEndVerticalIcon } from '@voussoir/icon/icons/alignEndVerticalIcon';
import { globeIcon } from '@voussoir/icon/icons/globeIcon';
import { boldIcon } from '@voussoir/icon/icons/boldIcon';
import { italicIcon } from '@voussoir/icon/icons/italicIcon';
import { Icon } from '@voussoir/icon';
import { Kbd, Text } from '@voussoir/typography';
import { Button } from '@voussoir/button';
import { cloneElement } from 'react';

let iconMap = {
  AlignHorizontalCenterIcon: alignCenterVerticalIcon,
  AlignHorizontalLeftIcon: alignStartVerticalIcon,
  AlignHorizontalRightIcon: alignEndVerticalIcon,
  GlobeIcon: globeIcon,
  TextBoldIcon: boldIcon,
  TextItalicIcon: italicIcon,
};

let flatOptions = [
  { id: 1, name: 'Echidna' },
  { id: 2, name: 'Dingo' },
  { id: 3, name: 'Kangaroo' },
  { id: 4, name: 'Quokka' },
  { id: 5, name: 'Platypus' },
  { id: 6, name: 'Koala' },
  { id: 7, name: 'Cassowary' },
  { id: 8, name: 'Wallaby' },
  { id: 9, name: 'Bilby' },
];

let withSection = [
  {
    name: 'Marsupials',
    children: [{ name: 'Bilby' }, { name: 'Kangaroo' }, { name: 'Quokka' }],
  },
  {
    name: 'Other',
    children: [{ name: 'Echidna' }, { name: 'Dingo' }, { name: 'Cassowary' }],
  },
];

let complexOptions = [
  {
    name: 'Section 1',
    children: [
      { name: 'Bold', icon: 'TextBoldIcon', shortcut: '⌘B' },
      { name: 'Italic', icon: 'TextItalicIcon', shortcut: '⌘I' },
    ],
  },
  {
    name: 'Section 2',
    children: [
      { name: 'Left', icon: 'AlignHorizontalLeftIcon', shortcut: '⌘L' },
      { name: 'Center', icon: 'AlignHorizontalCenterIcon', shortcut: '⌘C' },
      { name: 'Right', icon: 'AlignHorizontalRightIcon', shortcut: '⌘R' },
      {
        name: 'hasChildren',
        children: [
          { name: 'France', icon: 'GlobeIcon', shortcut: '⌘F' },
          { name: 'Germany', icon: 'GlobeIcon', shortcut: '⌘G' },
        ],
      },
    ],
  },
];

const argTypes = {
  direction: {
    control: 'select',
    defaultValue: 'bottom',
    options: ['top', 'bottom', 'left', 'right', 'start', 'end'],
  },
  align: {
    control: 'radio',
    defaultValue: 'start',
    options: ['start', 'end'],
  },
  shouldFlip: {
    control: 'boolean',
    defaultValue: true,
  },
};

storiesOf('Components/Menu', module)
  .add(
    'static',
    (args: ArgTypes) =>
      render(
        <Menu onAction={action('onAction')}>
          <Item>One</Item>
          <Item>Two</Item>
          <Item>Three</Item>
        </Menu>,
        args
      ),
    { argTypes }
  )
  .add('dynamic', () =>
    render(
      <Menu items={flatOptions} onAction={action('onAction')}>
        {item => <Item key={item.name}>{item.name}</Item>}
      </Menu>
    )
  )
  .add('sections (static)', () =>
    render(
      <Menu onAction={action('onAction')}>
        <Section title="Marsupials">
          <Item>Bilby</Item>
          <Item>Kangaroo</Item>
          <Item>Quokka</Item>
        </Section>
        <Section title="Other">
          <Item>Echidna</Item>
          <Item>Dingo</Item>
          <Item>Cassowary</Item>
        </Section>
      </Menu>
    )
  )
  .add('sections (dynamic)', () => render(defaultMenu))
  .add('titleless sections (static)', () =>
    render(
      <Menu onAction={action('onAction')}>
        <Section aria-label="Marsupials">
          <Item>Bilby</Item>
          <Item>Kangaroo</Item>
          <Item>Quokka</Item>
        </Section>
        <Section aria-label="Other">
          <Item>Echidna</Item>
          <Item>Dingo</Item>
          <Item>Cassowary</Item>
        </Section>
      </Menu>
    )
  )
  .add('titleless sections (dynamic)', () =>
    render(
      <Menu items={withSection} onAction={action('onAction')}>
        {item => (
          <Section key={item.name} items={item.children} aria-label={item.name}>
            {item => <Item key={item.name}>{item.name}</Item>}
          </Section>
        )}
      </Menu>
    )
  )
  .add('selectionMode="single" (controlled, static)', () =>
    render(
      <Menu
        selectionMode="single"
        onAction={action('onAction')}
        selectedKeys={['2']}
      >
        <Section title="Section 1">
          <Item key="1">One</Item>
          <Item key="2">Two</Item>
          <Item key="3">Three</Item>
        </Section>
        <Section title="Section 2">
          <Item key="4">Four</Item>
          <Item key="5">Five</Item>
          <Item key="6">Six</Item>
          <Item key="7">Seven</Item>
        </Section>
      </Menu>
    )
  )
  .add('selectionMode="single" (controlled, dynamic)', () =>
    render(
      defaultMenu,
      {},
      { selectedKeys: ['Kangaroo'], selectionMode: 'single' }
    )
  )
  .add('selectionMode="single" (uncontrolled, static)', () =>
    render(
      <Menu
        selectionMode="single"
        onAction={action('onAction')}
        defaultSelectedKeys={['2']}
      >
        <Section title="Section 1">
          <Item key="1">One</Item>
          <Item key="2">Two</Item>
          <Item key="3">Three</Item>
        </Section>
        <Section title="Section 2">
          <Item key="4">Four</Item>
          <Item key="5">Five</Item>
          <Item key="6">Six</Item>
          <Item key="7">Seven</Item>
        </Section>
      </Menu>
    )
  )
  .add('selectionMode="single" (uncontrolled, dynamic)', () =>
    render(
      defaultMenu,
      {},
      { defaultSelectedKeys: ['Kangaroo'], selectionMode: 'single' }
    )
  )
  .add('selectionMode="multiple" (controlled, static)', () =>
    render(
      <Menu
        onAction={action('onAction')}
        selectionMode="multiple"
        selectedKeys={['2', '5']}
        disabledKeys={['2', '3']}
      >
        <Section title="Section 1">
          <Item key="1">One</Item>
          <Item key="2">Two</Item>
          <Item key="3">Three</Item>
        </Section>
        <Section title="Section 2">
          <Item key="4">Four</Item>
          <Item key="5">Five</Item>
          <Item key="6">Six</Item>
        </Section>
      </Menu>
    )
  )
  .add('selectionMode="multiple" (controlled, dynamic)', () =>
    render(
      defaultMenu,
      {},
      { selectedKeys: ['Kangaroo', 'Echidna'], selectionMode: 'multiple' }
    )
  )
  .add('selectionMode="multiple" (uncontrolled, static)', () =>
    render(
      <Menu
        onAction={action('onAction')}
        selectionMode="multiple"
        defaultSelectedKeys={['2', '5']}
        disabledKeys={['1', '3']}
      >
        <Section title="Section 1">
          <Item key="1">One</Item>
          <Item key="2">Two</Item>
          <Item key="3">Three</Item>
        </Section>
        <Section title="Section 2">
          <Item key="4">Four</Item>
          <Item key="5">Five</Item>
          <Item key="6">Six</Item>
        </Section>
      </Menu>
    )
  )
  .add('selectionMode="multiple" (uncontrolled, dynamic)', () =>
    render(
      defaultMenu,
      {},
      {
        defaultSelectedKeys: ['Kangaroo', 'Echidna'],
        selectionMode: 'multiple',
      }
    )
  )
  .add('selectionMode="none"', () =>
    render(defaultMenu, {}, { selectionMode: 'none' })
  )
  .add('disabledBehavior="selection"', () =>
    render(
      <Menu
        selectionMode="multiple"
        disabledKeys={['actionable-four', 'actionable-five', 'actionable-six']}
        defaultSelectedKeys={['selectable-one', 'selectable-two']}
        disabledBehavior="selection"
        onAction={action('onAction')}
      >
        <Section title="Selectable">
          <Item key="selectable-one">One</Item>
          <Item key="selectable-two">Two</Item>
          <Item key="selectable-three">Three</Item>
        </Section>
        <Section title="Actionable">
          <Item key="actionable-four">Four</Item>
          <Item key="actionable-five">Five</Item>
          <Item key="actionable-six">Six</Item>
        </Section>
      </Menu>,
      {},
      { disabledBehavior: 'selection' }
    )
  )
  .add('autoFocus=true', () => render(defaultMenu, {}, { autoFocus: true }))
  .add('autoFocus=false', () => render(defaultMenu, {}, { autoFocus: false }))
  .add('autoFocus=true, with selection', () =>
    render(
      defaultMenu,
      {},
      {
        autoFocus: true,
        selectionMode: 'single',
        defaultSelectedKeys: ['Kangaroo'],
      }
    )
  )
  .add('autoFocus="first"', () =>
    render(defaultMenu, {}, { autoFocus: 'first' })
  )
  .add('autoFocus="last"', () => render(defaultMenu, {}, { autoFocus: 'last' }))
  .add('shouldFocusWrap=false', () =>
    render(defaultMenu, {}, { shouldFocusWrap: false })
  )
  .add('isOpen', () => render(defaultMenu, { isOpen: true }))
  .add('defaultOpen', () => render(defaultMenu, { defaultOpen: true }))
  .add('disabled trigger', () => render(defaultMenu, { isDisabled: true }))
  .add('closeOnSelect=false', () =>
    render(defaultMenu, { closeOnSelect: false }, {})
  )
  .add('closeOnSelect=true, multiselect', () =>
    render(defaultMenu, { closeOnSelect: true }, { selectionMode: 'multiple' })
  )
  .add(
    'complex items (static)',
    (args: ArgTypes) =>
      render(
        <Menu
          selectionMode="multiple"
          defaultSelectedKeys={['bold', 'italic']}
          disabledKeys={['zoom-in', 'italic']}
          disabledBehavior="selection"
        >
          <Section title="Section 1">
            <Item key="bold" textValue="Bold">
              <Icon src={boldIcon} />
              <Text>Bold</Text>
              <Kbd meta>B</Kbd>
            </Item>
            <Item key="italic" textValue="Italic">
              <Icon src={italicIcon} />
              <Text>Italic</Text>
              <Kbd meta>I</Kbd>
            </Item>
          </Section>
          <Section title="Section 2">
            <Item key="zoom-in" textValue="Zoom in">
              <Text>Zoom in</Text>
              <Kbd meta>+</Kbd>
            </Item>
            <Item key="zoom-out" textValue="Zoom out">
              <Text>Zoom out</Text>
              <Kbd meta>-</Kbd>
            </Item>
            <Item key="zoom-full" textValue="Zoom to 100%">
              <Text>Zoom to 100%</Text>
              <Kbd meta shift>
                0
              </Kbd>
            </Item>
          </Section>
          <Section title="Section 3">
            <Item key="left" textValue="Left">
              <Icon src={alignStartVerticalIcon} />
              <Text>Left</Text>
              <Text slot="description">
                The description text for left is long
              </Text>
            </Item>
            <Item
              key="center"
              textValue="Center has a long label that will eventually wrap, but it's pretty ridiculous"
            >
              <Icon src={alignCenterVerticalIcon} />
              <Text>
                Center has a long label that will eventually wrap, but it's
                pretty ridiculous
              </Text>
            </Item>
            <Item key="right" textValue="Right">
              <Icon src={alignEndVerticalIcon} />
              <Text>Right</Text>
            </Item>
          </Section>
        </Menu>,
        args
      ),
    { argTypes }
  )
  .add('complex items (dynamic)', () =>
    render(
      <Menu items={complexOptions} onAction={action('onAction')}>
        {item => (
          <Section key={item.name} items={item.children} title={item.name}>
            {item => customMenuItem(item)}
          </Section>
        )}
      </Menu>
    )
  )
  .add('menu should prevent scrolling', () => (
    <div style={{ height: 100, display: 'flex' }}>
      <div
        style={{
          paddingTop: 100,
          height: 100,
          overflow: 'auto',
          background: 'antiquewhite',
        }}
      >
        <div style={{ height: 200 }}>
          <div>Shouldn't be able to scroll here while Menu is open.</div>
          <MenuTrigger onOpenChange={action('onOpenChange')} defaultOpen>
            <Button
              onPress={action('press')}
              onPressStart={action('pressstart')}
              onPressEnd={action('pressend')}
            >
              Trigger
            </Button>
            <Menu items={withSection} onAction={action('action')}>
              {item => (
                <Section
                  key={item.name}
                  items={item.children}
                  title={item.name}
                >
                  {item => <Item key={item.name}>{item.name}</Item>}
                </Section>
              )}
            </Menu>
          </MenuTrigger>
        </div>
      </div>
      <div
        style={{
          paddingTop: 100,
          height: 100,
          overflow: 'auto',
          flex: 1,
          background: 'grey',
        }}
      >
        <div style={{ height: 200 }}>
          Also shouldn't be able to scroll here while Menu is open.
        </div>
      </div>
    </div>
  ))
  .add('menu closes on blur', () => (
    <>
      <div style={{ display: 'flex', width: 'auto', margin: '250px 0' }}>
        <label htmlFor="focus-before">Focus before</label>
        <input id="focus-before" />
        <MenuTrigger onOpenChange={action('onOpenChange')}>
          <Button
            onPress={action('press')}
            onPressStart={action('pressstart')}
            onPressEnd={action('pressend')}
          >
            Trigger
          </Button>
          <Menu
            items={withSection}
            onAction={action('action')}
            disabledKeys={['Quokka', 'Cassowary']}
          >
            {item => (
              <Section key={item.name} items={item.children} title={item.name}>
                {item => <Item key={item.name}>{item.name}</Item>}
              </Section>
            )}
          </Menu>
        </MenuTrigger>
        <label htmlFor="focus-after">Focus after</label>
        <input id="focus-after" />
      </div>
    </>
  ))
  .add('with falsy key', () =>
    render(
      <Menu onAction={action('onAction')}>
        <Item key="1">One</Item>
        <Item key="">Two</Item>
        <Item key="3">Three</Item>
      </Menu>
    )
  )
  .add('MenuTrigger with trigger="longPress"', () =>
    render(defaultMenu, { trigger: 'longPress' })
  );
// .add('controlled isOpen', () => <ControlledOpeningMenuTrigger />)

let customMenuItem = (item: any) => {
  let icon = iconMap[item.icon as keyof typeof iconMap];
  return (
    <Item childItems={item.children} textValue={item.name} key={item.name}>
      {item.icon && <Icon src={icon} />}
      <Text>{item.name}</Text>
      {item.shortcut && <Kbd>{item.shortcut}</Kbd>}
    </Item>
  );
};

function render(
  menu: any,
  { isDisabled, ...triggerProps }: any = {},
  menuProps = {}
) {
  let menuRender = cloneElement(menu, menuProps);
  return (
    <MenuTrigger onOpenChange={action('onOpenChange')} {...triggerProps}>
      <Button
        isDisabled={isDisabled}
        onPress={action('press')}
        onPressStart={action('pressstart')}
        onPressEnd={action('pressend')}
      >
        Trigger
      </Button>
      {menuRender}
    </MenuTrigger>
  );
}

let defaultMenu = (
  <Menu
    items={withSection}
    onAction={action('action')}
    disabledKeys={['Quokka', 'Cassowary']}
  >
    {(item: any) => (
      <Section key={item.name} items={item.children} title={item.name}>
        {(item: any) => (
          <Item key={item.name} childItems={item.children}>
            {item.name}
          </Item>
        )}
      </Section>
    )}
  </Menu>
);
