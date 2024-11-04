import { createCalendar } from '@internationalized/date';
import { useDateField } from '@react-aria/datepicker';
import { useLocale } from '@react-aria/i18n';
import { useDateFieldState } from '@react-stately/datepicker';
import { DateValue } from '@react-types/datepicker';
import React, { ReactElement, Ref, useRef } from 'react';

import { useProviderProps } from '@keystar/ui/core';
import { FieldPrimitive } from '@keystar/ui/field';

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

  let fieldRef = useRef<HTMLDivElement>(null);
  let inputRef = useRef<HTMLInputElement>(null);
  let {
    descriptionProps,
    errorMessageProps,
    fieldProps,
    inputProps,
    labelProps,
  } = useDateField({ ...props, inputRef }, state, fieldRef);

  // Note: this description is intentionally not passed to useDatePicker.
  // The format help text is unnecessary for screen reader users because each segment already has a label.
  let description = useFormatHelpText(props);
  if (description && !props.description) {
    let { id, ..._descriptionProps } = descriptionProps;
    descriptionProps = _descriptionProps;
  }
  if (props.errorMessage) {
    state = {
      ...state,
      validationState: 'invalid',
    };
  }

  return (
    <FieldPrimitive
      {...props}
      ref={domRef}
      description={description}
      labelElementType="span"
      labelProps={labelProps}
      descriptionProps={descriptionProps}
      errorMessageProps={errorMessageProps}
      // validationState={state.validationState}
    >
      <Input
        ref={fieldRef}
        disableFocusRing={isReadOnly}
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
        <input {...inputProps} ref={inputRef} />
      </Input>
    </FieldPrimitive>
  );
}

// forwardRef doesn't support generic parameters, so cast the result to the correct type
// https://stackoverflow.com/questions/58469229/react-with-typescript-generics-while-using-react-forwardref

/**
 * DateFields allow users to enter and edit date and time values using a keyboard.
 * Each part of a date value is displayed in an individually editable segment.
 */
const _DateField: <T extends DateValue>(
  props: DateFieldProps<T> & { ref?: Ref<HTMLDivElement> }
) => ReactElement = React.forwardRef(DateField as any) as any;
export { _DateField as DateField };
