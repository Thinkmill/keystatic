import { useDatePicker } from '@react-aria/datepicker';
import { useFocusRing } from '@react-aria/focus';
import { useHover } from '@react-aria/interactions';
import { mergeProps } from '@react-aria/utils';
import { useDatePickerState } from '@react-stately/datepicker';
import { DateValue } from '@react-types/datepicker';
import React, { ReactElement, Ref, useRef } from 'react';

import { FieldButton } from '@keystar/ui/button';
import { Calendar } from '@keystar/ui/calendar';
import { useProviderProps } from '@keystar/ui/core';
import { FieldPrimitive } from '@keystar/ui/field';
import { Icon } from '@keystar/ui/icon';
import { calendarDaysIcon } from '@keystar/ui/icon/icons/calendarDaysIcon';
import {
  css,
  toDataAttributes,
  tokenSchema,
  transition,
} from '@keystar/ui/style';

import { DatePickerField } from './DatePickerField';
import { DatePickerPopover } from './DatePickerPopover';
import { Input } from './Input';
import { DatePickerProps } from './types';
import {
  useFocusManagerRef,
  useFormatHelpText,
  useVisibleMonths,
} from './utils';

function DatePicker<T extends DateValue>(
  props: DatePickerProps<T>,
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
  let state = useDatePickerState(props);
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
    errorMessageProps,
    fieldProps,
    groupProps,
    labelProps,
  } = useDatePicker(props, state, triggerRef);

  let { isFocused, focusProps } = useFocusRing({
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

  // Note: this description is intentionally not passed to useDatePicker.
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
    // prefer focusring appearance, regardless of input modality. otherwise it looks like a read-only field
    isFocusVisible: isFocused && !isFocusedButton,
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
          <DatePickerField {...fieldProps} data-testid="date-field" />
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
          <Calendar
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
 * DatePickers combine a DateField and a Calendar popover to allow users to
 * enter or select a date and time value.
 */
const _DatePicker: <T extends DateValue>(
  props: DatePickerProps<T> & { ref?: Ref<HTMLDivElement> }
) => ReactElement = React.forwardRef(DatePicker as any) as any;
export { _DatePicker as DatePicker };

export function usePickerStyles(state: {
  isHovered: boolean;
  isFocused: boolean;
  isFocusVisible: boolean;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  isInvalid?: boolean;
}) {
  let root = {
    ...toDataAttributes(state, {
      omitFalsyValues: true,
      trimBooleanKeys: true,
    }),
    className: css({
      borderRadius: tokenSchema.size.radius.regular,
      display: 'flex',
      position: 'relative',

      '&::after': {
        borderRadius: `inherit`,
        content: '""',
        inset: tokenSchema.size.border.regular,
        margin: 0,
        pointerEvents: 'none',
        position: 'absolute' as const,
        transition: transition(['box-shadow', 'margin'], {
          easing: 'easeOut',
        }),
      },
      '&[data-focus-visible]::after': {
        boxShadow: `0 0 0 ${tokenSchema.size.alias.focusRing} ${tokenSchema.color.alias.focusRing}`,
      },
    }),
  };
  let input = {
    className: css({
      borderStartEndRadius: 0,
      borderEndEndRadius: 0,
      borderInlineEndWidth: 0,

      [`.${root.className}[data-focused] &`]: {
        borderColor: tokenSchema.color.alias.borderFocused,
      },
    }),
  };
  let button = {
    UNSAFE_className: css({
      borderStartStartRadius: 0,
      borderEndStartRadius: 0,

      [`.${root.className}[data-read-only] &`]: {
        borderColor: tokenSchema.color.alias.borderIdle,
      },
      [`.${root.className}[data-invalid] &`]: {
        borderColor: tokenSchema.color.alias.borderInvalid,
      },
      [`.${root.className}[data-focused] &`]: {
        borderColor: tokenSchema.color.alias.borderFocused,
      },
      [`.${root.className}[data-disabled] &`]: {
        borderColor: 'transparent',
      },
    }),
  };

  return { button, input, root };
}
