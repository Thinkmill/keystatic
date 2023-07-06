import { ArgTypes } from '@keystar/ui-storybook';

import { Meter, MeterProps } from '..';

const formatOptions = {
  style: 'unit',
  unit: 'gigabyte',
} as const;

export default {
  title: 'Components/Meter',

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

export const ValueLabel1Of4 = () =>
  render({ label: 'Sections completed', value: 25, valueLabel: '1 of 4' });

ValueLabel1Of4.story = {
  name: 'valueLabel: 1 of 4',
};

export const FormatOptionsWithUnitStyle = (args: ArgTypes) =>
  render({
    ...args,
    showValueLabel: true,
    formatOptions,
  });

FormatOptionsWithUnitStyle.story = {
  name: 'formatOptions with unit style',
};

export const NoVisibleLabel = (args: ArgTypes) =>
  render({ label: null, 'aria-label': 'Loading…', ...args });

NoVisibleLabel.story = {
  name: 'no visible label',
};

export const LongLabel = (args: ArgTypes) =>
  render({
    label: 'Really long meter label that goes on and on...',
    ...args,
  });

LongLabel.story = {
  name: 'long label',
};

export const TonePositive = () => render({ tone: 'positive', value: 20 });

TonePositive.story = {
  name: 'tone: positive',
};

export const ToneCaution = () => render({ tone: 'caution', value: 40 });

ToneCaution.story = {
  name: 'tone: caution',
};

export const ToneCritical = () => render({ tone: 'critical', value: 80 });

ToneCritical.story = {
  name: 'tone: critical',
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

export const Width100 = () => render({ width: '100%', value: 33 });

Width100.story = {
  name: 'width: 100%',
};

export const Width100Px = () =>
  render({ UNSAFE_style: { width: '100px' }, value: 33 });

Width100Px.story = {
  name: 'width: 100px',
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

function render(props: MeterProps = {}) {
  return <Meter label="Storage" {...props} />;
}
