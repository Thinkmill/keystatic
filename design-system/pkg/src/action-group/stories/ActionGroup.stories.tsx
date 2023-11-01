import { action } from '@keystar/ui-storybook';

import { alignCenterIcon } from '@keystar/ui/icon/icons/alignCenterIcon';
import { alignJustifyIcon } from '@keystar/ui/icon/icons/alignJustifyIcon';
import { alignLeftIcon } from '@keystar/ui/icon/icons/alignLeftIcon';
import { alignRightIcon } from '@keystar/ui/icon/icons/alignRightIcon';
import { boldIcon } from '@keystar/ui/icon/icons/boldIcon';
import { italicIcon } from '@keystar/ui/icon/icons/italicIcon';
import { strikethroughIcon } from '@keystar/ui/icon/icons/strikethroughIcon';
import { underlineIcon } from '@keystar/ui/icon/icons/underlineIcon';
import { subscriptIcon } from '@keystar/ui/icon/icons/subscriptIcon';
import { superscriptIcon } from '@keystar/ui/icon/icons/superscriptIcon';
import { typeIcon } from '@keystar/ui/icon/icons/typeIcon';
import { editIcon } from '@keystar/ui/icon/icons/editIcon';
import { copyIcon } from '@keystar/ui/icon/icons/copyIcon';
import { trash2Icon } from '@keystar/ui/icon/icons/trash2Icon';
import { plusIcon } from '@keystar/ui/icon/icons/plusIcon';
import { Icon } from '@keystar/ui/icon';
import { Flex } from '@keystar/ui/layout';
import { Tooltip, TooltipTrigger } from '@keystar/ui/tooltip';
import { Kbd, Text } from '@keystar/ui/typography';
import { PropsWithChildren } from 'react';

import { ActionGroup, ActionGroupProps, Item } from '..';
import { css } from '@keystar/ui/style';

let onSelectionChange = action('onSelectionChange');
const formattingItems = [
  { children: 'Bold', name: '1' },
  { children: 'Italic', name: '2' },
  { children: 'Underline', name: '3' },
  { children: 'Strikethrough', name: '4' },
];
const editItems = [
  { children: 'Add', name: '1' },
  { children: 'Edit', name: '2' },
  { children: 'Delete', name: '3' },
];
let iconMap = {
  alignCenterIcon,
  alignJustifyIcon,
  alignLeftIcon,
  alignRightIcon,
  boldIcon,
  italicIcon,
  strikethroughIcon,
  underlineIcon,
  subscriptIcon,
  superscriptIcon,

  Bold: boldIcon,
  Italic: italicIcon,
  Underline: underlineIcon,
  Strikethrough: strikethroughIcon,

  Add: plusIcon,
  Edit: editIcon,
  Copy: copyIcon,
  Delete: trash2Icon,
};

export default {
  title: 'Components/ActionGroup',
};

export const Default = () => (
  <ActionGroup onAction={action('onAction')}>
    <Item key="add">Add</Item>
    <Item key="delete">Delete</Item>
    <Item key="edit">Edit</Item>
  </ActionGroup>
);

Default.story = {
  name: 'default',
};

export const ProminenceLow = () => (
  <ActionGroup prominence="low" onAction={action('onAction')}>
    <Item key="add">Add</Item>
    <Item key="delete">Delete</Item>
    <Item key="edit">Edit</Item>
  </ActionGroup>
);

ProminenceLow.story = {
  name: 'prominence=low',
};

export const Links = () => (
  <ActionGroup>
    <Item href="https://apple.com/" target="_blank">
      Apple
    </Item>
    <Item href="https://google.com/" target="_blank">
      Google
    </Item>
    <Item href="https://microsoft.com/" target="_blank">
      Microsoft
    </Item>
  </ActionGroup>
);

Links.story = {
  name: 'links',
};

export const DisabledGroup = () =>
  render({ isDisabled: true, defaultSelectedKeys: ['1'] }, editItems);

DisabledGroup.story = {
  name: 'disabled group',
};

export const DisabledKeys = () =>
  render({ disabledKeys: ['1', '2'] }, editItems);

DisabledKeys.story = {
  name: 'disabled keys',
};

export const Compact = () =>
  render({ density: 'compact', defaultSelectedKeys: ['1'] }, editItems);

Compact.story = {
  name: 'compact',
};

export const CompactProminenceLow = () =>
  render(
    { density: 'compact', prominence: 'low', defaultSelectedKeys: ['1'] },
    editItems
  );

CompactProminenceLow.story = {
  name: 'compact, prominence=low',
};

export const IsJustified = () =>
  render({ isJustified: true, defaultSelectedKeys: ['1'] }, editItems);

IsJustified.story = {
  name: 'isJustified',
};

export const CompactIsJustified = () =>
  render(
    { density: 'compact', isJustified: true, defaultSelectedKeys: ['1'] },
    editItems
  );

CompactIsJustified.story = {
  name: 'compact, isJustified',
};

export const SelectionModeMultiple = () =>
  render(
    { selectionMode: 'multiple', defaultSelectedKeys: ['1', '2'] },
    formattingItems
  );

SelectionModeMultiple.story = {
  name: 'selectionMode: multiple',
};

export const SelectionModeSingleDisallowEmptySelection = () =>
  render(
    {
      selectionMode: 'single',
      disallowEmptySelection: true,
      defaultSelectedKeys: ['1'],
    },
    formattingItems
  );

SelectionModeSingleDisallowEmptySelection.story = {
  name: 'selectionMode: single, disallowEmptySelection',
};

export const SelectionModeMultipleCompact = () =>
  render(
    {
      density: 'compact',
      selectionMode: 'multiple',
      defaultSelectedKeys: ['1', '2'],
    },
    formattingItems
  );

SelectionModeMultipleCompact.story = {
  name: 'selectionMode: multiple, compact',
};

export const DynamicDefault = () => (
  <ActionGroup onAction={action('onAction')} items={editItems}>
    {item => (
      <Item key={item.name} textValue={item.name}>
        {item.children}
      </Item>
    )}
  </ActionGroup>
);

DynamicDefault.story = {
  name: 'dynamic default',
};

export const DynamicSingleSelection = () => (
  <ActionGroup
    selectionMode="single"
    defaultSelectedKeys={['1']}
    onSelectionChange={s => onSelectionChange([...s])}
    items={editItems}
  >
    {item => (
      <Item key={item.name} textValue={item.name}>
        {item.children}
      </Item>
    )}
  </ActionGroup>
);

DynamicSingleSelection.story = {
  name: 'dynamic single selection',
};

export const ManualTooltips = () => renderTooltips({});

ManualTooltips.story = {
  name: 'manual tooltips',
};

export const OverflowModeWrap = () => (
  <Resize>
    <ActionGroup overflowMode="wrap" onAction={action('onAction')}>
      <Item key="bold">
        <Icon src={boldIcon} />
        <Text>Bold</Text>
      </Item>
      <Item key="italic">
        <Icon src={italicIcon} />
        <Text>Italic</Text>
      </Item>
      <Item key="underline">
        <Icon src={underlineIcon} />
        <Text>Underline</Text>
      </Item>
      <Item key="strike">
        <Icon src={strikethroughIcon} />
        <Text>Strikethrough</Text>
      </Item>
    </ActionGroup>
  </Resize>
);

OverflowModeWrap.story = {
  name: 'overflowMode: wrap',
};

export const OverflowModeCollapse = () => (
  <Resize>
    <ActionGroup overflowMode="collapse" onAction={action('onAction')}>
      <Item key="bold">
        <Icon src={boldIcon} />
        <Text>Bold</Text>
        <Kbd meta>B</Kbd>
      </Item>
      <Item key="italic">
        <Icon src={italicIcon} />
        <Text>Italic</Text>
        <Kbd meta>I</Kbd>
      </Item>
      <Item key="underline">
        <Icon src={underlineIcon} />
        <Text>Underline</Text>
      </Item>
      <Item key="strike">
        <Icon src={strikethroughIcon} />
        <Text>Strikethrough</Text>
      </Item>
    </ActionGroup>
  </Resize>
);

OverflowModeCollapse.story = {
  name: 'overflowMode: collapse',
};

export const CollapseWithLinks = () => (
  <Resize>
    <ActionGroup overflowMode="collapse">
      <Item href="https://apple.com/" target="_blank">
        Apple
      </Item>
      <Item href="https://google.com/" target="_blank">
        Google
      </Item>
      <Item href="https://microsoft.com/" target="_blank">
        Microsoft
      </Item>
    </ActionGroup>
  </Resize>
);

CollapseWithLinks.story = {
  name: 'overflowMode: collapse + links',
};

export const ButtonLabelBehaviorHide = () => (
  <Resize>
    <ActionGroup
      overflowMode="collapse"
      buttonLabelBehavior="hide"
      onAction={action('onAction')}
    >
      <Item key="bold">
        <Icon src={boldIcon} />
        <Text>Bold</Text>
        <Kbd meta>B</Kbd>
      </Item>
      <Item key="italic">
        <Icon src={italicIcon} />
        <Text>Italic</Text>
        <Kbd meta>I</Kbd>
      </Item>
      <Item key="underline">
        <Icon src={underlineIcon} />
        <Text>Underline</Text>
      </Item>
      <Item key="strike">
        <Icon src={strikethroughIcon} />
        <Text>Strikethrough</Text>
      </Item>
    </ActionGroup>
  </Resize>
);

ButtonLabelBehaviorHide.story = {
  name: 'buttonLabelBehavior: hide',
};

export const ButtonLabelBehaviorCollapse = () => (
  <Resize>
    <ActionGroup
      overflowMode="collapse"
      buttonLabelBehavior="collapse"
      onAction={action('onAction')}
    >
      <Item key="bold">
        <Icon src={boldIcon} />
        <Text>Bold</Text>
        <Kbd meta>B</Kbd>
      </Item>
      <Item key="italic">
        <Icon src={italicIcon} />
        <Text>Italic</Text>
        <Kbd meta>I</Kbd>
      </Item>
      <Item key="underline">
        <Icon src={underlineIcon} />
        <Text>Underline</Text>
      </Item>
      <Item key="strike">
        <Icon src={strikethroughIcon} />
        <Text>Strikethrough</Text>
      </Item>
    </ActionGroup>
  </Resize>
);

ButtonLabelBehaviorCollapse.story = {
  name: 'buttonLabelBehavior: collapse',
};

export const OverflowModeCollapseSelection = () => (
  <Resize>
    {renderCollapsibleFormatting({ prominence: 'low' })}
    {renderCollapsibleAlignment({ prominence: 'low' })}
  </Resize>
);

OverflowModeCollapseSelection.story = {
  name: 'overflowMode: collapse, selection',
};

export const CollapseDense = () => (
  <Resize>
    {renderCollapsibleFormatting({ density: 'compact' })}
    {renderCollapsibleAlignment({ density: 'compact' })}
  </Resize>
);

CollapseDense.story = {
  name: 'collapse: dense',
};

export const OverflowModeCollapseSummaryIcon = () => (
  <Resize>
    {renderCollapsibleFormatting({
      density: 'compact',
      summaryIcon: <Icon src={typeIcon} />,
    })}
    {renderCollapsibleAlignment({ density: 'compact' })}
  </Resize>
);

OverflowModeCollapseSummaryIcon.story = {
  name: 'overflowMode: collapse, summaryIcon',
};

const Resize = ({
  direction = 'horizontal',
  dimension: dimensionValue = 250,
  ...props
}: PropsWithChildren<{
  direction?: 'horizontal' | 'vertical';
  dimension?: number | string;
}>) => {
  let dimension = direction === 'horizontal' ? 'width' : 'height';
  return (
    <Flex
      gap="large"
      backgroundColor="surface"
      padding="large"
      overflow="auto"
      UNSAFE_className={css({
        '& > *': {
          flexShrink: 1,
          minWidth: 0,
        },
      })}
      UNSAFE_style={{ resize: direction, [dimension]: dimensionValue }}
      {...props}
    />
  );
};

function render<T extends object>(
  props: Partial<ActionGroupProps<T>>,
  items = editItems
) {
  return (
    <Flex gap="large" direction="column">
      {renderText(props, items)}
      {renderBoth(props, items)}
      {renderIcons(props, items)}
    </Flex>
  );
}

function renderText<T extends object>(
  props: Partial<ActionGroupProps<T>>,
  items = editItems
) {
  return (
    <ActionGroup
      selectionMode="single"
      onSelectionChange={s => onSelectionChange([...s])}
      {...props}
    >
      {items.map(itemProps => (
        <Item key={itemProps.name} textValue={itemProps.name} {...itemProps} />
      ))}
    </ActionGroup>
  );
}

function renderBoth<T extends object>(
  props: Partial<ActionGroupProps<T>>,
  items = editItems
) {
  return (
    <ActionGroup
      selectionMode="single"
      onSelectionChange={s => onSelectionChange([...s])}
      {...props}
    >
      {items.map(itemProps => {
        let icon = iconMap[itemProps.children as keyof typeof iconMap];
        return (
          <Item
            key={itemProps.name}
            textValue={itemProps.name}
            aria-label={itemProps.children}
          >
            <Icon src={icon} />
            <Text>{itemProps.children}</Text>
          </Item>
        );
      })}
    </ActionGroup>
  );
}

function renderIcons<T extends object>(
  props: Partial<ActionGroupProps<T>>,
  items = editItems
) {
  return (
    <ActionGroup
      selectionMode="single"
      onSelectionChange={s => onSelectionChange([...s])}
      {...props}
    >
      {items.map(itemProps => {
        let icon = iconMap[itemProps.children as keyof typeof iconMap];
        return (
          <Item
            key={itemProps.name}
            textValue={itemProps.name}
            aria-label={itemProps.children}
          >
            <Icon src={icon} />
          </Item>
        );
      })}
    </ActionGroup>
  );
}

function renderTooltips<T extends object>(
  props: Partial<ActionGroupProps<T>>,
  items = formattingItems
) {
  return (
    <ActionGroup
      selectionMode="single"
      onSelectionChange={s => onSelectionChange([...s])}
      {...props}
    >
      {items.map(itemProps => {
        let icon = iconMap[itemProps.children as keyof typeof iconMap];
        return (
          <TooltipTrigger key={itemProps.name}>
            <Item
              textValue={itemProps.children}
              aria-label={itemProps.children}
            >
              <Icon src={icon} />
            </Item>
            <Tooltip>{itemProps.children}</Tooltip>
          </TooltipTrigger>
        );
      })}
    </ActionGroup>
  );
}

function renderCollapsibleFormatting(props = {}) {
  return (
    <ActionGroup
      aria-label="Text style"
      overflowMode="collapse"
      selectionMode="multiple"
      onSelectionChange={action('onSelectionChange')}
      buttonLabelBehavior="hide"
      {...props}
    >
      <Item key="bold">
        <Icon src={boldIcon} />
        <Text>Bold</Text>
        <Kbd meta>B</Kbd>
      </Item>
      <Item key="italic">
        <Icon src={italicIcon} />
        <Text>Italic</Text>
        <Kbd meta>I</Kbd>
      </Item>
      <Item key="underline">
        <Icon src={underlineIcon} />
        <Text>Underline</Text>
      </Item>
      <Item key="strike">
        <Icon src={strikethroughIcon} />
        <Text>Strikethrough</Text>
      </Item>
    </ActionGroup>
  );
}

function renderCollapsibleAlignment(props = {}) {
  return (
    <ActionGroup
      aria-label="Text alignment"
      overflowMode="collapse"
      selectionMode="single"
      defaultSelectedKeys={['left']}
      disallowEmptySelection
      onSelectionChange={action('onSelectionChange')}
      buttonLabelBehavior="hide"
      {...props}
    >
      <Item key="left">
        <Icon src={alignLeftIcon} />
        <Text>Align Left</Text>
      </Item>
      <Item key="center">
        <Icon src={alignCenterIcon} />
        <Text>Align Center</Text>
      </Item>
      <Item key="right">
        <Text>Align Right</Text>
        <Icon src={alignRightIcon} />
      </Item>
      <Item key="justify">
        <Icon src={alignJustifyIcon} />
        <Text>Justify</Text>
      </Item>
    </ActionGroup>
  );
}
