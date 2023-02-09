import { Alignment } from '@react-types/shared';
import { action } from '@storybook/addon-actions';
import { Meta, Story } from '@storybook/react';
import React, { Key, useState } from 'react';

import { Checkbox } from '@voussoir/checkbox';
import { Flex } from '@voussoir/layout';
import { Picker } from '@voussoir/picker';
import { Tooltip, TooltipTrigger } from '@voussoir/tooltip';

import { ActionMenuProps, ActionMenu, Item } from '../src';

const meta: Meta<ActionMenuProps<object>> = {
  title: 'Components/ActionMenu',
  component: ActionMenu,
};

export default meta;

const Template =
  <T extends object>(): Story<ActionMenuProps<T>> =>
  args =>
    (
      <ActionMenu onAction={action('action')} {...args}>
        <Item key="one">One</Item>
        <Item key="two">Two</Item>
        <Item key="three">Three</Item>
      </ActionMenu>
    );

type Direction = 'bottom' | 'top' | 'left' | 'right' | 'start' | 'end';
const directionItems = [
  {
    key: 'bottom',
    label: 'Bottom',
  },
  {
    key: 'top',
    label: 'Top',
  },
  {
    key: 'left',
    label: 'Left',
  },
  {
    key: 'right',
    label: 'Right',
  },
  {
    key: 'start',
    label: 'Start',
  },
  {
    key: 'end',
    label: 'End',
  },
];
const alignItems = [
  {
    key: 'start',
    label: 'Start',
  },
  {
    key: 'end',
    label: 'End',
  },
];

function isOfDirection(key: string): key is Direction {
  return directionItems.map(e => e.key).includes(key);
}

function isOfAlignment(key: string): key is Alignment {
  return alignItems.map(e => e.key).includes(key);
}

function DirectionAlignment() {
  const [align, setAlignment] = useState<Alignment>('start');
  const [direction, setDirection] = useState<Direction>('bottom');
  const [shouldFlip, setShouldFlip] = useState(true);

  const handleAlignChange = (key: Key) => {
    key = key.toString();
    if (isOfAlignment(key)) {
      setAlignment(key);
    }
  };

  const handleDirectionChange = (key: Key) => {
    key = key.toString();
    if (isOfDirection(key)) {
      setDirection(key);
    }
  };

  return (
    <Flex alignItems="end" gap="regular" wrap>
      <Picker
        label="Align"
        items={alignItems}
        selectedKey={align}
        onSelectionChange={handleAlignChange}
      >
        {item => <Item key={item.key}>{item.label}</Item>}
      </Picker>
      <Picker
        label="Direction"
        items={directionItems}
        selectedKey={direction}
        onSelectionChange={handleDirectionChange}
      >
        {item => <Item key={item.key}>{item.label}</Item>}
      </Picker>
      <Checkbox isSelected={shouldFlip} onChange={setShouldFlip}>
        Should Flip
      </Checkbox>
      <ActionMenu
        onAction={action('action')}
        align={align}
        direction={direction}
        shouldFlip={shouldFlip}
      >
        <Item key="one">One</Item>
        <Item key="two">Two</Item>
        <Item key="three">Three</Item>
      </ActionMenu>
    </Flex>
  );
}

export const Default = Template().bind({});
Default.args = {};

export const AriaLabel = Template().bind({});
AriaLabel.args = { 'aria-label': 'Some more actions' };

export const DOMId = Template().bind({});
DOMId.args = { id: 'my-action-menu' };

export const Prominence = Template().bind({});
Prominence.args = { prominence: 'low' };

export const Disabled = Template().bind({});
Disabled.args = { isDisabled: true };

export const DisabledKeys = Template().bind({});
DisabledKeys.args = { disabledKeys: ['two'] };

export const AutoFocus = Template().bind({});
AutoFocus.args = { autoFocus: true };

export const DefaultOpen = Template().bind({});
DefaultOpen.args = { onOpenChange: action('openChange'), defaultOpen: true };

export const ControlledOpen = () => {
  let [open, setOpen] = React.useState(false);

  return (
    <ActionMenu
      isOpen={open}
      onOpenChange={setOpen}
      onAction={action('action')}
    >
      <Item key="cut">Cut</Item>
      <Item key="copy">Copy</Item>
      <Item key="paste">Paste</Item>
    </ActionMenu>
  );
};

export const DirectionAlignFlip = () => <DirectionAlignment />;

export const WithTooltip = () => (
  <TooltipTrigger delay={0}>
    <ActionMenu>
      <Item key="cut">Cut</Item>
      <Item key="copy">Copy</Item>
      <Item key="paste">Paste</Item>
    </ActionMenu>
    <Tooltip>Actions</Tooltip>
  </TooltipTrigger>
);

export const Dynamic = () => {
  const items = [
    { id: 'a', label: 'Cut' },
    { id: 'b', label: 'Copy' },
    { id: 'c', label: 'Paste' },
  ];

  return (
    <ActionMenu items={items}>{item => <Item>{item.label}</Item>}</ActionMenu>
  );
};
