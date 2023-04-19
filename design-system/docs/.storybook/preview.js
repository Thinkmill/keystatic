import { tokenSchema } from '@keystar-ui/style';

import { withProviderSwitcher } from './addons/provider';

export const parameters = {
  options: {
    storySort: (a, b) =>
      a[1].kind === b[1].kind
        ? 0
        : a[1].id.localeCompare(b[1].id, undefined, { numeric: true }),
  },
  a11y: {},
  layout: 'fullscreen',
};

export const decorators = [
  Story => (
    <div
      style={{
        alignItems: 'center',
        backgroundColor: tokenSchema.color.background.canvas,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        minHeight: '100vh',
        paddingBlockEnd: '10vh', // ensure uneven space above/below story element. avoids uncertain flipping behaviour of popovers
      }}
    >
      <Story />
    </div>
  ),
  withProviderSwitcher,
];
