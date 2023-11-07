import { types } from '@storybook/addons';
import { addons } from '@storybook/manager-api';
import { getQueryParams } from '@storybook/client-api';
import {
  IconButton,
  Icons,
  TooltipLinkList,
  WithTooltip,
} from '@storybook/components';
import React, { useEffect, useState } from 'react';

import { locales } from '../../constants';

const providerValuesFromUrl = Object.entries(getQueryParams()).reduce(
  (acc, [k, v]) => {
    if (k.includes('providerSwitcher-')) {
      return { ...acc, [k.replace('providerSwitcher-', '')]: v };
    }
    return acc;
  },
  {}
);

function ProviderFieldSetter({ api }) {
  let [values, setValues] = useState({
    locale: providerValuesFromUrl.locale || undefined,
  });
  let channel = addons.getChannel();

  let onLocaleChange = newValue => {
    // let newValue = e.target.value || undefined;
    setValues(old => {
      let next = { ...old, locale: newValue };
      channel.emit('provider/updated', next);
      return next;
    });
  };

  useEffect(() => {
    let storySwapped = () => {
      channel.emit('provider/updated', values);
    };
    channel.on('keystar-storybook/ready-for-update', storySwapped);
    return () => {
      channel.removeListener(
        'keystar-storybook/ready-for-update',
        storySwapped
      );
    };
  });

  useEffect(() => {
    api.setQueryParams({
      'providerSwitcher-locale': values.locale || '',
    });
  });

  return (
    <>
      <LocaleSelector value={values.locale} onChange={onLocaleChange} />
    </>
  );
}

addons.register('ProviderSwitcher', api => {
  addons.add('ProviderSwitcher', {
    title: 'viewport',
    type: types.TOOL,
    match: ({ viewMode }) => viewMode === 'story',
    render: () => <ProviderFieldSetter api={api} />,
  });
});

const LocaleSelector = ({ onChange, value }) => {
  const selectedLocale = locales.find(locale => locale.value === value);
  return (
    <WithTooltip
      placement="bottom"
      trigger="click"
      // closeOnClick
      tooltip={({ onHide }) => {
        return (
          <TooltipLinkList
            links={locales.map(locale => {
              let active = locale.value ? value === locale.value : !value;
              return {
                id: locale.value,
                title: locale.label,
                left: <Checkmark active={active} />,
                // right: <span style={{ color: 'black' }}>{locale.symbol}</span>,
                active,
                onClick: () => {
                  onChange(locale.value);
                  onHide();
                },
              };
            })}
          />
        );
      }}
    >
      <IconButton
        title={`Locale: ${selectedLocale ? selectedLocale.label : 'Auto'}`}
        active={value}
        style={{ gap: 8 }}
      >
        <Icons icon="globe" />
        {selectedLocale ? selectedLocale.value : null}
      </IconButton>
    </WithTooltip>
  );
};

const Checkmark = ({ active }) => {
  return (
    <span style={{ color: active ? 'black' : 'transparent' }}>
      <Icons icon="check" style={{ width: 14 }} />
    </span>
  );
};
