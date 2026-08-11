import { type ForwardedRef, type ReactElement, forwardRef } from 'react';

import { ComboboxBase } from './ComboboxBase';
import type { ComboboxMultiProps } from './types';

function ComboboxMulti<T extends object>(
  props: ComboboxMultiProps<T>,
  forwardedRef: ForwardedRef<HTMLDivElement>
) {
  return ComboboxBase(props, forwardedRef, 'multiple');
}

const _ComboboxMulti = forwardRef(ComboboxMulti) as <T extends object>(
  props: ComboboxMultiProps<T> & { ref?: ForwardedRef<HTMLDivElement> }
) => ReactElement;
export { _ComboboxMulti as ComboboxMulti };
