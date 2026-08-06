import {
  DatePicker as AriaDatePicker,
  type DatePickerProps as AriaDatePickerProps,
  type DateValue,
} from 'react-aria-components/DatePicker';
import { Dialog } from 'react-aria-components/Dialog';
import { Group } from 'react-aria-components/Group';
import { Popover } from 'react-aria-components/Popover';
import React, { ReactElement, Ref } from 'react';

import { FieldButton } from '@keystar/ui/button';
import { Calendar } from '@keystar/ui/calendar';
import { useProviderProps } from '@keystar/ui/core';
import { Icon } from '@keystar/ui/icon';
import { calendarDaysIcon } from '@keystar/ui/icon/icons/calendarDaysIcon';
import {
  classNames,
  css,
  filterStyleProps,
  tokenSchema,
  useStyleProps,
} from '@keystar/ui/style';

import { DatePickerProps } from './types';
import { SegmentedDateInput } from './SegmentedDateInput';
import {
  useFocusManagerRef,
  useFormatHelpText,
  useVisibleMonths,
} from './utils';
import {
  FieldDescriptionElement,
  FieldErrorElement,
  FieldLabelElement,
  fieldRootClassName,
} from '../field/FieldElements';

function DatePicker<T extends DateValue>(
  props: DatePickerProps<T>,
  forwardedRef: Ref<HTMLDivElement>
) {
  props = useProviderProps(props);
  let {
    contextualHelp,
    errorMessage,
    isRequired,
    label,
    labelElementType: _labelElementType,
    maxVisibleMonths = 1,
    pageBehavior,
    shouldFlip,
    ...otherProps
  } = props;
  let description = useFormatHelpText(props);
  let visibleMonths = useVisibleMonths(maxVisibleMonths);
  let domRef = useFocusManagerRef(forwardedRef);
  let styleProps = useStyleProps(props);

  return (
    <AriaDatePicker
      {...(filterStyleProps(otherProps) as AriaDatePickerProps<T>)}
      ref={domRef}
      isInvalid={Boolean(errorMessage)}
      isRequired={isRequired}
      className={classNames(
        fieldRootClassName,
        pickerRootClassName,
        styleProps.className
      )}
      style={styleProps.style}
    >
      <FieldLabelElement
        contextualHelp={contextualHelp}
        isRequired={isRequired}
        label={label}
      />
      <FieldDescriptionElement>{description}</FieldDescriptionElement>
      <Group className={pickerGroupClassName}>
        <SegmentedDateInput className={pickerInputClassName} />
        <FieldButton
          UNSAFE_className={pickerButtonClassName}
          aria-label="Open calendar"
        >
          <Icon src={calendarDaysIcon} />
        </FieldButton>
      </Group>
      <Popover
        placement="bottom start"
        shouldFlip={shouldFlip}
        className={pickerPopoverClassName}
      >
        <Dialog className={pickerDialogClassName}>
          <div className={pickerCalendarContainerClassName}>
            <Calendar
              visibleMonths={visibleMonths}
              pageBehavior={pageBehavior}
            />
          </div>
        </Dialog>
      </Popover>
      <FieldErrorElement>{errorMessage}</FieldErrorElement>
    </AriaDatePicker>
  );
}

/** Date pickers combine segmented input with a calendar popover. */
const _DatePicker: <T extends DateValue>(
  props: DatePickerProps<T> & { ref?: Ref<HTMLDivElement> }
) => ReactElement = React.forwardRef(DatePicker as any) as any;
export { _DatePicker as DatePicker };

export const pickerGroupClassName = css({
  borderRadius: tokenSchema.size.radius.regular,
  display: 'flex',
  position: 'relative',
});

export const pickerRootClassName = css({
  [`&[data-focus-within] .${pickerGroupClassName}`]: {
    borderColor: tokenSchema.color.alias.borderFocused,
  },
});

export const pickerInputClassName = css({
  borderEndEndRadius: 0,
  borderInlineEndWidth: 0,
  borderStartEndRadius: 0,
});

export const pickerButtonClassName = css({
  borderEndStartRadius: 0,
  borderStartStartRadius: 0,
});

export const pickerPopoverClassName = css({
  backgroundColor: tokenSchema.color.background.surface,
  border: `${tokenSchema.size.border.regular} solid ${tokenSchema.color.border.emphasis}`,
  borderRadius: tokenSchema.size.radius.medium,
  boxSizing: 'content-box',
  filter: `drop-shadow(0 1px 4px ${tokenSchema.color.shadow.regular})`,
  outline: 0,
});

export const pickerDialogClassName = css({
  display: 'flex',
  justifyContent: 'center',
  maxHeight: 'inherit',
  outline: 0,
  overflowY: 'auto',
  WebkitOverflowScrolling: 'touch',
});

export const pickerCalendarContainerClassName = css({
  paddingInline: tokenSchema.size.space.medium,
  paddingTop: tokenSchema.size.space.medium,
  '&::after': {
    content: '""',
    display: 'block',
    height: tokenSchema.size.space.medium,
  },
});
