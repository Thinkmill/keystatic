import { Alignment } from '@react-types/shared';
import { action, Meta } from '@keystar/ui-storybook';
import React, { useState } from 'react';

import { Checkbox } from '@keystar/ui/checkbox';
import { Flex } from '@keystar/ui/layout';
import { Picker } from '@keystar/ui/picker';
import { Tooltip, TooltipTrigger } from '@keystar/ui/tooltip';

import { ActionMenuProps, ActionMenu, Item } from '..';

const meta: Meta<ActionMenuProps<object>> = {
  title: 'Components/ActionMenu',
  component: ActionMenu,
};

export default meta;

const Template = <T extends object>(args: ActionMenuProps<T>) => (
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

  const handleAlignChange = (key: string) => {
    if (isOfAlignment(key)) {
      setAlignment(key);
    }
  };

  const handleDirectionChange = (key: string) => {
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
        onSelectionChange={key => handleAlignChange(String(key))}
      >
        {item => <Item key={item.key}>{item.label}</Item>}
      </Picker>
      <Picker
        label="Direction"
        items={directionItems}
        selectedKey={direction}
        onSelectionChange={key => handleDirectionChange(String(key))}
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

export const Default = {
  render: Template,
  args: {},
};

export const AriaLabel = {
  render: Template,
  args: { 'aria-label': 'Some more actions' },
};

export const DOMId = {
  render: Template,
  args: { id: 'my-action-menu' },
};

export const LowProminence = {
  render: Template,
  args: { prominence: 'low' },
};

export const Disabled = {
  render: Template,
  args: { isDisabled: true },
};

export const DisabledKeys = {
  render: Template,
  args: { disabledKeys: ['two'] },
};

export const AutoFocus = {
  render: Template,
  args: { autoFocus: true },
};

export const DefaultOpen = {
  render: Template,
  args: { onOpenChange: action('openChange'), defaultOpen: true },
};

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
    { key: 'cut', label: 'Cut' },
    { key: 'copy', label: 'Copy' },
    { key: 'paste', label: 'Paste' },
  ];

  return (
    <ActionMenu items={items}>
      {item => <Item key={item.key}>{item.label}</Item>}
    </ActionMenu>
  );
};
