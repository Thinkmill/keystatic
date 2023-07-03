import { ArgTypes } from '@keystar/ui-storybook';

import { ProgressBar } from '..';

const formatOptions = {
  style: 'currency',
  currency: 'AUD',
};

export default {
  title: 'Components/ProgressBar',

  args: { value: 32 },
  argTypes: { value: { control: { type: 'range', min: 0, max: 100 } } },
};

export const Default = (args: ArgTypes) => render(args);
export const Value50 = () => render({ value: 50 });

Value50.story = {
  name: 'value: 50',
};

export const Value100 = () => render({ value: 100 });

Value100.story = {
  name: 'value: 100',
};

export const ShowValueLabelTrue = (args: ArgTypes) =>
  render({ showValueLabel: true, ...args });

ShowValueLabelTrue.story = {
  name: 'showValueLabel: true',
};

export const ShowValueLabelFalse = (args: ArgTypes) =>
  render({ showValueLabel: false, ...args });

ShowValueLabelFalse.story = {
  name: 'showValueLabel: false',
};

export const ValueLabel1Of4 = () => render({ value: 25, valueLabel: '1 of 4' });

ValueLabel1Of4.story = {
  name: 'valueLabel: 1 of 4',
};

export const FormatOptionsWithCurrencyStyle = (args: ArgTypes) =>
  render({
    ...args,
    showValueLabel: true,
    formatOptions,
  });

FormatOptionsWithCurrencyStyle.story = {
  name: 'formatOptions with currency style',
};

export const NoVisibleLabel = (args: ArgTypes) =>
  render({ label: null, 'aria-label': 'Loading…', ...args });

NoVisibleLabel.story = {
  name: 'no visible label',
};

export const LongLabel = (args: ArgTypes) =>
  render({
    label: 'Really long progress bar label that goes on and on...',
    ...args,
  });

LongLabel.story = {
  name: 'long label',
};

export const IsIndeterminateTrue = (args: ArgTypes) =>
  render({ isIndeterminate: true, ...args });

IsIndeterminateTrue.story = {
  name: 'isIndeterminate: true',
};

export const ParentWidth100 = () => (
  <span style={{ width: '100%' }}>{render()}</span>
);

ParentWidth100.story = {
  name: 'parent width 100%',
};

export const ParentWidth100Px = () => (
  <span style={{ width: '100px' }}>{render()}</span>
);

ParentWidth100Px.story = {
  name: 'parent width 100px',
};

export const Width300Px = () => render({ width: '300px', value: 100 });

Width300Px.story = {
  name: 'width: 300px',
};

export const Width300PxIsIndeterminateTrue = () =>
  render({ width: '300px', isIndeterminate: true });

Width300PxIsIndeterminateTrue.story = {
  name: 'width: 300px, isIndeterminate: true',
};

export const Width30Px = () => render({ width: '30px' });

Width30Px.story = {
  name: 'width: 30px',
};

export const UsingRawValuesForMinValueMaxValueAndValue = () =>
  render({
    maxValue: 12345678,
    value: 9876543,
  });

UsingRawValuesForMinValueMaxValueAndValue.story = {
  name: 'Using raw values for minValue, maxValue, and value',
};

export const UsingRawValuesWithNumberFormatter = () =>
  render({
    maxValue: 12345678,
    value: 9876543,
    formatOptions,
  });

UsingRawValuesWithNumberFormatter.story = {
  name: 'Using raw values with number formatter',
};

function render(props: any = {}) {
  return <ProgressBar label="Loading…" {...props} />;
}
