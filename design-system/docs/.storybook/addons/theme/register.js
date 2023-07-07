import { addons } from '@storybook/manager-api';
import { FORCE_RE_RENDER } from '@storybook/core-events';
import { themes } from '@storybook/theming';

// Automatically switch light/dark theme based on system pref.
addons.register('theme-switcher', api => {
  let query = window.matchMedia('(prefers-color-scheme: dark)');
  let update = () => {
    let theme = query.matches ? themes.dark : themes.normal;
    theme.brandTitle = 'Keystar UI';
    theme.brandUrl = 'https://keystar-ui.vercel.app/';
    api.setOptions({ theme });
    addons.getChannel().emit(FORCE_RE_RENDER);
  };

  addons.getChannel().on('storiesConfigured', update);
  query.addListener(update);
});
