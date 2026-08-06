import {
  DateField as AriaDateField,
  type DateFieldProps as AriaDateFieldProps,
  type DateValue,
} from 'react-aria-components/DateField';
import React, { ReactElement, Ref } from 'react';

import { useProviderProps } from '@keystar/ui/core';
import { classNames, filterStyleProps, useStyleProps } from '@keystar/ui/style';

import { SegmentedDateInput } from './SegmentedDateInput';
import { DateFieldProps } from './types';
import { useFocusManagerRef, useFormatHelpText } from './utils';
import {
  FieldDescriptionElement,
  FieldErrorElement,
  FieldLabelElement,
  fieldRootClassName,
} from '../field/FieldElements';

function DateField<T extends DateValue>(
  props: DateFieldProps<T>,
  ref: Ref<HTMLDivElement>
) {
  props = useProviderProps(props);
  let domRef = useFocusManagerRef(ref);
  let description = useFormatHelpText(props);
  let {
    contextualHelp,
    errorMessage,
    isRequired,
    label,
    labelElementType: _labelElementType,
    ...otherProps
  } = props;
  let styleProps = useStyleProps(props);

  return (
    <AriaDateField
      {...(filterStyleProps(otherProps) as AriaDateFieldProps<T>)}
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
    </AriaDateField>
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
