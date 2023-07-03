import { useNumberFormatter } from '@react-aria/i18n';
import { assert, isInteger } from 'emery';
import { ForwardedRef, forwardRef } from 'react';

import { useHeadingContext } from './heading';
import { Text } from './text';

type Format = 'currency' | 'decimal' | 'percent' | 'unit';

export type NumeralProps = {
  /**
   * How the value should be abbreviated, if at all.
   */
  abbreviate?: boolean | 'short' | 'long';
  /**
   * The currency to use when formatting "currency" values. [Possible
   * values](https://www.six-group.com/en/products-services/financial-information/data-standards.html#scrollTo=currency-codes)
   * are the ISO 4217 currency codes, such as "USD" for the US dollar, "EUR" for
   * the euro, etc.
   */
  currency?: string;
  /**
   * The formatting style to use.
   *
   * @default 'decimal'
   */
  format?: Format;
  /** Override the default precision. Supports a tuple for min/max. */
  precision?: number | [number, number];
  /**
   * The unit to use when formatting "unit" values. [Possible
   * values](https://tc39.es/proposal-unified-intl-numberformat/section6/locales-currencies-tz_proposed_out.html#sec-issanctionedsimpleunitidentifier)
   * may be concatenated with "-per-" to make a compound unit.
   */
  unit?: string;
  /** The numeric value to format. */
  value: number;
};

export const Numeral = forwardRef(function Numeral(
  props: NumeralProps,
  forwardedRef: ForwardedRef<HTMLElement>
) {
  props = useDerivedProps(props);
  validateProps(props);

  const formatter = useNumberFormatter(optionsByFormat(props));
  const { abbreviate, format, value, ...textProps } = props;
  const headingContext = useHeadingContext();
  const formattedText = formatter.format(value);

  if (headingContext) {
    return <span ref={forwardedRef}>{formattedText}</span>;
  }

  return (
    <Text ref={forwardedRef} {...textProps}>
      {formattedText}
    </Text>
  );
});

// Utils
// ----------------------------------------------------------------------------

function getFormat(props: NumeralProps): Format {
  const { format, currency, unit } = props;

  if (format) {
    return format;
  }
  if (currency) {
    return 'currency';
  }
  if (unit) {
    return 'unit';
  }

  return 'decimal';
}
function useDerivedProps(props: NumeralProps) {
  return { ...props, format: getFormat(props) };
}

function toFractionDigits(precision?: NumeralProps['precision']) {
  return Array.isArray(precision) ? precision : [precision, precision];
}

function optionsByFormat(props: NumeralProps): Intl.NumberFormatOptions {
  const { abbreviate, format, precision, currency, unit } = props;
  const notation = abbreviate ? 'compact' : undefined;
  const [minimumFractionDigits, maximumFractionDigits] =
    toFractionDigits(precision);
  const common = {
    maximumFractionDigits,
    minimumFractionDigits,
    notation,
    compactDisplay: abbreviate === 'long' ? 'long' : 'short',
  } as const;

  switch (format) {
    case 'currency':
      return {
        ...common,
        style: 'currency',
        currency,
        currencyDisplay: 'narrowSymbol',
      };
    case 'percent':
      return { ...common, style: 'percent' };
    case 'unit':
      return { ...common, style: 'unit', unit, unitDisplay: 'narrow' };
    default:
      return common;
  }
}

function validateProps(props: NumeralProps) {
  const { format, currency, precision, unit } = props;

  assert(
    currency ? format === 'currency' : true,
    'When format is "currency", the currency property must be provided.'
  );
  assert(
    unit ? format === 'unit' : true,
    'When format is "unit", the unit property must be provided.'
  );
  assert(
    !(currency && unit),
    'Formatting of "currency" and "unit" cannot be combined.'
  );
  if (precision) {
    assert(
      Array.isArray(precision)
        ? precision.every(isInteger)
        : isInteger(precision),
      'Precision must be an integer, or an integer tuple for min/max.'
    );
  }
}
