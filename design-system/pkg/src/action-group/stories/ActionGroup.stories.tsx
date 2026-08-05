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

import { ActionGroup, ActionGroupProps, ActionGroupItem } from '..';
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
    <ActionGroupItem id="add">Add</ActionGroupItem>
    <ActionGroupItem id="delete">Delete</ActionGroupItem>
    <ActionGroupItem id="edit">Edit</ActionGroupItem>
  </ActionGroup>
);

Default.story = {
  name: 'default',
};

export const ProminenceLow = () => (
  <ActionGroup prominence="low" onAction={action('onAction')}>
    <ActionGroupItem id="add">Add</ActionGroupItem>
    <ActionGroupItem id="delete">Delete</ActionGroupItem>
    <ActionGroupItem id="edit">Edit</ActionGroupItem>
  </ActionGroup>
);

ProminenceLow.story = {
  name: 'prominence=low',
};

export const Links = () => (
  <ActionGroup>
    <ActionGroupItem id="apple" href="https://apple.com/" target="_blank">
      Apple
    </ActionGroupItem>
    <ActionGroupItem id="google" href="https://google.com/" target="_blank">
      Google
    </ActionGroupItem>
    <ActionGroupItem
      id="microsoft"
      href="https://microsoft.com/"
      target="_blank"
    >
      Microsoft
    </ActionGroupItem>
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
      <ActionGroupItem id={item.name} textValue={item.name}>
        {item.children}
      </ActionGroupItem>
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
      <ActionGroupItem id={item.name} textValue={item.name}>
        {item.children}
      </ActionGroupItem>
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
      <ActionGroupItem id="bold">
        <Icon src={boldIcon} />
        <Text>Bold</Text>
      </ActionGroupItem>
      <ActionGroupItem id="italic">
        <Icon src={italicIcon} />
        <Text>Italic</Text>
      </ActionGroupItem>
      <ActionGroupItem id="underline">
        <Icon src={underlineIcon} />
        <Text>Underline</Text>
      </ActionGroupItem>
      <ActionGroupItem id="strike">
        <Icon src={strikethroughIcon} />
        <Text>Strikethrough</Text>
      </ActionGroupItem>
    </ActionGroup>
  </Resize>
);

OverflowModeWrap.story = {
  name: 'overflowMode: wrap',
};

export const OverflowModeCollapse = () => (
  <Resize>
    <ActionGroup
      overflowMode="collapse"
      items={formattingItems}
      onAction={action('onAction')}
    >
      {item => (
        <ActionGroupItem id={item.name} textValue={item.children}>
          <Icon src={iconMap[item.children as keyof typeof iconMap]} />
          <Text>{item.children}</Text>
        </ActionGroupItem>
      )}
    </ActionGroup>
  </Resize>
);

OverflowModeCollapse.story = {
  name: 'overflowMode: collapse',
};

export const CollapseWithLinks = () => (
  <Resize>
    <ActionGroup
      overflowMode="collapse"
      items={[
        { id: 'apple', label: 'Apple', href: 'https://apple.com/' },
        { id: 'google', label: 'Google', href: 'https://google.com/' },
        {
          id: 'microsoft',
          label: 'Microsoft',
          href: 'https://microsoft.com/',
        },
      ]}
    >
      {item => (
        <ActionGroupItem
          id={item.id}
          href={item.href}
          target="_blank"
          textValue={item.label}
        >
          {item.label}
        </ActionGroupItem>
      )}
    </ActionGroup>
  </Resize>
);

CollapseWithLinks.story = {
  name: 'overflowMode: collapse + links',
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
        <ActionGroupItem
          id={itemProps.name}
          textValue={itemProps.name}
          {...itemProps}
        />
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
          <ActionGroupItem
            id={itemProps.name}
            textValue={itemProps.name}
            aria-label={itemProps.children}
          >
            <Icon src={icon} />
            <Text>{itemProps.children}</Text>
          </ActionGroupItem>
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
          <ActionGroupItem
            id={itemProps.name}
            textValue={itemProps.name}
            aria-label={itemProps.children}
          >
            <Icon src={icon} />
          </ActionGroupItem>
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
            <ActionGroupItem
              id={itemProps.name}
              textValue={itemProps.children}
              aria-label={itemProps.children}
            >
              <Icon src={icon} />
            </ActionGroupItem>
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
      items={formattingItems}
      overflowMode="collapse"
      selectionMode="multiple"
      onSelectionChange={action('onSelectionChange')}
      {...props}
    >
      {item => (
        <ActionGroupItem id={item.name} textValue={item.children}>
          <Icon src={iconMap[item.children as keyof typeof iconMap]} />
          <Text>{item.children}</Text>
        </ActionGroupItem>
      )}
    </ActionGroup>
  );
}

function renderCollapsibleAlignment(props = {}) {
  return (
    <ActionGroup
      aria-label="Text alignment"
      items={[
        { id: 'left', label: 'Align Left', icon: alignLeftIcon },
        { id: 'center', label: 'Align Center', icon: alignCenterIcon },
        { id: 'right', label: 'Align Right', icon: alignRightIcon },
        { id: 'justify', label: 'Justify', icon: alignJustifyIcon },
      ]}
      overflowMode="collapse"
      selectionMode="single"
      defaultSelectedKeys={['left']}
      disallowEmptySelection
      onSelectionChange={action('onSelectionChange')}
      {...props}
    >
      {item => (
        <ActionGroupItem id={item.id} textValue={item.label}>
          <Icon src={item.icon} />
          <Text>{item.label}</Text>
        </ActionGroupItem>
      )}
    </ActionGroup>
  );
}
