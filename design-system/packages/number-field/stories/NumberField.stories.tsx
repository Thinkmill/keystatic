import { chain } from '@react-aria/utils';
import { action, storiesOf } from '@keystar-ui/storybook';
import { useState } from 'react';

import { Button } from '@keystar-ui/button';

import { NumberField, NumberFieldProps } from '../src';

storiesOf('Components/NumberField', module)
  .add('default', () => render({}))
  .add('defaultValue: 10', () => render({ defaultValue: 10 }))
  .add('value: 10', () => render({ value: 10 }))
  .add('maximumFractionDigits = 0', () =>
    render({ formatOptions: { maximumFractionDigits: 0 } })
  )
  .add('currency', () =>
    render({
      formatOptions: { style: 'currency', currency: 'EUR' },
      label: 'Price',
    })
  )
  .add('percent', () =>
    render({ formatOptions: { style: 'percent' }, label: 'Tax' })
  )
  .add('percent, max fraction digits: 2, no min fraction digits', () =>
    render({
      formatOptions: { style: 'percent', maximumFractionDigits: 2 },
      label: 'Tax',
    })
  )
  .add('percent min = 2 max = 2 fraction digits', () =>
    render({
      formatOptions: {
        style: 'percent',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      },
      label: 'Tax',
    })
  )
  .add('percent min = 2 max = 3 fraction digits', () =>
    render({
      formatOptions: {
        style: 'percent',
        minimumFractionDigits: 2,
        maximumFractionDigits: 3,
      },
      label: 'Tax',
    })
  )
  .add('minValue = 0, 0 fraction digits', () =>
    render({ minValue: 0, formatOptions: { maximumFractionDigits: 0 } })
  )
  .add('percent using sign', () =>
    render({
      formatOptions: { style: 'percent', signDisplay: 'always' },
      label: 'Tax',
    })
  )
  .add('disabled', () => render({ isDisabled: true }))
  .add('readonly', () => render({ defaultValue: 10, isReadOnly: true }))
  .add('errorMessage', () =>
    render({ errorMessage: 'Some validation message.' })
  )
  .add('minValue = 0, maxValue = 20', () =>
    render({ minValue: 0, maxValue: 20 })
  )
  .add('minValue = -50, maxValue = -20', () =>
    render({ minValue: -50, maxValue: -20 })
  )
  .add('minValue = 20, maxValue = 50', () =>
    render({ minValue: 20, maxValue: 50 })
  )
  .add('minValue = 0, defaultValue = 0', () =>
    render({ minValue: 0, defaultValue: 0 })
  )
  .add('step = 5', () => render({ step: 5 }))
  .add('step = 3 with min = 2, max = 21', () =>
    render({ step: 3, minValue: 2, maxValue: 21 })
  )
  .add('autoFocus', () => render({ autoFocus: true }))
  .add('hideStepper', () => render({ hideStepper: true }))
  .add('required', () => render({ isRequired: true }))
  .add('no visible label', () =>
    renderNoLabel({ isRequired: true, 'aria-label': 'Width' })
  )
  .add('aria-labelledby', () => (
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
  ))
  .add('with description, no visible label', () =>
    renderNoLabel({
      'aria-label': 'Age',
      description: 'Please select your age.',
    })
  )
  .add('custom width', () => render({ width: 'container.xsmall' }))
  .add('custom width no visible label', () =>
    renderNoLabel({
      width: 'size.container.xsmall',
      isRequired: true,
      'aria-label': 'Width',
    })
  )
  .add('controlled', () => <NumberFieldControlled />)
  .add(
    'currency switcher',
    (args: {
      currency?: string;
      currencyDisplay?: string;
      currencySign?: string;
    }) => (
      <NumberFieldWithCurrencySelect
        formatOptions={{
          style: 'currency',
          currency: args.currency,
          currencySign: args.currencySign,
          currencyDisplay: args.currencyDisplay,
        }}
      />
    ),
    {
      argTypes: {
        currency: {
          defaultValue: 'EUR',
          control: {
            type: 'select',
            options: ['EUR', 'USD', 'GBP', 'JPY'],
          },
        },
        currencyDisplay: {
          defaultValue: 'symbol',
          control: {
            type: 'select',
            options: ['symbol', 'narrowSymbol', 'code', 'name'],
          },
        },
        currencySign: {
          defaultValue: 'standard',
          control: {
            type: 'select',
            options: ['standard', 'accounting'],
          },
        },
      } as const,
    }
  )
  .add('min width', () => render({ width: 0 }))
  .add('focus events', () =>
    render({
      onBlur: action('onBlur'),
      onFocus: action('onFocus'),
      onFocusChange: action('onFocusChange'),
      onKeyDown: action('onKeyDown'),
      onKeyUp: action('onKeyUp'),
    })
  )
  .add('input dom events', () =>
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
    })
  )
  .add('reset controlled state to blank with null', () => (
    <NumberFieldControlledStateReset />
  ));

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
