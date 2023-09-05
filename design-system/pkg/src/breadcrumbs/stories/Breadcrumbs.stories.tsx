import { Box } from '@keystar/ui/layout';
import { action } from '@keystar/ui-storybook';

import { Breadcrumbs, BreadcrumbsProps, Item } from '..';
import { ReactNode } from 'react';

export default {
  title: 'Components/Breadcrumbs',
};

export const Default = render();

export const Disabled = render({ isDisabled: true });

export const SizeSmall = render({ size: 'small' });
SizeSmall.storyName = 'size: small';

export const SizeMedium = render({ size: 'medium' });
SizeMedium.storyName = 'size: medium';

export const SizeLarge = render({ size: 'large' });
SizeLarge.storyName = 'size: large';

export const ManyItems = renderBreadcrumbs(
  <Breadcrumbs onAction={action('onAction')}>
    <Item key="Home">Home</Item>
    <Item key="Products">Products</Item>
    <Item key="Tools">Tools</Item>
    <Item key="Power Tools">Power Tools</Item>
    <Item key="Drills">Drills</Item>
    <Item key="Impact Drill Drivers">Impact Drill Drivers</Item>
  </Breadcrumbs>
);

export const ShowRoot = renderBreadcrumbs(
  <Breadcrumbs onAction={action('onAction')} showRoot>
    <Item key="Home">Home</Item>
    <Item key="Products">Products</Item>
    <Item key="Tools">Tools</Item>
    <Item key="Power Tools">Power Tools</Item>
    <Item key="Drills">Drills</Item>
    <Item key="Impact Drill Drivers">Impact Drill Drivers</Item>
  </Breadcrumbs>
);

export const Resizable = renderBreadcrumbs(
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

export const SingleItem = renderBreadcrumbs(
  <Breadcrumbs onAction={action('onAction')}>
    <Item key="dashboard">Dashboard</Item>
  </Breadcrumbs>
);

// mitigate the flex-center wrapper, which squashes its contents
function renderBreadcrumbs(children: React.ReactNode) {
  return () => (
    <div
      style={{
        // boxSizing: 'border-box',
        // padding: '1em',
        width: '100vw',
      }}
    >
      {children}
    </div>
  );
}

type Render = (() => ReactNode) & {
  storyName?: string;
};

function render<T>(props: Partial<BreadcrumbsProps<T>> = {}): Render {
  return renderBreadcrumbs(
    <Breadcrumbs onAction={action('onAction')} {...props}>
      <Item key="dashboard">Dashboard</Item>
      <Item key="posts">Posts</Item>
      <Item key="some-post-title">Some post title</Item>
    </Breadcrumbs>
  );
}
