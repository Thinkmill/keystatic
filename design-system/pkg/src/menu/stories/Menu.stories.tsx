import { cloneElement } from 'react';

import { ActionButton } from '@keystar/ui/button';
import { Icon } from '@keystar/ui/icon';
import { alignCenterVerticalIcon } from '@keystar/ui/icon/icons/alignCenterVerticalIcon';
import { alignStartVerticalIcon } from '@keystar/ui/icon/icons/alignStartVerticalIcon';
import { alignEndVerticalIcon } from '@keystar/ui/icon/icons/alignEndVerticalIcon';
import { globeIcon } from '@keystar/ui/icon/icons/globeIcon';
import { boldIcon } from '@keystar/ui/icon/icons/boldIcon';
import { italicIcon } from '@keystar/ui/icon/icons/italicIcon';
import { action, ArgTypes } from '@keystar/ui-storybook';
import { Tooltip, TooltipTrigger } from '@keystar/ui/tooltip';
import { Kbd, Text } from '@keystar/ui/typography';

import { Item, Menu, MenuTrigger, Section } from '../index';

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

export default {
  title: 'Components/Menu',
};

export const Static = (args: ArgTypes) =>
  render(
    <Menu onAction={action('onAction')}>
      <Item>One</Item>
      <Item>Two</Item>
      <Item>Three</Item>
    </Menu>,
    args
  );

Static.args = {
  shouldFlip: true,
  direction: 'bottom',
  align: 'start',
};
Static.argTypes = {
  direction: {
    control: 'select',
    options: ['top', 'bottom', 'left', 'right', 'start', 'end'],
  },
  align: {
    control: 'radio',
    options: ['start', 'end'],
  },
};

export const Dynamic = () =>
  render(
    <Menu items={flatOptions} onAction={action('onAction')}>
      {item => <Item key={item.name}>{item.name}</Item>}
    </Menu>
  );

Dynamic.story = {
  name: 'dynamic',
};

export const Links = () => {
  return (
    <MenuTrigger>
      <ActionButton>Trigger</ActionButton>
      <Menu>
        <Item href="https://apple.com/" target="_blank">
          Apple
        </Item>
        <Item href="https://google.com/" target="_blank">
          Google
        </Item>
        <Item href="https://microsoft.com/" target="_blank">
          Microsoft
        </Item>
      </Menu>
    </MenuTrigger>
  );
};

export const WithTooltip = () => {
  return (
    <MenuTrigger>
      <TooltipTrigger>
        <ActionButton>Trigger</ActionButton>
        <Tooltip>Tooltip content</Tooltip>
      </TooltipTrigger>
      <Menu>
        <Item>One</Item>
        <Item>Two</Item>
        <Item>Three</Item>
      </Menu>
    </MenuTrigger>
  );
};

export const SectionsStatic = () =>
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
  );

SectionsStatic.story = {
  name: 'sections (static)',
};

export const SectionsDynamic = () => render(defaultMenu);

SectionsDynamic.story = {
  name: 'sections (dynamic)',
};

export const TitlelessSectionsStatic = () =>
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
  );

TitlelessSectionsStatic.story = {
  name: 'titleless sections (static)',
};

export const TitlelessSectionsDynamic = () =>
  render(
    <Menu items={withSection} onAction={action('onAction')}>
      {item => (
        <Section key={item.name} items={item.children} aria-label={item.name}>
          {item => <Item key={item.name}>{item.name}</Item>}
        </Section>
      )}
    </Menu>
  );

TitlelessSectionsDynamic.story = {
  name: 'titleless sections (dynamic)',
};

export const SelectionModeSingleControlledStatic = () =>
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
  );

SelectionModeSingleControlledStatic.story = {
  name: 'selectionMode="single" (controlled, static)',
};

export const SelectionModeSingleControlledDynamic = () =>
  render(
    defaultMenu,
    {},
    { selectedKeys: ['Kangaroo'], selectionMode: 'single' }
  );

SelectionModeSingleControlledDynamic.story = {
  name: 'selectionMode="single" (controlled, dynamic)',
};

export const SelectionModeSingleUncontrolledStatic = () =>
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
  );

SelectionModeSingleUncontrolledStatic.story = {
  name: 'selectionMode="single" (uncontrolled, static)',
};

export const SelectionModeSingleUncontrolledDynamic = () =>
  render(
    defaultMenu,
    {},
    { defaultSelectedKeys: ['Kangaroo'], selectionMode: 'single' }
  );

SelectionModeSingleUncontrolledDynamic.story = {
  name: 'selectionMode="single" (uncontrolled, dynamic)',
};

export const SelectionModeMultipleControlledStatic = () =>
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
  );

SelectionModeMultipleControlledStatic.story = {
  name: 'selectionMode="multiple" (controlled, static)',
};

export const SelectionModeMultipleControlledDynamic = () =>
  render(
    defaultMenu,
    {},
    { selectedKeys: ['Kangaroo', 'Echidna'], selectionMode: 'multiple' }
  );

SelectionModeMultipleControlledDynamic.story = {
  name: 'selectionMode="multiple" (controlled, dynamic)',
};

export const SelectionModeMultipleUncontrolledStatic = () =>
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
  );

SelectionModeMultipleUncontrolledStatic.story = {
  name: 'selectionMode="multiple" (uncontrolled, static)',
};

export const SelectionModeMultipleUncontrolledDynamic = () =>
  render(
    defaultMenu,
    {},
    {
      defaultSelectedKeys: ['Kangaroo', 'Echidna'],
      selectionMode: 'multiple',
    }
  );

SelectionModeMultipleUncontrolledDynamic.story = {
  name: 'selectionMode="multiple" (uncontrolled, dynamic)',
};

export const SelectionModeNone = () =>
  render(defaultMenu, {}, { selectionMode: 'none' });

SelectionModeNone.story = {
  name: 'selectionMode="none"',
};

export const DisabledBehaviorSelection = () =>
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
  );

DisabledBehaviorSelection.story = {
  name: 'disabledBehavior="selection"',
};

export const AutoFocusTrue = () => render(defaultMenu, {}, { autoFocus: true });

AutoFocusTrue.story = {
  name: 'autoFocus=true',
};

export const AutoFocusFalse = () =>
  render(defaultMenu, {}, { autoFocus: false });

AutoFocusFalse.story = {
  name: 'autoFocus=false',
};

export const AutoFocusTrueWithSelection = () =>
  render(
    defaultMenu,
    {},
    {
      autoFocus: true,
      selectionMode: 'single',
      defaultSelectedKeys: ['Kangaroo'],
    }
  );

AutoFocusTrueWithSelection.story = {
  name: 'autoFocus=true, with selection',
};

export const AutoFocusFirst = () =>
  render(defaultMenu, {}, { autoFocus: 'first' });

AutoFocusFirst.story = {
  name: 'autoFocus="first"',
};

export const AutoFocusLast = () =>
  render(defaultMenu, {}, { autoFocus: 'last' });

AutoFocusLast.story = {
  name: 'autoFocus="last"',
};

export const ShouldFocusWrapFalse = () =>
  render(defaultMenu, {}, { shouldFocusWrap: false });

ShouldFocusWrapFalse.story = {
  name: 'shouldFocusWrap=false',
};

export const IsOpen = () => render(defaultMenu, { isOpen: true });

IsOpen.story = {
  name: 'isOpen',
};

export const DefaultOpen = () => render(defaultMenu, { defaultOpen: true });

DefaultOpen.story = {
  name: 'defaultOpen',
};

export const DisabledTrigger = () => render(defaultMenu, { isDisabled: true });

DisabledTrigger.story = {
  name: 'disabled trigger',
};

export const CloseOnSelectFalse = () =>
  render(defaultMenu, { closeOnSelect: false }, {});

CloseOnSelectFalse.story = {
  name: 'closeOnSelect=false',
};

export const CloseOnSelectTrueMultiselect = () =>
  render(defaultMenu, { closeOnSelect: true }, { selectionMode: 'multiple' });

CloseOnSelectTrueMultiselect.story = {
  name: 'closeOnSelect=true, multiselect',
};

export const ComplexItemsStatic = (args: ArgTypes) =>
  render(
    <Menu
      selectionMode="multiple"
      defaultSelectedKeys={['bold', 'italic']}
      disabledKeys={['zoom-in', 'italic']}
      // disabledBehavior="selection"
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
          <Text slot="description">The description text for left is long</Text>
        </Item>
        <Item
          key="center"
          textValue="Center has a long label that will eventually wrap, but it's pretty ridiculous"
        >
          <Icon src={alignCenterVerticalIcon} />
          <Text>
            Center has a long label that will eventually wrap, but it's pretty
            ridiculous
          </Text>
        </Item>
        <Item key="right" textValue="Right">
          <Icon src={alignEndVerticalIcon} />
          <Text>Right</Text>
        </Item>
      </Section>
    </Menu>,
    args
  );

ComplexItemsStatic.args = {
  isOpen: true,
  shouldFlip: true,
  direction: 'bottom',
  align: 'start',
};
ComplexItemsStatic.argTypes = {
  direction: {
    control: 'select',
    options: ['top', 'bottom', 'left', 'right', 'start', 'end'],
  },
  align: {
    control: 'radio',
    options: ['start', 'end'],
  },
};

export const ComplexItemsDynamic = () =>
  render(
    <Menu items={complexOptions} onAction={action('onAction')}>
      {item => (
        <Section key={item.name} items={item.children} title={item.name}>
          {item => customMenuItem(item)}
        </Section>
      )}
    </Menu>
  );

ComplexItemsDynamic.story = {
  name: 'complex items (dynamic)',
};

export const MenuShouldPreventScrolling = () => (
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
          <ActionButton
            onPress={action('press')}
            onPressStart={action('pressstart')}
            onPressEnd={action('pressend')}
          >
            Trigger
          </ActionButton>
          <Menu items={withSection} onAction={action('action')}>
            {item => (
              <Section key={item.name} items={item.children} title={item.name}>
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
);

MenuShouldPreventScrolling.story = {
  name: 'menu should prevent scrolling',
};

export const MenuClosesOnBlur = () => (
  <>
    <div style={{ display: 'flex', width: 'auto', margin: '250px 0' }}>
      <label htmlFor="focus-before">Focus before</label>
      <input id="focus-before" />
      <MenuTrigger onOpenChange={action('onOpenChange')}>
        <ActionButton
          onPress={action('press')}
          onPressStart={action('pressstart')}
          onPressEnd={action('pressend')}
        >
          Trigger
        </ActionButton>
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
);

MenuClosesOnBlur.story = {
  name: 'menu closes on blur',
};

export const WithFalsyKey = () =>
  render(
    <Menu onAction={action('onAction')}>
      <Item key="1">One</Item>
      <Item key="">Two</Item>
      <Item key="3">Three</Item>
    </Menu>
  );

WithFalsyKey.story = {
  name: 'with falsy key',
};

export const MenuTriggerWithTriggerLongPress = () =>
  render(defaultMenu, { trigger: 'longPress' });

MenuTriggerWithTriggerLongPress.story = {
  name: 'MenuTrigger with trigger="longPress"',
};

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
      <ActionButton
        isDisabled={isDisabled}
        onPress={action('press')}
        onPressStart={action('pressstart')}
        onPressEnd={action('pressend')}
      >
        Trigger
      </ActionButton>
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
