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

import {
  Menu,
  MenuCollection,
  MenuHeader,
  MenuItem,
  MenuSection,
  MenuTrigger,
} from '../index';

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
    name: 'MenuSection 1',
    children: [
      { name: 'Bold', icon: 'TextBoldIcon', shortcut: '⌘B' },
      { name: 'Italic', icon: 'TextItalicIcon', shortcut: '⌘I' },
    ],
  },
  {
    name: 'MenuSection 2',
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
      <MenuItem>One</MenuItem>
      <MenuItem>Two</MenuItem>
      <MenuItem>Three</MenuItem>
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
      {item => <MenuItem id={item.name}>{item.name}</MenuItem>}
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
        <MenuItem href="https://apple.com/" target="_blank">
          Apple
        </MenuItem>
        <MenuItem href="https://google.com/" target="_blank">
          Google
        </MenuItem>
        <MenuItem href="https://microsoft.com/" target="_blank">
          Microsoft
        </MenuItem>
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
        <MenuItem>One</MenuItem>
        <MenuItem>Two</MenuItem>
        <MenuItem>Three</MenuItem>
      </Menu>
    </MenuTrigger>
  );
};

export const SectionsStatic = () =>
  render(
    <Menu onAction={action('onAction')}>
      <MenuSection>
        <MenuHeader>Marsupials</MenuHeader>
        <MenuItem>Bilby</MenuItem>
        <MenuItem>Kangaroo</MenuItem>
        <MenuItem>Quokka</MenuItem>
      </MenuSection>
      <MenuSection>
        <MenuHeader>Other</MenuHeader>
        <MenuItem>Echidna</MenuItem>
        <MenuItem>Dingo</MenuItem>
        <MenuItem>Cassowary</MenuItem>
      </MenuSection>
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
      <MenuSection aria-label="Marsupials">
        <MenuItem>Bilby</MenuItem>
        <MenuItem>Kangaroo</MenuItem>
        <MenuItem>Quokka</MenuItem>
      </MenuSection>
      <MenuSection aria-label="Other">
        <MenuItem>Echidna</MenuItem>
        <MenuItem>Dingo</MenuItem>
        <MenuItem>Cassowary</MenuItem>
      </MenuSection>
    </Menu>
  );

TitlelessSectionsStatic.story = {
  name: 'titleless sections (static)',
};

export const TitlelessSectionsDynamic = () =>
  render(
    <Menu items={withSection} onAction={action('onAction')}>
      {item => (
        <MenuSection id={item.name} aria-label={item.name}>
          <MenuCollection items={item.children}>
            {item => <MenuItem id={item.name}>{item.name}</MenuItem>}
          </MenuCollection>
        </MenuSection>
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
      <MenuSection>
        <MenuHeader>MenuSection 1</MenuHeader>
        <MenuItem id="1">One</MenuItem>
        <MenuItem id="2">Two</MenuItem>
        <MenuItem id="3">Three</MenuItem>
      </MenuSection>
      <MenuSection>
        <MenuHeader>MenuSection 2</MenuHeader>
        <MenuItem id="4">Four</MenuItem>
        <MenuItem id="5">Five</MenuItem>
        <MenuItem id="6">Six</MenuItem>
        <MenuItem id="7">Seven</MenuItem>
      </MenuSection>
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
      <MenuSection>
        <MenuHeader>MenuSection 1</MenuHeader>
        <MenuItem id="1">One</MenuItem>
        <MenuItem id="2">Two</MenuItem>
        <MenuItem id="3">Three</MenuItem>
      </MenuSection>
      <MenuSection>
        <MenuHeader>MenuSection 2</MenuHeader>
        <MenuItem id="4">Four</MenuItem>
        <MenuItem id="5">Five</MenuItem>
        <MenuItem id="6">Six</MenuItem>
        <MenuItem id="7">Seven</MenuItem>
      </MenuSection>
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
      <MenuSection>
        <MenuHeader>MenuSection 1</MenuHeader>
        <MenuItem id="1">One</MenuItem>
        <MenuItem id="2">Two</MenuItem>
        <MenuItem id="3">Three</MenuItem>
      </MenuSection>
      <MenuSection>
        <MenuHeader>MenuSection 2</MenuHeader>
        <MenuItem id="4">Four</MenuItem>
        <MenuItem id="5">Five</MenuItem>
        <MenuItem id="6">Six</MenuItem>
      </MenuSection>
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
      <MenuSection>
        <MenuHeader>MenuSection 1</MenuHeader>
        <MenuItem id="1">One</MenuItem>
        <MenuItem id="2">Two</MenuItem>
        <MenuItem id="3">Three</MenuItem>
      </MenuSection>
      <MenuSection>
        <MenuHeader>MenuSection 2</MenuHeader>
        <MenuItem id="4">Four</MenuItem>
        <MenuItem id="5">Five</MenuItem>
        <MenuItem id="6">Six</MenuItem>
      </MenuSection>
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
      onAction={action('onAction')}
    >
      <MenuSection>
        <MenuHeader>Selectable</MenuHeader>
        <MenuItem id="selectable-one">One</MenuItem>
        <MenuItem id="selectable-two">Two</MenuItem>
        <MenuItem id="selectable-three">Three</MenuItem>
      </MenuSection>
      <MenuSection>
        <MenuHeader>Actionable</MenuHeader>
        <MenuItem id="actionable-four">Four</MenuItem>
        <MenuItem id="actionable-five">Five</MenuItem>
        <MenuItem id="actionable-six">Six</MenuItem>
      </MenuSection>
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
      <MenuSection>
        <MenuHeader>MenuSection 1</MenuHeader>
        <MenuItem id="bold" textValue="Bold">
          <Icon src={boldIcon} />
          <Text>Bold</Text>
          <Kbd meta>B</Kbd>
        </MenuItem>
        <MenuItem id="italic" textValue="Italic">
          <Icon src={italicIcon} />
          <Text>Italic</Text>
          <Kbd meta>I</Kbd>
        </MenuItem>
      </MenuSection>
      <MenuSection>
        <MenuHeader>MenuSection 2</MenuHeader>
        <MenuItem id="zoom-in" textValue="Zoom in">
          <Text>Zoom in</Text>
          <Kbd meta>+</Kbd>
        </MenuItem>
        <MenuItem id="zoom-out" textValue="Zoom out">
          <Text>Zoom out</Text>
          <Kbd meta>-</Kbd>
        </MenuItem>
        <MenuItem id="zoom-full" textValue="Zoom to 100%">
          <Text>Zoom to 100%</Text>
          <Kbd meta shift>
            0
          </Kbd>
        </MenuItem>
      </MenuSection>
      <MenuSection>
        <MenuHeader>MenuSection 3</MenuHeader>
        <MenuItem id="left" textValue="Left">
          <Icon src={alignStartVerticalIcon} />
          <Text>Left</Text>
          <Text slot="description">The description text for left is long</Text>
        </MenuItem>
        <MenuItem
          key="center"
          textValue="Center has a long label that will eventually wrap, but it's pretty ridiculous"
        >
          <Icon src={alignCenterVerticalIcon} />
          <Text>
            Center has a long label that will eventually wrap, but it's pretty
            ridiculous
          </Text>
        </MenuItem>
        <MenuItem id="right" textValue="Right">
          <Icon src={alignEndVerticalIcon} />
          <Text>Right</Text>
        </MenuItem>
      </MenuSection>
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
        <MenuSection id={item.name}>
          <MenuHeader>{item.name}</MenuHeader>
          <MenuCollection items={item.children}>
            {item => customMenuItem(item)}
          </MenuCollection>
        </MenuSection>
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
              <MenuSection id={item.name}>
                <MenuHeader>{item.name}</MenuHeader>
                <MenuCollection items={item.children}>
                  {item => <MenuItem id={item.name}>{item.name}</MenuItem>}
                </MenuCollection>
              </MenuSection>
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
            <MenuSection id={item.name}>
              <MenuHeader>{item.name}</MenuHeader>
              <MenuCollection items={item.children}>
                {item => <MenuItem id={item.name}>{item.name}</MenuItem>}
              </MenuCollection>
            </MenuSection>
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
      <MenuItem id="1">One</MenuItem>
      <MenuItem id="">Two</MenuItem>
      <MenuItem id="3">Three</MenuItem>
    </Menu>
  );

WithFalsyKey.story = {
  name: 'with falsy key',
};

// .add('controlled isOpen', () => <ControlledOpeningMenuTrigger />)

let customMenuItem = (item: any) => {
  let icon = iconMap[item.icon as keyof typeof iconMap];
  return (
    <MenuItem id={item.name} textValue={item.name}>
      {item.icon && <Icon src={icon} />}
      <Text>{item.name}</Text>
      {item.shortcut && <Kbd>{item.shortcut}</Kbd>}
    </MenuItem>
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
      <MenuSection id={item.name}>
        <MenuHeader>{item.name}</MenuHeader>
        <MenuCollection items={item.children}>
          {(item: any) => <MenuItem id={item.name}>{item.name}</MenuItem>}
        </MenuCollection>
      </MenuSection>
    )}
  </Menu>
);
