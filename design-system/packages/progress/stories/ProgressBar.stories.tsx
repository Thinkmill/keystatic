import { ArgTypes, storiesOf } from '@keystar-ui/storybook';

import { ProgressBar } from '../src';

const formatOptions = {
  style: 'currency',
  currency: 'AUD',
};

storiesOf('Components/ProgressBar', module)
  .addParameters({
    args: { value: 32 },
    argTypes: { value: { control: { type: 'range', min: 0, max: 100 } } },
  })
  .add('Default', (args: ArgTypes) => render(args))
  .add('value: 50', () => render({ value: 50 }))
  .add('value: 100', () => render({ value: 100 }))
  .add('showValueLabel: true', (args: ArgTypes) =>
    render({ showValueLabel: true, ...args })
  )
  .add('showValueLabel: false', (args: ArgTypes) =>
    render({ showValueLabel: false, ...args })
  )
  .add('valueLabel: 1 of 4', () => render({ value: 25, valueLabel: '1 of 4' }))
  .add('formatOptions with currency style', (args: ArgTypes) =>
    render({
      ...args,
      showValueLabel: true,
      formatOptions,
    })
  )
  .add('no visible label', (args: ArgTypes) =>
    render({ label: null, 'aria-label': 'Loading…', ...args })
  )
  .add('long label', (args: ArgTypes) =>
    render({
      label: 'Really long progress bar label that goes on and on...',
      ...args,
    })
  )
  .add('isIndeterminate: true', (args: ArgTypes) =>
    render({ isIndeterminate: true, ...args })
  )
  .add('parent width 100%', () => (
    <span style={{ width: '100%' }}>{render()}</span>
  ))
  .add('parent width 100px', () => (
    <span style={{ width: '100px' }}>{render()}</span>
  ))
  .add('width: 300px', () => render({ width: '300px', value: 100 }))
  .add('width: 300px, isIndeterminate: true', () =>
    render({ width: '300px', isIndeterminate: true })
  )
  .add('width: 30px', () => render({ width: '30px' }))
  .add('Using raw values for minValue, maxValue, and value', () =>
    render({
      maxValue: 12345678,
      value: 9876543,
    })
  )
  .add('Using raw values with number formatter', () =>
    render({
      maxValue: 12345678,
      value: 9876543,
      formatOptions,
    })
  );

function render(props: any = {}) {
  return <ProgressBar label="Loading…" {...props} />;
}
