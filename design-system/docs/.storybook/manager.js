import { addons } from '@storybook/manager-api';

addons.setConfig({
  enableShortcuts: false, // I often inadvertently invoke shortcuts. Turning this off, for now.
  // showRoots: false, // Hide the root level in the sidebar. Turning this off will make the sidebar more compact, useful when there's loads of components.
});
