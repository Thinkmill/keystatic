import { AriaComboBoxProps } from '@react-types/combobox';
import {
  AsyncLoadable,
  LoadingState,
  TextInputBase,
} from '@react-types/shared';

import { FieldProps } from '@keystar/ui/field';
import { BaseStyleProps } from '@keystar/ui/style';

export type MenuTriggerAction = 'focus' | 'input' | 'manual';

export type ComboboxProps<T> = TextInputBase &
  Omit<AriaComboBoxProps<T>, 'menuTrigger'> &
  FieldProps &
  BaseStyleProps &
  Omit<AsyncLoadable, 'isLoading'> & {
    /**
     * The interaction required to display the Combobox menu. Note that this prop
     * has no effect on the mobile experience.
     * @default 'input'
     */
    menuTrigger?: MenuTriggerAction;
    /**
     * Direction the menu will render relative to the Combobox.
     * @default 'bottom'
     */
    direction?: 'bottom' | 'top';
    /** The current loading state of the Combobox. Determines whether or not the
     * progress circle should be shown. */
    loadingState?: LoadingState;
    /**
     * Whether the menu should automatically flip direction when space is limited.
     * @default true
     */
    shouldFlip?: boolean;
  };
