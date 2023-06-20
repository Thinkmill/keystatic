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

// Schemes are currently handled by listening to "storybook-dark-mode" changes.
// May need some custom interface to support more complex themes e.g.
// high-contrast modes.
// const SCHEMES = [
//   { label: 'Auto', value: '' },
//   { label: 'Light', value: 'light' },
//   { label: 'Dark', value: 'dark' },
// ];

const SCALES = [
  { label: 'Auto', value: undefined },
  { label: 'Medium', value: 'medium' },
  { label: 'Large', value: 'large' },
];

function ProviderFieldSetter({ api }) {
  let [values, setValues] = useState({
    locale: providerValuesFromUrl.locale || undefined,
    // scheme: providerValuesFromUrl.scheme || undefined,
    scale: providerValuesFromUrl.scale || undefined,
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
  // let onSchemeChange = e => {
  //   let newValue = e.target.value || undefined;
  //   setValues(old => {
  //     let next = { ...old, scheme: newValue };
  //     channel.emit('provider/updated', next);
  //     return next;
  //   });
  // };
  let onScaleChange = newValue => {
    // let newValue = e.target.value || undefined;
    setValues(old => {
      let next = { ...old, scale: newValue };
      channel.emit('provider/updated', next);
      return next;
    });
  };

  useEffect(() => {
    let storySwapped = () => {
      channel.emit('provider/updated', values);
    };
    channel.on('ksv/ready-for-update', storySwapped);
    return () => {
      channel.removeListener('ksv/ready-for-update', storySwapped);
    };
  });

  useEffect(() => {
    api.setQueryParams({
      'providerSwitcher-locale': values.locale || '',
      // 'providerSwitcher-scheme': values.scheme || '',
      'providerSwitcher-scale': values.scale || '',
    });
  });

  return (
    <>
      <LocaleSelector value={values.locale} onChange={onLocaleChange} />
      <ScaleSelector value={values.scale} onChange={onScaleChange} />
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

// Experimental
// -----------------------------------------------------------------------------

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

const ScaleSelector = ({ onChange, value }) => {
  const selectedIndex = SCALES.findIndex(scale => scale.value === value);
  const selectedScale = SCALES[selectedIndex];
  return (
    <WithTooltip
      placement="bottom"
      trigger="click"
      // closeOnClick
      tooltip={({ onHide }) => {
        return (
          <TooltipLinkList
            links={SCALES.map(scale => {
              let active = scale.value ? value === scale.value : !value;
              return {
                id: scale.value,
                title: scale.label,
                left: <Checkmark active={active} />,
                active,
                onClick: () => {
                  onChange(scale.value);
                  onHide();
                },
              };
            })}
          />
        );
      }}
    >
      <IconButton
        title={`Scale: ${value ? selectedScale.label : 'Auto'}`}
        active={value}
        // onClick={() => {
        //   onChange(SCALES[(selectedIndex + 1) % SCALES.length].value);
        // }}
        style={{ gap: 8 }}
      >
        <Icons icon="ruler" />
        {value ? selectedScale.label[0] : null}
        {/* {value ? selectedScale.symbol : <Icons icon="globe" />} */}
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
