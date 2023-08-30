import { DateValue, createCalendar } from '@internationalized/date';
import { useDateField } from '@react-aria/datepicker';
import { useLocale } from '@react-aria/i18n';
import { useDateFieldState } from '@react-stately/datepicker';
import { useRef } from 'react';

import { css, tokenSchema } from '@keystar/ui/style';

import { InputSegment } from './InputSegment';
import { DatePickerProps } from './types';

interface DatePickerFieldProps<T extends DateValue> extends DatePickerProps<T> {
  maxGranularity?: DatePickerProps<T>['granularity'];
  rangeFieldType?: 'start' | 'end';
}

/** @private for internal use only. */
export function DatePickerField<T extends DateValue>(
  props: DatePickerFieldProps<T>
) {
  let { isDisabled, isReadOnly, isRequired, rangeFieldType } = props;

  let fieldRef = useRef<HTMLDivElement>(null);
  let inputRef = useRef<HTMLInputElement>(null);
  let { locale } = useLocale();
  let state = useDateFieldState({ ...props, locale, createCalendar });
  let { fieldProps, inputProps } = useDateField(
    { ...props, inputRef },
    state,
    fieldRef
  );

  return (
    <div
      {...fieldProps}
      // @ts-expect-error
      data-testid={props['data-testid']}
      data-range={rangeFieldType}
      className={css({
        display: 'flex',

        '&[data-range=start]': {
          paddingInlineEnd: tokenSchema.size.space.regular,
        },
        '&[data-range=end]': {
          paddingInlineStart: tokenSchema.size.space.regular,
        },
      })}
      ref={fieldRef}
    >
      {state.segments.map((segment, i) => (
        <InputSegment
          key={i}
          segment={segment}
          state={state}
          isDisabled={isDisabled}
          isReadOnly={isReadOnly}
          isRequired={isRequired}
        />
      ))}
      <input {...inputProps} ref={inputRef} />
    </div>
  );
}
