import { ArgTypes, storiesOf } from '@storybook/react';

import { ProgressCircle } from '../src';

storiesOf('Components/ProgressCircle', module)
  .addParameters({
    args: { value: 32 },
    argTypes: { value: { control: { type: 'range', min: 0, max: 100 } } },
  })
  .add('Default', (args: ArgTypes) => render(args))
  .add('value: 50', () => render({ value: 50 }))
  .add('value: 100', () => render({ value: 100 }))
  .add('size: small', (args: ArgTypes) => render({ size: 'small', ...args }))
  .add('size: large', (args: ArgTypes) => render({ size: 'large', ...args }))
  .add('isIndeterminate: true', (args: ArgTypes) =>
    render({ isIndeterminate: true, ...args })
  )
  .add('isIndeterminate: true, size: small', (args: ArgTypes) =>
    render({ isIndeterminate: true, size: 'small', ...args })
  )
  .add('isIndeterminate: true, size: large', (args: ArgTypes) =>
    render({ isIndeterminate: true, size: 'large', ...args })
  )
  .add('Using raw values for minValue, maxValue, and value', () =>
    render({
      maxValue: 12345678,
      value: 9876543,
    })
  );

function render(props: any = {}) {
  return <ProgressCircle label="Loading…" {...props} />;
}
