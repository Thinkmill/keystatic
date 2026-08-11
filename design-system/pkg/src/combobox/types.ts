import type { ComboBoxProps as AriaComboBoxProps } from 'react-aria-components/ComboBox';
import type { ListBoxProps } from '@keystar/ui/listbox';

import type { FieldProps } from '@keystar/ui/field';
import type { BaseStyleProps } from '@keystar/ui/style';

type CommonProps<T, M extends 'single' | 'multiple'> = Omit<
  AriaComboBoxProps<T, M>,
  'children' | 'className' | 'style' | keyof FieldProps
> &
  Pick<ListBoxProps<T>, 'children' | 'dependencies'> &
  FieldProps &
  BaseStyleProps & {
    align?: 'start' | 'end';
    direction?: 'bottom' | 'top';
    menuWidth?: number;
    placeholder?: string;
    shouldFlip?: boolean;
  };

export type ComboboxProps<T> = CommonProps<T, 'single'>;
export type ComboboxMultiProps<T> = CommonProps<T, 'multiple'> & {
  selectionMode?: 'multiple';
};
