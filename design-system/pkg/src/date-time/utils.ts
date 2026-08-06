import { useLocale } from 'react-aria-components';
import { useDateFormatter } from 'react-aria/useDateFormatter';
import {
  useLayoutEffect,
  ReactNode,
  Ref,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import { useObjectRef } from 'react-aria/useObjectRef';

export function useFormatHelpText(props: {
  description?: ReactNode;
  showFormatHelpText?: boolean;
}) {
  let formatter = useDateFormatter({ dateStyle: 'short' });
  let { locale } = useLocale();
  let displayNames = useMemo(
    () => new Intl.DisplayNames(locale, { type: 'dateTimeField' }),
    [locale]
  );
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
      domRef.current
        ?.querySelector<HTMLElement>('[tabindex]:not([tabindex="-1"])')
        ?.focus();
    },
  }));
  return domRef;
}
