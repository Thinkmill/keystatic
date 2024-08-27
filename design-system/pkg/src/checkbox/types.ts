import { AriaCheckboxGroupProps } from '@react-aria/checkbox';
import {
  DOMProps,
  InputBase,
  FocusableProps,
  Orientation,
} from '@react-types/shared';
import { ReactNode } from 'react';

import { FieldProps } from '@keystar/ui/field';
import { BaseStyleProps } from '@keystar/ui/style';

export type ToggleProps = {
  /**
   * The label for the element.
   */
  children?: ReactNode;
  /**
   * Whether the element should be selected (uncontrolled).
   */
  defaultSelected?: boolean;
  /** Whether user input is required on the input before form submission. */
  isRequired?: boolean;
  /**
   * Whether the element should be selected (controlled).
   */
  isSelected?: boolean;
  /**
   * Handler that is called when the element's selection state changes.
   */
  onChange?: (isSelected: boolean) => void;
  /**
   * The value of the input element, used when submitting an HTML form. See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#htmlattrdefvalue).
   */
  value?: string;
  /**
   * The name of the input element, used when submitting an HTML form. See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#htmlattrdefname).
   */
  name?: string;
} & InputBase &
  FocusableProps;

export type CheckboxProps = {
  /**
   * Indeterminism is presentational only.
   * The indeterminate visual representation remains regardless of user interaction.
   */
  isIndeterminate?: boolean;
  /**
   * The visual prominence of the checkbox.
   * @default 'default'
   */
  prominence?: 'default' | 'low';
} & ToggleProps &
  BaseStyleProps &
  DOMProps;

export type CheckboxGroupProps = AriaCheckboxGroupProps &
  FieldProps &
  BaseStyleProps & {
    /** The checkboxes contained within the group. */
    children: ReactNode;
    /**
     * The axis the checkboxes should align with.
     * @default 'vertical'
     */
    orientation?: Orientation;
  };
