---
title: Numeral
description:
  A utility component used to format numbers. Typographic utilities may be
  composed with other typography components.
category: Typography
---

## Example

```jsx {% live=true %}
<Numeral value={120000} />
```

## Props

### Format

The default style `"decimal"`, is for plain number formatting. Values of
`"percent"` will be multiplied by `100` before formatting.

```jsx {% live=true %}
<Flex gap="large">
  <Numeral value={3500} format="decimal" />
  <Numeral value={3500} format="percent" />
</Flex>
```

Values of `"currency"` and `"unit"` are valid, but can be omitted. The format
for each will be derived from the [currency](#currency) and [unit](#unit) props,
respectively.

### Currency

The `currency` to use when formatting the value. Possible values are the ISO
4217 currency codes, such as "USD" for the US dollar, "EUR" for the euro, or
"CNY" for the Chinese RMB — see the
[Current currency & funds code list](https://www.six-group.com/en/products-services/financial-information/data-standards.html#scrollTo=currency-codes).

When a `currency` is provided the [format](#format) property will be derived
automatically.

```jsx {% live=true %}
<Numeral value={98.7654} currency="AUD" />
```

### Units

[A limited set](https://tc39.es/proposal-unified-intl-numberformat/section6/locales-currencies-tz_proposed_out.html#sec-issanctionedsimpleunitidentifier)
of unit identifiers is available. Pairs of simple units can be concatenated with
"-per-" to make a compound unit.

When a `unit` is provided the [format](#format) property will be derived
automatically.

```jsx {% live=true %}
<Numeral value={98} unit="kilometer-per-hour" />
```

### Abbreviations

For interfaces with limited real estate you may want to `abbreviate` some
numeric values.

```jsx {% live=true %}
<Flex gap="large">
  <Numeral value={12345} abbreviate />
  <Numeral value={123456} abbreviate="long" />
  <Numeral value={1234567} currency="EUR" abbreviate />
</Flex>
```

Be cautious when abbreviating [unit values](#unit). It may yield unexpected
results.

```jsx {% live=true %}
<Numeral value={123456.789} unit="kilometer" abbreviate />
```

### Precision

Override the default `precision` behaviour. Provide a tuple to allow minimum and
maximum fraction digits.

```jsx {% live=true %}
<Flex gap="large">
  <Numeral value={1234} precision={2} />
  <Numeral value={1234} precision={[0, 2]} />
  <Numeral value={1234.5678} precision={[0, 2]} />
</Flex>
```

Avoid setting precision when formatting [currency](#currency) values. Prefer the
ISO standard in most cases.

## Patterns

### Composition

Compose `Numeral` with other components to create rich interfaces.

```jsx {% live=true %}
<Flex direction="column" gap="large">
  <Heading>
    Acme Corporation shares hit <Numeral value={1456789} abbreviate /> today
  </Heading>
  <Text>
    We asked investors which private company’s stock they would most like to
    own. More than <Numeral value={0.80123} format="percent" /> of respondents
    picked Acme Corp.
  </Text>
  <Text>
    Hooli, Acme's parent component, went public earlier in the year. The median
    commitment was <Numeral value={1000} currency="AUD" precision={0} /> though
    the average was significantly higher.
  </Text>
</Flex>
```
