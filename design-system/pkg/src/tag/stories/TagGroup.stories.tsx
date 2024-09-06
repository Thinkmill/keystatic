import {
  type ArgTypes,
  type Meta,
  type StoryObj,
  action,
} from '@keystar/ui-storybook';
import { type Key } from '@react-types/shared';
import React, { type PropsWithChildren, useState } from 'react';

import { Avatar } from '@keystar/ui/avatar';
import { ContextualHelp } from '@keystar/ui/contextual-help';
import { Icon } from '@keystar/ui/icon';
import { saladIcon } from '@keystar/ui/icon/icons/saladIcon';
import { pizzaIcon } from '@keystar/ui/icon/icons/pizzaIcon';
import { dessertIcon } from '@keystar/ui/icon/icons/dessertIcon';
import { VStack } from '@keystar/ui/layout';
import { TextLink } from '@keystar/ui/link';
import { Content } from '@keystar/ui/slots';
import { Heading, Text } from '@keystar/ui/typography';

import { Item, TagGroup } from '../index';

let manyItems: { key: number }[] = [];
for (let i = 0; i < 50; i++) {
  let item = { key: i + 1 };
  manyItems.push(item);
}

function ResizableContainer(props: PropsWithChildren) {
  return (
    <VStack
      backgroundColor="canvas"
      gap="medium"
      padding="medium"
      height="scale.3000"
      width="scale.3000"
      UNSAFE_style={{ overflow: 'auto', resize: 'horizontal' }}
    >
      {props.children}
      <Text>Use the resize handle to resize the container.</Text>
    </VStack>
  );
}

function render(props: ArgTypes) {
  return (
    <TagGroup {...props} aria-label="Tag group">
      <Item key="1">Cool Tag 1</Item>
      <Item key="2">Cool Tag 2</Item>
      <Item key="3">Cool Tag 3</Item>
      <Item key="4">Cool Tag 4</Item>
      <Item key="5">Cool Tag 5</Item>
      <Item key="6">Cool Tag 6</Item>
    </TagGroup>
  );
}

export default {
  title: 'Components/TagGroup',
  component: TagGroup,
  argTypes: {
    contextualHelp: { table: { disable: true } },
    items: { table: { disable: true } },
    onAction: { table: { disable: true } },
    onRemove: { table: { disable: true } },
    maxRows: {
      type: 'number',
    },
    isRequired: {
      control: 'boolean',
    },
    description: {
      control: 'text',
    },
    errorMessage: {
      control: 'text',
    },
  },
  render,
} as Meta;

export type TagGroupStory = StoryObj<typeof TagGroup>;

export const Default: TagGroupStory = {};

export const WithIcons: TagGroupStory = {
  args: {
    items: [
      { key: '1', label: 'Healthy', icon: saladIcon },
      { key: '2', label: 'Fast food', icon: pizzaIcon },
      { key: '3', label: 'Dessert', icon: dessertIcon },
    ],
  },
  render: args => (
    <TagGroup aria-label="Tag group with icons" {...args}>
      {(item: any) => (
        <Item key={item.key} textValue={item.label}>
          <Icon src={item.icon} />
          <Text>{item.label}</Text>
        </Item>
      )}
    </TagGroup>
  ),
};

export const OnRemove: TagGroupStory = {
  render: args => <OnRemoveExample {...args} />,
  name: 'onRemove',
};

export const Wrapping: TagGroupStory = {
  decorators: [Story => <ResizableContainer>{<Story />}</ResizableContainer>],
};

export const LabelTruncation: TagGroupStory = {
  render: args => (
    <div style={{ width: '100px' }}>
      <TagGroup aria-label="Tag group with label truncation" {...args}>
        <Item key="1">Cool Tag 1 with a really long label</Item>
        <Item key="2">Another long cool tag label</Item>
        <Item key="3">This tag</Item>
      </TagGroup>
    </div>
  ),
};

export const MaxRows: TagGroupStory = {
  args: { maxRows: 2 },
  decorators: [Story => <ResizableContainer>{<Story />}</ResizableContainer>],
  name: 'maxRows',
};

export const MaxRowsManyTags: TagGroupStory = {
  args: { maxRows: 2 },
  render: args => (
    <TagGroup aria-label="Tag group with 50 tags" items={manyItems} {...args}>
      {(item: any) => <Item key={item.key}>{`Tag ${item.key}`}</Item>}
    </TagGroup>
  ),
  decorators: [Story => <ResizableContainer>{<Story />}</ResizableContainer>],
  name: 'maxRows with many tags',
};

export const MaxRowsOnRemove: TagGroupStory = {
  args: { maxRows: 2 },
  render: args => <OnRemoveExample {...args} />,
  decorators: [Story => <ResizableContainer>{<Story />}</ResizableContainer>],
  name: 'maxRows + onRemove',
};

export const WithAvatar: TagGroupStory = {
  args: {
    items: [
      { key: '1', label: 'Cool Person 1' },
      { key: '2', label: 'Cool Person 2' },
    ],
  },
  render: args => (
    <TagGroup aria-label="Tag group with avatars" {...args}>
      {(item: any) => (
        <Item key={item.key} textValue={item.label}>
          <Avatar
            src={`https://i.pravatar.cc/32?key=${item.key}`}
            alt="avatar placeholder"
          />
          <Text>{item.label}</Text>
        </Item>
      )}
    </TagGroup>
  ),
  name: 'with avatar',
};

export const WithAvatarOnRemove: TagGroupStory = {
  render: args => <OnRemoveExample withAvatar {...args} />,
  name: 'with avatar + onRemove',
};

export const WithAction: TagGroupStory = {
  args: { onAction: action('clear'), actionLabel: 'Clear' },
  name: 'with action',
};

export const WithActionAndMaxRows: TagGroupStory = {
  args: {
    maxRows: 2,
    onAction: action('clear'),
    actionLabel: 'Clear',
  },
  decorators: [Story => <ResizableContainer>{<Story />}</ResizableContainer>],
  name: 'with action and maxRows',
};

export const WithFieldElements: TagGroupStory = {
  args: {
    onAction: action('clear'),
    actionLabel: 'Clear',
    label: 'Some sample tags',
    description: 'Here is a description about the tag group.',
    contextualHelp: (
      <ContextualHelp>
        <Heading>What are these tags?</Heading>
        <Content>Here is more information about the tag group.</Content>
      </ContextualHelp>
    ),
  },
  decorators: [Story => <ResizableContainer>{<Story />}</ResizableContainer>],
  name: 'with field elements',
};

export const EmptyState: TagGroupStory = {
  render: args => (
    <TagGroup label="Tag group with empty state" {...args}>
      {[]}
    </TagGroup>
  ),
  name: 'Empty state',
};

export const CustomEmptyState: TagGroupStory = {
  ...EmptyState,
  args: {
    renderEmptyState: () => (
      <Text>
        No tags. <TextLink href="#">Click here</TextLink> to add some.
      </Text>
    ),
  },
  name: 'Custom empty state',
};

function OnRemoveExample(props: any) {
  let { withAvatar, ...otherProps } = props;
  let [items, setItems] = useState([
    { id: 1, label: 'Cool Tag 1' },
    { id: 2, label: 'Another cool tag' },
    { id: 3, label: 'This tag' },
    { id: 4, label: 'What tag?' },
    { id: 5, label: 'This tag is cool too' },
    { id: 6, label: 'Shy tag' },
  ]);

  let onRemove = (key: Key) => {
    setItems(prevItems => prevItems.filter(item => key !== item.id));
    action('onRemove')(key);
  };

  return (
    <TagGroup
      aria-label="Tag group with removable tags"
      items={items}
      onRemove={keys => onRemove(keys.values().next().value)}
      {...otherProps}
    >
      {(item: any) => (
        <Item textValue={item.label}>
          {withAvatar && (
            <Avatar
              src={`https://i.pravatar.cc/32?id=${item.id}`}
              alt="avatar placeholder"
            />
          )}
          <Text>{item.label}</Text>
        </Item>
      )}
    </TagGroup>
  );
}

export const Links: TagGroupStory = {
  render: args => (
    <TagGroup aria-label="Tag group with links" {...args}>
      <Item href="https://thinkmill.com">Thinkmill</Item>
      <Item href="https://keystatic.com">Keystatic</Item>
      <Item href="https://keystonejs.com/">Keystone</Item>
    </TagGroup>
  ),
};

export const LinksWithRemove: TagGroupStory = {
  render: args => (
    <TagGroup
      aria-label="Tag group with links"
      onRemove={keys => action('onRemove')(keys.values().next().value)}
      {...args}
    >
      <Item href="https://thinkmill.com">Thinkmill</Item>
      <Item href="https://keystatic.com">Keystatic</Item>
      <Item href="https://keystonejs.com/">Keystone</Item>
    </TagGroup>
  ),
};
