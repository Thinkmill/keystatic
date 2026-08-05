import { type ForwardedRef, type ReactElement, forwardRef } from 'react';

import { ComboboxBase } from './ComboboxBase';
import type { ComboboxProps } from './types';

function Combobox<T extends object>(
  props: ComboboxProps<T>,
  forwardedRef: ForwardedRef<HTMLDivElement>
) {
  return ComboboxBase(props, forwardedRef, 'single');
}

const _Combobox = forwardRef(Combobox) as <T extends object>(
  props: ComboboxProps<T> & { ref?: ForwardedRef<HTMLDivElement> }
) => ReactElement;
export { _Combobox as Combobox };
