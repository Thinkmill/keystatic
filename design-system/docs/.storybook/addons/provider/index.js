import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { useDarkMode } from 'storybook-dark-mode';
import { makeDecorator } from '@storybook/addons';
import { addons } from '@storybook/preview-api';
import { getQueryParams } from '@storybook/client-api';

import {
  ClientSideOnlyDocumentElement,
  KeystarProvider,
} from '@keystar/ui/core';

const providerValuesFromUrl = Object.entries(getQueryParams()).reduce(
  (acc, [k, v]) => {
    if (k.includes('providerSwitcher-')) {
      return { ...acc, [k.replace('providerSwitcher-', '')]: v };
    }
    return acc;
  },
  {}
);

function ProviderUpdater(props) {
  let [localeValue, setLocale] = useState(
    providerValuesFromUrl.locale || undefined
  );
  let [storyReady, setStoryReady] = useState(window.parent === window); // reduce content flash because it takes a moment to get the provider details

  useEffect(() => {
    let channel = addons.getChannel();
    let providerUpdate = event => {
      setLocale(event.locale);
      setStoryReady(true);
    };

    channel.on('provider/updated', providerUpdate);
    channel.emit('keystar-storybook/ready-for-update');
    return () => {
      channel.removeListener('provider/updated', providerUpdate);
    };
  }, []);

  const Wrapper = props.options.mainElement == null ? 'main' : Fragment;

  return (
    <KeystarProvider
      colorScheme={useDarkMode() ? 'dark' : 'light'}
      locale={localeValue}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <ClientSideOnlyDocumentElement />
      <Wrapper>{storyReady && props.children}</Wrapper>
    </KeystarProvider>
  );
}

export const withProviderSwitcher = makeDecorator({
  name: 'withProviderSwitcher',
  parameterName: 'providerSwitcher',
  wrapper: (getStory, context, { options, parameters }) => {
    options = { ...options, ...parameters };
    return (
      <ProviderUpdater options={options} context={context}>
        {getStory(context)}
      </ProviderUpdater>
    );
  },
});
