import { action, storiesOf } from '@keystar-ui/storybook';

import { alignCenterIcon } from '@keystar-ui/icon/icons/alignCenterIcon';
import { alignJustifyIcon } from '@keystar-ui/icon/icons/alignJustifyIcon';
import { alignLeftIcon } from '@keystar-ui/icon/icons/alignLeftIcon';
import { alignRightIcon } from '@keystar-ui/icon/icons/alignRightIcon';
import { boldIcon } from '@keystar-ui/icon/icons/boldIcon';
import { italicIcon } from '@keystar-ui/icon/icons/italicIcon';
import { strikethroughIcon } from '@keystar-ui/icon/icons/strikethroughIcon';
import { underlineIcon } from '@keystar-ui/icon/icons/underlineIcon';
import { subscriptIcon } from '@keystar-ui/icon/icons/subscriptIcon';
import { superscriptIcon } from '@keystar-ui/icon/icons/superscriptIcon';
import { typeIcon } from '@keystar-ui/icon/icons/typeIcon';
import { editIcon } from '@keystar-ui/icon/icons/editIcon';
import { copyIcon } from '@keystar-ui/icon/icons/copyIcon';
import { trash2Icon } from '@keystar-ui/icon/icons/trash2Icon';
import { plusIcon } from '@keystar-ui/icon/icons/plusIcon';
import { Icon } from '@keystar-ui/icon';
import { Flex } from '@keystar-ui/layout';
import { Tooltip, TooltipTrigger } from '@keystar-ui/tooltip';
import { Kbd, Text } from '@keystar-ui/typography';
import { PropsWithChildren } from 'react';

import { ActionGroup, ActionGroupProps, Item } from '../src';
import { css } from '@keystar-ui/style';

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

storiesOf('Components/ActionGroup', module)
  .add('default', () => (
    <ActionGroup onAction={action('onAction')}>
      <Item key="add">Add</Item>
      <Item key="delete">Delete</Item>
      <Item key="edit">Edit</Item>
    </ActionGroup>
  ))
  .add('prominence=low', () => (
    <ActionGroup prominence="low" onAction={action('onAction')}>
      <Item key="add">Add</Item>
      <Item key="delete">Delete</Item>
      <Item key="edit">Edit</Item>
    </ActionGroup>
  ))
  .add('disabled group', () =>
    render({ isDisabled: true, defaultSelectedKeys: ['1'] }, editItems)
  )
  .add('disabled keys', () => render({ disabledKeys: ['1', '2'] }, editItems))
  .add('compact', () =>
    render({ density: 'compact', defaultSelectedKeys: ['1'] }, editItems)
  )
  .add('compact, prominence=low', () =>
    render(
      { density: 'compact', prominence: 'low', defaultSelectedKeys: ['1'] },
      editItems
    )
  )
  .add('isJustified', () =>
    render({ isJustified: true, defaultSelectedKeys: ['1'] }, editItems)
  )
  .add('compact, isJustified', () =>
    render(
      { density: 'compact', isJustified: true, defaultSelectedKeys: ['1'] },
      editItems
    )
  )

  // selection mode
  .add('selectionMode: multiple', () =>
    render(
      { selectionMode: 'multiple', defaultSelectedKeys: ['1', '2'] },
      formattingItems
    )
  )
  .add('selectionMode: single, disallowEmptySelection', () =>
    render(
      {
        selectionMode: 'single',
        disallowEmptySelection: true,
        defaultSelectedKeys: ['1'],
      },
      formattingItems
    )
  )
  .add('selectionMode: multiple, compact', () =>
    render(
      {
        density: 'compact',
        selectionMode: 'multiple',
        defaultSelectedKeys: ['1', '2'],
      },
      formattingItems
    )
  )

  // dynamic
  .add('dynamic default', () => (
    <ActionGroup onAction={action('onAction')} items={editItems}>
      {item => (
        <Item key={item.name} textValue={item.name}>
          {item.children}
        </Item>
      )}
    </ActionGroup>
  ))
  .add('dynamic single selection', () => (
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
  ))
  .add('manual tooltips', () => renderTooltips({}))

  // overflow
  .add('overflowMode: wrap', () => (
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
  ))
  .add('overflowMode: collapse', () => (
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
  ))
  .add('buttonLabelBehavior: hide', () => (
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
  ))
  .add('buttonLabelBehavior: collapse', () => (
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
  ))
  .add('overflowMode: collapse, selection', () => (
    <Resize>
      {renderCollapsibleFormatting({ prominence: 'low' })}
      {renderCollapsibleAlignment({ prominence: 'low' })}
    </Resize>
  ))
  .add('collapse: dense', () => (
    <Resize>
      {renderCollapsibleFormatting({ density: 'compact' })}
      {renderCollapsibleAlignment({ density: 'compact' })}
    </Resize>
  ))
  .add('overflowMode: collapse, summaryIcon', () => (
    <Resize>
      {renderCollapsibleFormatting({
        density: 'compact',
        summaryIcon: <Icon src={typeIcon} />,
      })}
      {renderCollapsibleAlignment({ density: 'compact' })}
    </Resize>
  ));

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
