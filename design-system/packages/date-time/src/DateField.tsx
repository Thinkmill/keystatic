import { createCalendar } from '@internationalized/date';
import { useDateField } from '@react-aria/datepicker';
import { useLocale } from '@react-aria/i18n';
import { useDateFieldState } from '@react-stately/datepicker';
import { DateValue } from '@react-types/datepicker';
import React, { ReactElement, Ref, useRef } from 'react';

import { useProviderProps } from '@voussoir/core';
import { FieldPrimitive } from '@voussoir/field';

import { Input } from './Input';
import { InputSegment } from './InputSegment';
import { DateFieldProps } from './types';
import { useFocusManagerRef, useFormatHelpText } from './utils';

function DateField<T extends DateValue>(
  props: DateFieldProps<T>,
  ref: Ref<HTMLDivElement>
) {
  props = useProviderProps(props);
  let { autoFocus, isDisabled, isReadOnly, isRequired } = props;

  let domRef = useFocusManagerRef(ref);
  let { locale } = useLocale();
  let state = useDateFieldState({
    ...props,
    locale,
    createCalendar,
  });

  let inputRef = useRef(null);
  let { labelProps, fieldProps, descriptionProps, errorMessageProps } =
    useDateField(props, state, inputRef);

  // Note: this description is intentionally not passed to useDatePicker.
  // The format help text is unnecessary for screen reader users because each segment already has a label.
  let description = useFormatHelpText(props);
  if (description && !props.description) {
    descriptionProps.id = undefined;
  }
  if (props.errorMessage) {
    state.validationState = 'invalid';
  }

  return (
    <FieldPrimitive
      {...props}
      ref={domRef}
      description={description}
      labelProps={labelProps}
      descriptionProps={descriptionProps}
      errorMessageProps={errorMessageProps}
      // validationState={state.validationState}
    >
      <Input
        ref={inputRef}
        fieldProps={fieldProps}
        isDisabled={isDisabled}
        autoFocus={autoFocus}
        validationState={state.validationState}
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
      </Input>
    </FieldPrimitive>
  );
}

/**
 * DateFields allow users to enter and edit date and time values using a keyboard.
 * Each part of a date value is displayed in an individually editable segment.
 */
const _DateField = React.forwardRef(DateField) as <T extends DateValue>(
  props: DateFieldProps<T> & { ref?: Ref<HTMLDivElement> }
) => ReactElement;
export { _DateField as DateField };
