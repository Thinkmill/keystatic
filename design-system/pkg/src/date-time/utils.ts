import { useDisplayNames } from 'react-aria/private/datepicker/useDisplayNames';
import { createFocusManager } from 'react-aria/private/focus/FocusScope';
import { useDateFormatter } from 'react-aria/useDateFormatter';
import { useLayoutEffect } from 'react-aria/private/utils/useLayoutEffect';
import { useObjectRef } from 'react-aria/useObjectRef';
import { ReactNode, Ref, useImperativeHandle, useMemo, useState } from 'react';

export function useFormatHelpText(props: {
  description?: ReactNode;
  showFormatHelpText?: boolean;
}) {
  let formatter = useDateFormatter({ dateStyle: 'short' });
  let displayNames = useDisplayNames();
  return useMemo(() => {
    if (props.description) {
      return props.description;
    }

    if (props.showFormatHelpText) {
      return formatter
        .formatToParts(new Date())
        .map(s => {
          if (s.type === 'literal') {
            return s.value;
          }

          return displayNames.of(s.type);
        })
        .join(' ');
    }

    return '';
  }, [props.description, props.showFormatHelpText, formatter, displayNames]);
}

export function useVisibleMonths(maxVisibleMonths: number) {
  let [visibleMonths, setVisibleMonths] = useState(getVisibleMonths());
  useLayoutEffect(() => {
    let onResize = () => setVisibleMonths(getVisibleMonths());
    onResize();

    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return Math.max(1, Math.min(visibleMonths, maxVisibleMonths, 3));
}

// these calculations are brittle, they depend on styling decisions in both:
// - the `CalendarBase` component, from "@keystar/ui/calendar"
// - the `DatePickerPopover` component
function getVisibleMonths() {
  if (typeof window === 'undefined') {
    return 1;
  }
  let monthWidth = 248;
  let gap = 16;
  let dialogPadding = 20;
  return Math.floor(
    (window.innerWidth - dialogPadding * 2) / (monthWidth + gap)
  );
}

export function useFocusManagerRef(ref: Ref<HTMLDivElement>) {
  let domRef = useObjectRef<HTMLDivElement>(ref);
  // @ts-expect-error FIXME: not sure how to properly resolve this type issue
  useImperativeHandle(ref, () => ({
    ...domRef.current,
    focus() {
      createFocusManager(domRef).focusFirst({ tabbable: true });
    },
  }));
  return domRef;
}
