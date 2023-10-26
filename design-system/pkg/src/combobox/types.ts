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
     * Alignment of the menu, relative to the combobox. Only relevant when
     * used in combination with the `menuWidth` prop.
     * @default 'start'
     */
    align?: 'start' | 'end';
    /**
     * Direction the menu will render relative to the combobox.
     * @default 'bottom'
     */
    direction?: 'bottom' | 'top';
    /** The current loading state of the Combobox. Determines whether or not the
     * progress circle should be shown. */
    loadingState?: LoadingState;
    /**
     * The interaction required to display the menu.
     *
     * NOTE: this prop has no effect on the mobile experience.
     * @default 'input'
     */
    menuTrigger?: MenuTriggerAction;
    /**
     * A fixed width for the menu. By default, the menu will match the
     * width of the combobox. Values less than the width of the combobox are ignored.
     *
     * NOTE: this prop has no effect on the mobile experience.
     */
    menuWidth?: number;
    /**
     * Whether the menu should automatically flip direction when space is limited.
     * @default true
     */
    shouldFlip?: boolean;
  };
