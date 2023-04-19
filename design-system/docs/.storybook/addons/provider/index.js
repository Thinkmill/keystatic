import React, { Fragment, useEffect, useState } from 'react';
import { useDarkMode } from 'storybook-dark-mode';
import addons, { makeDecorator } from '@storybook/addons';
import { getQueryParams } from '@storybook/client-api';
import LinkTo from '@storybook/addon-links/react';

import {
  ClientSideOnlyDocumentElement,
  VoussoirProvider,
} from '@keystar-ui/core';
import { makeLinkComponent } from '@keystar-ui/link';

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
  // NOTE: Schemes currently listen to "storybook-dark-mode" changes. may need custom interface in the future.
  // let [schemeValue, setScheme] = useState(
  //   providerValuesFromUrl.scheme || undefined
  // );
  let [scaleValue, setScale] = useState(
    providerValuesFromUrl.scale || undefined
  );
  let [storyReady, setStoryReady] = useState(window.parent === window); // reduce content flash because it takes a moment to get the provider details

  useEffect(() => {
    let channel = addons.getChannel();
    let providerUpdate = event => {
      setLocale(event.locale);
      // setScheme(event.scheme === 'Auto' ? undefined : event.scheme);
      setScale(event.scale === 'Auto' ? undefined : event.scale);
      setStoryReady(true);
    };

    channel.on('provider/updated', providerUpdate);
    channel.emit('ksv/ready-for-update');
    return () => {
      channel.removeListener('provider/updated', providerUpdate);
    };
  }, []);

  const Wrapper = props.options.mainElement == null ? 'main' : Fragment;

  return (
    <VoussoirProvider
      linkComponent={StorybookLink}
      colorScheme={useDarkMode() ? 'dark' : 'light'}
      scale={scaleValue}
      locale={localeValue}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <ClientSideOnlyDocumentElement />
      <Wrapper>{storyReady && props.children}</Wrapper>
    </VoussoirProvider>
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

export const StorybookLink = makeLinkComponent(
  ({ href, onClick, rel, target, ...props }, ref) => {
    const isStoryLink = href.toLowerCase().startsWith('linktostory:');

    if (isStoryLink) {
      let storyPath = href.split(':')[1];

      if (/\.|\//.test(storyPath)) {
        let [kind, story] = storyPath.split('.');
        return <LinkTo kind={kind} story={story} {...props} />;
      }

      return <LinkTo story={storyPath} {...props} />;
    }

    const isExternal = href.startsWith('http');

    return (
      <a
        ref={ref}
        href={href}
        rel={isExternal ? 'noreferrer noopener' : rel}
        target={isExternal ? '_blank' : target}
        onClick={event => {
          // Prevent unintentional navigation on example links
          if (href === '' || href === '#') {
            event.preventDefault();
          }

          if (typeof onClick === 'function') {
            onClick(event);
          }
        }}
        {...props}
      />
    );
  }
);
