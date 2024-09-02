import { useDateRangePicker } from '@react-aria/datepicker';
import { useFocusRing } from '@react-aria/focus';
import { useHover } from '@react-aria/interactions';
import { mergeProps } from '@react-aria/utils';
import { useDateRangePickerState } from '@react-stately/datepicker';
import { DateValue } from '@react-types/datepicker';
import React, { ReactElement, Ref, useRef } from 'react';

import { FieldButton } from '@keystar/ui/button';
import { RangeCalendar } from '@keystar/ui/calendar';
import { useProviderProps } from '@keystar/ui/core';
import { FieldPrimitive } from '@keystar/ui/field';
import { Icon } from '@keystar/ui/icon';
import { calendarDaysIcon } from '@keystar/ui/icon/icons/calendarDaysIcon';
import { Text } from '@keystar/ui/typography';

import { Input } from './Input';
import { DatePickerField } from './DatePickerField';
import { usePickerStyles } from './DatePicker';
import { DatePickerPopover } from './DatePickerPopover';
import { DateRangePickerProps } from './types';
import {
  useFocusManagerRef,
  useFormatHelpText,
  useVisibleMonths,
} from './utils';

function DateRangePicker<T extends DateValue>(
  props: DateRangePickerProps<T>,
  forwardedRef: Ref<HTMLDivElement>
) {
  props = useProviderProps(props);
  let {
    autoFocus,
    isDisabled,
    isReadOnly,
    maxVisibleMonths = 1,
    pageBehavior,
  } = props;
  let { hoverProps, isHovered } = useHover({ isDisabled });

  let triggerRef = useRef<HTMLDivElement>(null);
  let domRef = useFocusManagerRef(forwardedRef);
  let state = useDateRangePickerState(props);
  if (props.errorMessage) {
    state = {
      ...state,
      validationState: 'invalid',
    };
  }
  let {
    buttonProps,
    calendarProps,
    descriptionProps,
    dialogProps,
    endFieldProps,
    errorMessageProps,
    groupProps,
    labelProps,
    startFieldProps,
  } = useDateRangePicker(props, state, triggerRef);

  let { isFocused, isFocusVisible, focusProps } = useFocusRing({
    within: true,
    isTextInput: true,
    autoFocus,
  });

  let { isFocused: isFocusedButton, focusProps: focusPropsButton } =
    useFocusRing({
      within: false,
      isTextInput: false,
      autoFocus,
    });

  // Note: this description is intentionally not passed to useDateRangePicker.
  // The format help text is unnecessary for screen reader users because each segment already has a label.
  let description = useFormatHelpText(props);
  if (description && !props.description) {
    const { id, ..._descriptionProps } = descriptionProps;
    descriptionProps = _descriptionProps;
  }

  let visibleMonths = useVisibleMonths(maxVisibleMonths);

  let styleProps = usePickerStyles({
    isHovered,
    isFocused,
    isFocusVisible: isFocusVisible && !isFocusedButton,
    isDisabled,
    isReadOnly,
    isInvalid: state.validationState === 'invalid',
  });

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
      <div
        {...mergeProps(groupProps, hoverProps, focusProps)}
        {...styleProps.root}
        ref={triggerRef}
      >
        <Input
          isDisabled={isDisabled}
          validationState={state.validationState}
          disableFocusRing
          {...styleProps.input}
        >
          {/* @ts-expect-error can't reconcile changes to react-aria errorMessage fn type */}
          <DatePickerField
            rangeFieldType="start"
            data-testid="start-date"
            {...startFieldProps}
          />
          {/* em—dash */}
          <Text aria-hidden="true" trim={false}>
            {'\u2014'}
          </Text>
          {/* @ts-expect-error can't reconcile changes to react-aria errorMessage fn type */}
          <DatePickerField
            rangeFieldType="end"
            data-testid="end-date"
            {...endFieldProps}
          />
        </Input>
        <FieldButton
          {...mergeProps(buttonProps, focusPropsButton)}
          {...styleProps.button}
          validationState={state.validationState}
          isDisabled={isDisabled || isReadOnly}
        >
          <Icon src={calendarDaysIcon} />
        </FieldButton>
        <DatePickerPopover
          dialogProps={dialogProps}
          shouldFlip={props.shouldFlip}
          state={state}
          triggerRef={triggerRef}
        >
          <RangeCalendar
            {...calendarProps}
            visibleMonths={visibleMonths}
            pageBehavior={pageBehavior}
          />
        </DatePickerPopover>
      </div>
    </FieldPrimitive>
  );
}

// forwardRef doesn't support generic parameters, so cast the result to the correct type
// https://stackoverflow.com/questions/58469229/react-with-typescript-generics-while-using-react-forwardref

/**
 * DateRangePickers combine two DateFields and a RangeCalendar popover to allow users
 * to enter or select a date and time range.
 */
const _DateRangePicker: <T extends DateValue>(
  props: DateRangePickerProps<T> & { ref?: Ref<HTMLDivElement> }
) => ReactElement = React.forwardRef(DateRangePicker as any) as any;
export { _DateRangePicker as DateRangePicker };
