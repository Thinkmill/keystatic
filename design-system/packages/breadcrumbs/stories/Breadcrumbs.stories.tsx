import { Box } from '@voussoir/layout';
import { action, storiesOf } from '@voussoir/storybook';

import { Breadcrumbs, BreadcrumbsProps, Item } from '../src';

storiesOf('Components/Breadcrumbs', module)
  .add('default', renderDefaultBreadcrumbs())
  .add('disabled', renderDefaultBreadcrumbs({ isDisabled: true }))
  .add('size: small', renderDefaultBreadcrumbs({ size: 'small' }))
  .add('size: medium', renderDefaultBreadcrumbs({ size: 'medium' }))
  .add('size: large', renderDefaultBreadcrumbs({ size: 'large' }))
  .add(
    'many items',
    renderBreadcrumbs(
      <Breadcrumbs onAction={action('onAction')}>
        <Item key="Home">Home</Item>
        <Item key="Products">Products</Item>
        <Item key="Tools">Tools</Item>
        <Item key="Power Tools">Power Tools</Item>
        <Item key="Drills">Drills</Item>
        <Item key="Impact Drill Drivers">Impact Drill Drivers</Item>
      </Breadcrumbs>
    )
  )
  .add(
    'show root',
    renderBreadcrumbs(
      <Breadcrumbs onAction={action('onAction')} showRoot>
        <Item key="Home">Home</Item>
        <Item key="Products">Products</Item>
        <Item key="Tools">Tools</Item>
        <Item key="Power Tools">Power Tools</Item>
        <Item key="Drills">Drills</Item>
        <Item key="Impact Drill Drivers">Impact Drill Drivers</Item>
      </Breadcrumbs>
    )
  )
  .add(
    'resizable',
    renderBreadcrumbs(
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
    )
  )
  .add(
    'single item',
    renderBreadcrumbs(
      <Breadcrumbs onAction={action('onAction')}>
        <Item key="dashboard">Dashboard</Item>
      </Breadcrumbs>
    )
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

function renderDefaultBreadcrumbs<T>(props: Partial<BreadcrumbsProps<T>> = {}) {
  return renderBreadcrumbs(
    <Breadcrumbs onAction={action('onAction')} {...props}>
      <Item key="dashboard">Dashboard</Item>
      <Item key="posts">Posts</Item>
      <Item key="some-post-title">Some post title</Item>
    </Breadcrumbs>
  );
}
