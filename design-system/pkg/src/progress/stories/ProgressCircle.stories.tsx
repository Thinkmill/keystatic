import { ArgTypes } from '@keystar/ui-storybook';

import { ProgressCircle } from '..';

export default {
  title: 'Components/ProgressCircle',

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

export const SizeSmall = (args: ArgTypes) => render({ size: 'small', ...args });

SizeSmall.story = {
  name: 'size: small',
};

export const SizeLarge = (args: ArgTypes) => render({ size: 'large', ...args });

SizeLarge.story = {
  name: 'size: large',
};

export const IsIndeterminateTrue = (args: ArgTypes) =>
  render({ isIndeterminate: true, ...args });

IsIndeterminateTrue.story = {
  name: 'isIndeterminate: true',
};

export const IsIndeterminateTrueSizeSmall = (args: ArgTypes) =>
  render({ isIndeterminate: true, size: 'small', ...args });

IsIndeterminateTrueSizeSmall.story = {
  name: 'isIndeterminate: true, size: small',
};

export const IsIndeterminateTrueSizeLarge = (args: ArgTypes) =>
  render({ isIndeterminate: true, size: 'large', ...args });

IsIndeterminateTrueSizeLarge.story = {
  name: 'isIndeterminate: true, size: large',
};

export const UsingRawValuesForMinValueMaxValueAndValue = () =>
  render({
    maxValue: 12345678,
    value: 9876543,
  });

UsingRawValuesForMinValueMaxValueAndValue.story = {
  name: 'Using raw values for minValue, maxValue, and value',
};

function render(props: any = {}) {
  return <ProgressCircle label="Loading…" {...props} />;
}
