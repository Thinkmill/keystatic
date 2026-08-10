import {
  DateRangePicker as AriaDateRangePicker,
  type DateRangePickerProps as AriaDateRangePickerProps,
  type DateValue,
} from 'react-aria-components/DateRangePicker';
import { Dialog } from 'react-aria-components/Dialog';
import { Group } from 'react-aria-components/Group';
import React, { ReactElement, Ref } from 'react';

import { FieldButton } from '@keystar/ui/button';
import { RangeCalendar } from '@keystar/ui/calendar';
import { useProviderProps } from '@keystar/ui/core';
import { Icon } from '@keystar/ui/icon';
import { Popover } from '@keystar/ui/overlays';
import { calendarDaysIcon } from '@keystar/ui/icon/icons/calendarDaysIcon';
import {
  classNames,
  css,
  filterStyleProps,
  tokenSchema,
  useStyleProps,
} from '@keystar/ui/style';
import { Text } from '@keystar/ui/typography';

import {
  pickerButtonClassName,
  pickerCalendarContainerClassName,
  pickerDialogClassName,
  pickerGroupClassName,
  pickerInputClassName,
  pickerPopoverClassName,
  pickerRootClassName,
} from './DatePicker';
import { DateRangePickerProps } from './types';
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

function DateRangePicker<T extends DateValue>(
  props: DateRangePickerProps<T>,
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
    <AriaDateRangePicker
      {...(filterStyleProps(otherProps) as AriaDateRangePickerProps<T>)}
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
        <SegmentedDateInput
          slot="start"
          data-testid="start-date"
          className={classNames(pickerInputClassName, rangeStartClassName)}
        />
        <Text aria-hidden="true" trim={false}>
          {'\u2014'}
        </Text>
        <SegmentedDateInput
          slot="end"
          data-testid="end-date"
          className={classNames(pickerInputClassName, rangeEndClassName)}
        />
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
        hideArrow
        UNSAFE_className={pickerPopoverClassName}
      >
        <Dialog className={pickerDialogClassName}>
          <div className={pickerCalendarContainerClassName}>
            <RangeCalendar
              visibleMonths={visibleMonths}
              pageBehavior={pageBehavior}
            />
          </div>
        </Dialog>
      </Popover>
      <FieldErrorElement>{errorMessage}</FieldErrorElement>
    </AriaDateRangePicker>
  );
}

const rangeStartClassName = css({
  borderEndEndRadius: 0,
  borderStartEndRadius: 0,
  paddingInlineEnd: tokenSchema.size.space.regular,
});

const rangeEndClassName = css({
  borderRadius: 0,
  paddingInlineStart: tokenSchema.size.space.regular,
});

/** Date range pickers combine two segmented inputs with a range calendar. */
const _DateRangePicker: <T extends DateValue>(
  props: DateRangePickerProps<T> & { ref?: Ref<HTMLDivElement> }
) => ReactElement = React.forwardRef(DateRangePicker as any) as any;
export { _DateRangePicker as DateRangePicker };
