import { useTimeField } from 'react-aria/useTimeField';
import { useLocale } from 'react-aria/I18nProvider';
import React, { ReactElement, Ref, useRef } from 'react';

import { TimeValue, useTimeFieldState } from 'react-stately/useTimeFieldState';

import { useProviderProps } from '@keystar/ui/core';
import { FieldPrimitive } from '@keystar/ui/field';

import { Input } from './Input';
import { InputSegment } from './InputSegment';
import { TimeFieldProps } from './types';
import { useFocusManagerRef } from './utils';

function TimeField<T extends TimeValue>(
  props: TimeFieldProps<T>,
  ref: Ref<HTMLDivElement>
) {
  props = useProviderProps(props);
  let { autoFocus, isDisabled } = props;

  let domRef = useFocusManagerRef(ref);
  let { locale } = useLocale();
  let state = useTimeFieldState({ ...props, locale });

  let inputRef = useRef(null);
  let { labelProps, fieldProps, descriptionProps, errorMessageProps } =
    useTimeField(props, state, inputRef);

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
        isInvalid={state.isInvalid}
      >
        {state.segments.map((segment, i) => (
          <InputSegment key={i} segment={segment} state={state} />
        ))}
      </Input>
    </FieldPrimitive>
  );
}

// forwardRef doesn't support generic parameters, so cast the result to the correct type
// https://stackoverflow.com/questions/58469229/react-with-typescript-generics-while-using-react-forwardref

/**
 * TimeFields allow users to enter and edit time values using a keyboard.
 * Each part of the time is displayed in an individually editable segment.
 */
const _TimeField: <T extends TimeValue>(
  props: TimeFieldProps<T> & { ref?: Ref<HTMLDivElement> }
) => ReactElement = React.forwardRef(TimeField as any) as any;
export { _TimeField as TimeField };
