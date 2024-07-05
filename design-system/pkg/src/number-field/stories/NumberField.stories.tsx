import { chain } from '@react-aria/utils';
import { action } from '@keystar/ui-storybook';
import { useState } from 'react';

import { Button } from '@keystar/ui/button';

import { NumberField, NumberFieldProps } from '..';

export default {
  title: 'Components/NumberField',
};

export const Default = () => render({});

Default.storyName = 'default';

export const DefaultValue10 = () => render({ defaultValue: 10 });

DefaultValue10.storyName = 'defaultValue: 10';

export const Value10 = () => render({ value: 10 });

Value10.storyName = 'value: 10';

export const MaximumFractionDigits0 = () =>
  render({ formatOptions: { maximumFractionDigits: 0 } });

MaximumFractionDigits0.storyName = 'maximumFractionDigits = 0';

export const Currency = () =>
  render({
    formatOptions: { style: 'currency', currency: 'EUR' },
    label: 'Price',
  });

Currency.storyName = 'currency';

export const Percent = () =>
  render({ formatOptions: { style: 'percent' }, label: 'Tax' });

Percent.storyName = 'percent';

export const PercentMaxFractionDigits2NoMinFractionDigits = () =>
  render({
    formatOptions: { style: 'percent', maximumFractionDigits: 2 },
    label: 'Tax',
  });

PercentMaxFractionDigits2NoMinFractionDigits.storyName =
  'percent, max fraction digits: 2, no min fraction digits';

export const PercentMin2Max2FractionDigits = () =>
  render({
    formatOptions: {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
    label: 'Tax',
  });

PercentMin2Max2FractionDigits.storyName =
  'percent min = 2 max = 2 fraction digits';

export const PercentMin2Max3FractionDigits = () =>
  render({
    formatOptions: {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 3,
    },
    label: 'Tax',
  });

PercentMin2Max3FractionDigits.storyName =
  'percent min = 2 max = 3 fraction digits';

export const MinValue00FractionDigits = () =>
  render({ minValue: 0, formatOptions: { maximumFractionDigits: 0 } });

MinValue00FractionDigits.storyName = 'minValue = 0, 0 fraction digits';

export const PercentUsingSign = () =>
  render({
    formatOptions: { style: 'percent', signDisplay: 'always' },
    label: 'Tax',
  });

PercentUsingSign.storyName = 'percent using sign';

export const Disabled = () => render({ isDisabled: true });

Disabled.storyName = 'disabled';

export const Readonly = () => render({ defaultValue: 10, isReadOnly: true });

Readonly.storyName = 'readonly';

export const ErrorMessage = () =>
  render({ errorMessage: 'Some validation message.' });

ErrorMessage.storyName = 'errorMessage';

export const MinValue0MaxValue20 = () => render({ minValue: 0, maxValue: 20 });

MinValue0MaxValue20.storyName = 'minValue = 0, maxValue = 20';

export const MinValue50MaxValue20 = () =>
  render({ minValue: -50, maxValue: -20 });

MinValue50MaxValue20.storyName = 'minValue = -50, maxValue = -20';

export const MinValue20MaxValue50 = () =>
  render({ minValue: 20, maxValue: 50 });

MinValue20MaxValue50.storyName = 'minValue = 20, maxValue = 50';

export const MinValue0DefaultValue0 = () =>
  render({ minValue: 0, defaultValue: 0 });

MinValue0DefaultValue0.storyName = 'minValue = 0, defaultValue = 0';

export const Step5 = () => render({ step: 5 });

Step5.storyName = 'step = 5';

export const Step3WithMin2Max21 = () =>
  render({ step: 3, minValue: 2, maxValue: 21 });

Step3WithMin2Max21.storyName = 'step = 3 with min = 2, max = 21';

export const AutoFocus = () => render({ autoFocus: true });

AutoFocus.storyName = 'autoFocus';

export const HideStepper = () => render({ hideStepper: true });

HideStepper.storyName = 'hideStepper';

export const Required = () => render({ isRequired: true });

Required.storyName = 'required';

export const NoVisibleLabel = () =>
  renderNoLabel({ isRequired: true, 'aria-label': 'Width' });

NoVisibleLabel.storyName = 'no visible label';

export const AriaLabelledby = () => (
  <>
    <label htmlFor="numberfield" id="label">
      Width
    </label>
    {renderNoLabel({
      isRequired: true,
      id: 'numberfield',
      'aria-labelledby': 'label',
    })}
  </>
);

AriaLabelledby.storyName = 'aria-labelledby';

export const WithDescriptionNoVisibleLabel = () =>
  renderNoLabel({
    'aria-label': 'Age',
    description: 'Please select your age.',
  });

WithDescriptionNoVisibleLabel.storyName = 'with description, no visible label';

export const CustomWidth = () => render({ width: 'container.xsmall' });

CustomWidth.storyName = 'custom width';

export const CustomWidthNoVisibleLabel = () =>
  renderNoLabel({
    width: 'container.xsmall',
    isRequired: true,
    'aria-label': 'Width',
  });

CustomWidthNoVisibleLabel.storyName = 'custom width no visible label';

export const Controlled = () => <NumberFieldControlled />;

Controlled.storyName = 'controlled';

export const CurrencySwitcher = (args: {
  currency?: string;
  currencyDisplay?: Intl.NumberFormatOptions['currencyDisplay'];
  currencySign?: Intl.NumberFormatOptions['currencySign'];
}) => (
  <NumberFieldWithCurrencySelect
    formatOptions={{
      style: 'currency',
      currency: args.currency,
      currencySign: args.currencySign,
      currencyDisplay: args.currencyDisplay,
    }}
  />
);

CurrencySwitcher.args = {
  currency: 'EUR',
  currencyDisplay: 'symbol',
  currencySign: 'standard',
};
CurrencySwitcher.argTypes = {
  currency: {
    control: {
      type: 'select',
    },
    options: ['EUR', 'USD', 'GBP', 'JPY'],
  },
  currencyDisplay: {
    control: {
      type: 'select',
    },
    options: ['symbol', 'narrowSymbol', 'code', 'name'],
  },
  currencySign: {
    control: {
      type: 'select',
    },
    options: ['standard', 'accounting'],
  },
};

export const FocusEvents = () =>
  render({
    onBlur: action('onBlur'),
    onFocus: action('onFocus'),
    onFocusChange: action('onFocusChange'),
    onKeyDown: action('onKeyDown'),
    onKeyUp: action('onKeyUp'),
  });

FocusEvents.storyName = 'focus events';

export const InputDomEvents = () =>
  render({
    onCopy: action('onCopy'),
    onCut: action('onCut'),
    onPaste: action('onPaste'),
    onCompositionStart: action('onCompositionStart'),
    onCompositionEnd: action('onCompositionEnd'),
    onCompositionUpdate: action('onCompositionUpdate'),
    onSelect: action('onSelect'),
    onBeforeInput: action('onBeforeInput'),
    onInput: action('onInput'),
  });

InputDomEvents.storyName = 'input dom events';

export const ResetControlledStateToBlankWithNull = () => (
  <NumberFieldControlledStateReset />
);

ResetControlledStateToBlankWithNull.storyName =
  'reset controlled state to blank with null';

function render(props: NumberFieldProps = {}) {
  return (
    <NumberField
      onChange={action('onChange')}
      UNSAFE_className="custom_classname"
      label="Width"
      {...props}
    />
  );
}

function renderNoLabel(props: any = {}) {
  return (
    <NumberField
      {...props}
      onChange={action('onChange')}
      UNSAFE_className="custom_classname"
    />
  );
}

function NumberFieldControlled(props: NumberFieldProps) {
  let [value, setValue] = useState(10);
  return (
    <NumberField
      {...props}
      formatOptions={{ style: 'currency', currency: 'EUR' }}
      value={value}
      onChange={chain(setValue, action('onChange'))}
      label="Price"
    />
  );
}

function NumberFieldWithCurrencySelect(props: NumberFieldProps) {
  let [value, setValue] = useState(10);

  return (
    <NumberField
      label="Price"
      {...props}
      value={value}
      onChange={chain(setValue, action('onChange'))}
      width="alias.singleLineWidth"
    />
  );
}

function NumberFieldControlledStateReset() {
  const [controlledValue, setControlledValue] = useState<number | null>(12);
  return (
    <>
      <NumberField
        // @ts-ignore
        value={controlledValue}
        onChange={value => setControlledValue(value)}
      />
      <Button onPress={() => setControlledValue(null)}>Reset</Button>
    </>
  );
}
