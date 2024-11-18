import { AriaComboBoxProps } from '@react-types/combobox';
import {
  AsyncLoadable,
  CollectionBase,
  FocusableProps,
  Key,
  LoadingState,
  MultipleSelection,
  TextInputBase,
  Validation,
} from '@react-types/shared';

import { FieldProps } from '@keystar/ui/field';
import { BaseStyleProps } from '@keystar/ui/style';

type CommonProps = {
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
  menuTrigger?: 'focus' | 'input' | 'manual';
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

export type ComboboxProps<T> = TextInputBase &
  Omit<AriaComboBoxProps<T>, 'menuTrigger'> &
  FieldProps &
  BaseStyleProps &
  Omit<AsyncLoadable, 'isLoading'> &
  CommonProps;

export interface ComboboxMultiValidationValue {
  /** The selected key in the ComboBox. */
  selectedKeys: Set<Key>;
  /** The value of the ComboBox input. */
  inputValue: string;
}
export interface ComboboxMultiProps<T>
  extends CollectionBase<T>,
    Omit<MultipleSelection, 'disallowEmptySelection'>,
    Omit<AsyncLoadable, 'isLoading'>,
    TextInputBase,
    FocusableProps<HTMLInputElement>,
    Validation<ComboboxMultiValidationValue>,
    CommonProps,
    FieldProps {
  /** The list of ComboBox items (uncontrolled). */
  defaultItems?: Iterable<T>;
  /** The list of ComboBox items (controlled). */
  items?: Iterable<T>;
  /** Method that is called when the open state of the menu changes. Returns the new open state and the action that caused the opening of the menu. */
  onOpenChange?: (isOpen: boolean) => void;
  /** The value of the ComboBox input (controlled). */
  inputValue?: string;
  /** The default value of the ComboBox input (uncontrolled). */
  defaultInputValue?: string;
  /** Handler that is called when the ComboBox input value changes. */
  onInputChange?: (value: string) => void;
}
