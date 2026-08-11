import type { SelectProps as AriaSelectProps } from 'react-aria-components/Select';
import type { ListBoxProps } from '@keystar/ui/listbox';

import type { ActionButtonProps } from '@keystar/ui/button';
import type { FieldProps } from '@keystar/ui/field';
import type { BaseStyleProps } from '@keystar/ui/style';

export type PickerProps<T> = Omit<
  AriaSelectProps<T>,
  'children' | 'className' | 'style'
> &
  Pick<ListBoxProps<T>, 'children' | 'items' | 'dependencies'> &
  FieldProps &
  Pick<ActionButtonProps, 'prominence'> &
  BaseStyleProps & {
    align?: 'start' | 'end';
    autoFocus?: boolean;
    direction?: 'bottom' | 'top';
    menuWidth?: number;
    shouldFlip?: boolean;
  };
