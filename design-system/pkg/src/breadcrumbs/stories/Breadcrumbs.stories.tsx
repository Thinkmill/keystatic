import { Box, VStack } from '@keystar/ui/layout';
import { StoryFn, StoryObj, action } from '@keystar/ui-storybook';

import { Breadcrumbs, BreadcrumbsProps, BreadcrumbItem } from '..';
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
        <BreadcrumbItem id="dashboard">Size: {size}</BreadcrumbItem>
        <BreadcrumbItem id="posts">Second</BreadcrumbItem>
        <BreadcrumbItem id="some-post-title">Third</BreadcrumbItem>
      </Breadcrumbs>
    ))}
  </VStack>
);

export const ManyItems = () => (
  <Breadcrumbs onAction={action('onAction')}>
    <BreadcrumbItem id="Home">Home</BreadcrumbItem>
    <BreadcrumbItem id="Products">Products</BreadcrumbItem>
    <BreadcrumbItem id="Tools">Tools</BreadcrumbItem>
    <BreadcrumbItem id="Power Tools">Power Tools</BreadcrumbItem>
    <BreadcrumbItem id="Drills">Drills</BreadcrumbItem>
    <BreadcrumbItem id="Impact Drill Drivers">
      Impact Drill Drivers
    </BreadcrumbItem>
  </Breadcrumbs>
);

export const ShowRoot = () => (
  <Breadcrumbs onAction={action('onAction')}>
    <BreadcrumbItem id="Home">Home</BreadcrumbItem>
    <BreadcrumbItem id="Products">Products</BreadcrumbItem>
    <BreadcrumbItem id="Tools">Tools</BreadcrumbItem>
    <BreadcrumbItem id="Power Tools">Power Tools</BreadcrumbItem>
    <BreadcrumbItem id="Drills">Drills</BreadcrumbItem>
    <BreadcrumbItem id="Impact Drill Drivers">
      Impact Drill Drivers
    </BreadcrumbItem>
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
      <BreadcrumbItem id="first">First item with long text</BreadcrumbItem>
      <BreadcrumbItem id="second">Second item with long text</BreadcrumbItem>
      <BreadcrumbItem id="third">Third item with long text</BreadcrumbItem>
    </Breadcrumbs>
  </Box>
);

export const SingleItem = () => (
  <Breadcrumbs onAction={action('onAction')}>
    <BreadcrumbItem id="dashboard">Dashboard</BreadcrumbItem>
  </Breadcrumbs>
);

export const Links = () => (
  <Breadcrumbs>
    <BreadcrumbItem href="https://example.com">Example.com</BreadcrumbItem>
    <BreadcrumbItem href="https://example.com/foo">Foo</BreadcrumbItem>
    <BreadcrumbItem href="https://example.com/foo/bar">Bar</BreadcrumbItem>
    <BreadcrumbItem href="https://example.com/foo/bar/baz">Baz</BreadcrumbItem>
    <BreadcrumbItem href="https://example.com/foo/bar/baz/qux">
      Qux
    </BreadcrumbItem>
  </Breadcrumbs>
);

type Render = (() => ReactNode) & {
  storyName?: string;
};

function render<T extends object>(
  props: Partial<BreadcrumbsProps<T>> = {}
): Render {
  return () => (
    <Breadcrumbs onAction={action('onAction')} {...props}>
      <BreadcrumbItem id="dashboard">Dashboard</BreadcrumbItem>
      <BreadcrumbItem id="posts">Posts</BreadcrumbItem>
      <BreadcrumbItem id="some-post-title">Some post title</BreadcrumbItem>
    </Breadcrumbs>
  );
}
