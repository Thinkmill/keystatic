---
title: NumberField
description:
  Number fields let users enter a numeric value and incrementally increase or
  decrease the value with a step-button control.
category: Forms
---

## Example

```jsx {% live=true %}
<NumberField label="Width" defaultValue={1024} minValue={0} />
```

## Related

- [TextField](/package/text-field) — Use for typical text input.

## Formatting

The `NumberField` value can be formatted by using the `formatOptions` prop,
which is compatible with the option parameter of
[Intl.NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat)
and is applied based on the current locale.

### Decimals

The following example uses the `signDisplay` option to include the plus sign for
positive numbers, for example to display an offset from some value. In addition,
it always displays a minimum of 1 digit after the decimal point, and allows up
to 2 fraction digits. If the user enters more than 2 fraction digits, the result
will be rounded.

```jsx {% live=true %}
<NumberField
  label="Adjust exposure"
  formatOptions={{
    signDisplay: 'exceptZero',
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  }}
  defaultValue={0}
/>
```

### Percentages

The style of `"percent"` can be passed to the `formatOptions` prop to treat the
value as a percentage. In this mode, the value is multiplied by 100 before it is
displayed, i.e. `0.45` is displayed as `45%`. The reverse is also true: when the
user enters a value, the `onChange` event will be triggered with the entered
value divided by 100.

```jsx {% live=true %}
<NumberField
  label="Tax"
  formatOptions={{ style: 'percent' }}
  minValue={0}
  defaultValue={0.05}
/>
```

When the percent option is enabled, the default `step` automatically changes to
`0.01` such that incrementing and decrementing occurs by 1%. This can be
overridden with the [step prop](#step).

### Currency

The style of `"currency"` can be passed to the `formatOptions` prop to treat the
value as a currency value. The `currency` option must also be passed to set the
currency code (e.g. `AUD`) to use. In addition, the `currencyDisplay` option can
be used to choose whether to display the currency symbol, currency code, or
currency name. Finally, the `currencySign` option can be set to `"accounting"`
to use accounting notation for negative numbers, which uses parentheses rather
than a minus sign in some locales.

```jsx {% live=true %}
<NumberField
  label="Amount"
  defaultValue={45}
  formatOptions={{
    style: 'currency',
    currency: 'EUR',
    currencyDisplay: 'code',
    currencySign: 'accounting',
  }}
/>
```

If you need to allow the user to change the currency, you should include a
separate control. The `NumberField` will not determine the currency from the
user input.

### Units

The style of `"unit"` can be passed to the `formatOptions` prop to format the
value with a unit of measurement. The `unit` option must also be passed to set
which unit to use (e.g. `"centimeter"`). In addition, the `unitDisplay` option
can be used to choose whether to display the unit in `long`, `short`, or
`narrow` format.

```jsx {% live=true %}
<NumberField
  label="Width"
  defaultValue={10}
  minValue={0}
  formatOptions={{
    style: 'unit',
    unit: 'centimeter',
    unitDisplay: 'short',
  }}
/>
```

If you need to allow the user to change the unit, you should include a separate
control. The `NumberField` will not determine the unit from the user input.

## Props

### Min and Max

The `minValue` and `maxValue` props can be used to limit the entered value to a
specific range. The value will be clamped when the user blurs the input field.
In addition, the increment and decrement buttons will be disabled when the value
is within one [step value](#step) from the bounds.

```jsx {% live=true %}
<NumberField label="Enter your age" minValue={0} />
```

Ranges can be open ended by only providing either `minValue` or `maxValue`
rather than both. If a valid range is known ahead of time, it is a good idea to
provide it so the experience can be optimised. For example, when the minimum
value is greater than or equal to zero, it is possible to use a numeric keyboard
on iOS rather than a full text keyboard (necessary to enter a minus sign).

### Step

The step prop can be used to snap the value to certain increments. If there is a
`minValue` defined, the steps are calculated starting from the minimum. For
example, if `minValue={2}`, and `step={3}`, the valid step values would be 2, 5,
8, 11, etc. If no `minValue` is defined, the steps are calculated starting from
zero and extending in both directions. In other words, such that the values are
evenly divisible by the step. A step can be any positive decimal. If no step is
defined, any decimal value may be typed, but incrementing and decrementing snaps
the value to an integer.

```jsx {% live=true %}
<Flex direction="column" gap="large">
  <NumberField label="Step" step={10} />
  <NumberField label="Step with minValue" minValue={2} step={3} />
  <NumberField
    label="Step with minValue + maxValue"
    minValue={2}
    maxValue={21}
    step={3}
  />
</Flex>
```

If the user types a value that is between two steps and blurs the input, the
value will be snapped to the nearest step. When incrementing or decrementing,
the value is snapped to the nearest step that is higher or lower, respectively.
When incrementing or decrementing from an empty field, the value starts at the
`minValue` or `maxValue`, respectively, if defined. Otherwise, the value starts
from 0.

### Label

Every number field must have a label.

```jsx {% live=true %}
<NumberField label="Width" />
```

If you do not provide a visible label, you must specify an `aria-label` or
`aria-labelledby` attribute for accessibility.

```jsx {% live=true %}
<NumberField aria-label="Width" />
```

### Description

The `description` communicates a hint or helpful information, such as specific
requirements for correctly filling out the field.

```jsx {% live=true %}
<NumberField
  label="Editors"
  description="Maximum of 4."
  maxValue={4}
  minValue={0}
/>
```

### Error message

The `errorMessage` communicates validation errors when field requirements aren’t
met. Prompting the user to adjust their input.

```jsx {% live=true %}
<NumberField
  label="Value"
  isRequired
  errorMessage="A value is required to see results."
  value={null}
/>
```

### Disabled

A number field can be disabled by setting the `isDisabled` prop. This can be
used to maintain layout continuity and communicate that a field may become
available later.

```jsx {% live=true %}
<NumberField label="Width" isDisabled value={1024} />
```

### Read only

The `isReadOnly` prop makes a field's text content immutable. Unlike
`isDisabled`, the field remains focusable and the contents can still be copied.

```jsx {% live=true %}
<NumberField label="Width" isReadOnly value={1024} />
```
