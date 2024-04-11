import { Box, VStack } from '@keystar/ui/layout';
import { StoryFn, StoryObj, action } from '@keystar/ui-storybook';

import { Breadcrumbs, BreadcrumbsProps, Item } from '..';
import { ReactNode } from 'react';

export type BreadcrumbsStory = StoryObj<typeof Breadcrumbs>;

const FullWidth = (storyFn: StoryFn) => (
  // @ts-ignore — we're not using the full API
  <div style={{ width: '100vw' }}>{storyFn()}</div>
);
export default {
  title: 'Components/Breadcrumbs',
  decorators: [(storyFn: StoryFn) => FullWidth(storyFn)],
  args: {
    onAction: action('onAction'),
  },
  argTypes: {
    onAction: {
      table: {
        disable: true,
      },
    },
    showRoot: {
      control: 'boolean',
    },
    isDisabled: {
      control: 'boolean',
    },
    size: {
      control: 'select',
      options: ['small', 'regular', 'medium', 'large'],
    },
  },
};

export const Default = render();

export const Disabled = render({ isDisabled: true });

const sizes = ['small', 'regular', 'medium', 'large'] as const;
export const Sizes = () => (
  <VStack gap="large">
    {sizes.map(size => (
      <Breadcrumbs onAction={action('onAction')} key={size} size={size}>
        <Item key="dashboard">Size: {size}</Item>
        <Item key="posts">Second</Item>
        <Item key="some-post-title">Third</Item>
      </Breadcrumbs>
    ))}
  </VStack>
);

export const ManyItems = () => (
  <Breadcrumbs onAction={action('onAction')}>
    <Item key="Home">Home</Item>
    <Item key="Products">Products</Item>
    <Item key="Tools">Tools</Item>
    <Item key="Power Tools">Power Tools</Item>
    <Item key="Drills">Drills</Item>
    <Item key="Impact Drill Drivers">Impact Drill Drivers</Item>
  </Breadcrumbs>
);

export const ShowRoot = () => (
  <Breadcrumbs onAction={action('onAction')} showRoot>
    <Item key="Home">Home</Item>
    <Item key="Products">Products</Item>
    <Item key="Tools">Tools</Item>
    <Item key="Power Tools">Power Tools</Item>
    <Item key="Drills">Drills</Item>
    <Item key="Impact Drill Drivers">Impact Drill Drivers</Item>
  </Breadcrumbs>
);

export const Resizable = () => (
  <Box
    backgroundColor="surface"
    padding="regular"
    overflow="auto"
    UNSAFE_style={{
      minWidth: '100px',
      width: '300px',
      resize: 'horizontal',
    }}
  >
    <Breadcrumbs onAction={action('onAction')}>
      <Item key="first">First item with long text</Item>
      <Item key="second">Second item with long text</Item>
      <Item key="third">Third item with long text</Item>
    </Breadcrumbs>
  </Box>
);

export const SingleItem = () => (
  <Breadcrumbs onAction={action('onAction')}>
    <Item key="dashboard">Dashboard</Item>
  </Breadcrumbs>
);

export const Links = () => (
  <Breadcrumbs>
    <Item href="https://example.com">Example.com</Item>
    <Item href="https://example.com/foo">Foo</Item>
    <Item href="https://example.com/foo/bar">Bar</Item>
    <Item href="https://example.com/foo/bar/baz">Baz</Item>
    <Item href="https://example.com/foo/bar/baz/qux">Qux</Item>
  </Breadcrumbs>
);

type Render = (() => ReactNode) & {
  storyName?: string;
};

function render<T>(props: Partial<BreadcrumbsProps<T>> = {}): Render {
  return () => (
    <Breadcrumbs onAction={action('onAction')} {...props}>
      <Item key="dashboard">Dashboard</Item>
      <Item key="posts">Posts</Item>
      <Item key="some-post-title">Some post title</Item>
    </Breadcrumbs>
  );
}
