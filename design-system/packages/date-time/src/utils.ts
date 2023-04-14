import { createFocusManager } from '@react-aria/focus';
import { useDateFormatter } from '@react-aria/i18n';
import { useDisplayNames } from '@react-aria/datepicker';
import { useLayoutEffect } from '@react-aria/utils';
import { SpectrumDatePickerBase } from '@react-types/datepicker';
import { Ref, useImperativeHandle, useMemo, useRef, useState } from 'react';

import { useProvider } from '@voussoir/core';

export function useFormatHelpText(
  props: Pick<SpectrumDatePickerBase, 'description' | 'showFormatHelpText'>
) {
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

          // @ts-expect-error - not sure what's going on here
          return displayNames.of(s.type);
        })
        .join(' ');
    }

    return '';
  }, [props.description, props.showFormatHelpText, formatter, displayNames]);
}

export function useVisibleMonths(maxVisibleMonths: number) {
  let { scale } = useProvider();
  let [visibleMonths, setVisibleMonths] = useState(getVisibleMonths(scale));
  useLayoutEffect(() => {
    let onResize = () => setVisibleMonths(getVisibleMonths(scale));
    onResize();

    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, [scale]);

  return Math.max(1, Math.min(visibleMonths, maxVisibleMonths, 3));
}

function getVisibleMonths(scale: 'large' | 'medium') {
  if (typeof window === 'undefined') {
    return 1;
  }
  let monthWidth = scale === 'large' ? 336 : 280;
  let gap = scale === 'large' ? 30 : 24;
  let popoverPadding = scale === 'large' ? 32 : 48;
  return Math.floor(
    (window.innerWidth - popoverPadding * 2) / (monthWidth + gap)
  );
}

export function useFocusManagerRef(ref: Ref<HTMLDivElement>) {
  let domRef = useRef<HTMLDivElement>(null);
  // @ts-expect-error - useImperativeHandle wants all properties from `ref`, wtf???
  useImperativeHandle(ref, () => ({
    focus() {
      createFocusManager(domRef).focusFirst({ tabbable: true });
    },
  }));
  return domRef;
}
