import {
  TimeField as AriaTimeField,
  type TimeFieldProps as AriaTimeFieldProps,
  type TimeValue,
} from 'react-aria-components/TimeField';
import React, { ReactElement, Ref } from 'react';

import { useProviderProps } from '@keystar/ui/core';
import { classNames, filterStyleProps, useStyleProps } from '@keystar/ui/style';

import { SegmentedDateInput } from './SegmentedDateInput';
import { TimeFieldProps } from './types';
import { useFocusManagerRef } from './utils';
import {
  FieldDescriptionElement,
  FieldErrorElement,
  FieldLabelElement,
  fieldRootClassName,
} from '../field/FieldElements';

function TimeField<T extends TimeValue>(
  props: TimeFieldProps<T>,
  ref: Ref<HTMLDivElement>
) {
  props = useProviderProps(props);
  let domRef = useFocusManagerRef(ref);
  let {
    contextualHelp,
    description,
    errorMessage,
    isRequired,
    label,
    labelElementType: _labelElementType,
    ...otherProps
  } = props;
  let styleProps = useStyleProps(props);

  return (
    <AriaTimeField
      {...(filterStyleProps(otherProps) as AriaTimeFieldProps<T>)}
      ref={domRef}
      isInvalid={Boolean(errorMessage)}
      isRequired={isRequired}
      className={classNames(fieldRootClassName, styleProps.className)}
      style={styleProps.style}
    >
      <FieldLabelElement
        contextualHelp={contextualHelp}
        isRequired={isRequired}
        label={label}
      />
      <FieldDescriptionElement>{description}</FieldDescriptionElement>
      <SegmentedDateInput />
      <FieldErrorElement>{errorMessage}</FieldErrorElement>
    </AriaTimeField>
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
