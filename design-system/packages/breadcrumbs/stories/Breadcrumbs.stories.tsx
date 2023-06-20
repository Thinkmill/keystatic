import { Box } from '@voussoir/layout';
import { action, storiesOf } from '@voussoir/storybook';

import { Breadcrumbs, BreadcrumbsProps, Item } from '../src';

export default {
  title: 'Components/Breadcrumbs',
};

export const Default = renderDefaultBreadcrumbs();

Default.story = {
  name: 'default',
};

export const Disabled = renderDefaultBreadcrumbs({ isDisabled: true });

Disabled.story = {
  name: 'disabled',
};

export const SizeSmall = renderDefaultBreadcrumbs({ size: 'small' });

SizeSmall.story = {
  name: 'size: small',
};

export const SizeMedium = renderDefaultBreadcrumbs({ size: 'medium' });

SizeMedium.story = {
  name: 'size: medium',
};

export const SizeLarge = renderDefaultBreadcrumbs({ size: 'large' });

SizeLarge.story = {
  name: 'size: large',
};

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

ManyItems.story = {
  name: 'many items',
};

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

ShowRoot.story = {
  name: 'show root',
};

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

Resizable.story = {
  name: 'resizable',
};

export const SingleItem = renderBreadcrumbs(
  <Breadcrumbs onAction={action('onAction')}>
    <Item key="dashboard">Dashboard</Item>
  </Breadcrumbs>
);

SingleItem.story = {
  name: 'single item',
};

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

function renderDefaultBreadcrumbs<T>(props: Partial<BreadcrumbsProps<T>> = {}) {
  return renderBreadcrumbs(
    <Breadcrumbs onAction={action('onAction')} {...props}>
      <Item key="dashboard">Dashboard</Item>
      <Item key="posts">Posts</Item>
      <Item key="some-post-title">Some post title</Item>
    </Breadcrumbs>
  );
}
