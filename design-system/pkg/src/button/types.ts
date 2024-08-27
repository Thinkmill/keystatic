import {
  AriaLabelingProps,
  DOMProps,
  FocusableDOMProps,
  FocusableProps,
  Orientation,
  PressEvents,
  ValidationState,
} from '@react-types/shared';
import { ReactNode } from 'react';

import { BaseStyleProps } from '@keystar/ui/style';
import { AnchorDOMProps } from '@keystar/ui/types';

export type ButtonProminence = 'default' | 'high' | 'low';
export type ButtonTone = 'neutral' | 'accent' | 'critical';

// Common
// -----------------------------------------------------------------------------

type AriaProps = {
  /** Indicates whether the element, or another grouping element it controls, is currently expanded or collapsed. */
  'aria-expanded'?: boolean | 'true' | 'false';
  /** Indicates the availability and type of interactive popup element, such as menu or dialog, that can be triggered by an element. */
  'aria-haspopup'?:
    | boolean
    | 'false'
    | 'true'
    | 'menu'
    | 'listbox'
    | 'tree'
    | 'grid'
    | 'dialog';
  /** Identifies the element (or elements) whose contents or presence are controlled by the current element. */
  'aria-controls'?: string;
  /** Indicates the current "pressed" state of toggle buttons. */
  'aria-pressed'?: boolean | 'true' | 'false' | 'mixed';
  /**
   * The behavior of the button when used in an HTML form.
   * @default 'button'
   */
  type?: 'button' | 'submit' | 'reset';
  /** Identifies the form element that should be used when type="submit" */
  form?: string;
};

// ActionButton
// -----------------------------------------------------------------------------

export type CommonActionButtonProps = {
  /** The content to display in the button. */
  children?: ReactNode;
  /** Whether the button is disabled. */
  isDisabled?: boolean;
  /**
   * The static style to apply. Useful when the button appears over a
   * background.
   */
  static?: 'light' | 'dark';
  /**
   * The visual prominence of the button.
   * @default 'default'
   */
  prominence?: 'default' | 'low';
} & PressEvents &
  FocusableProps &
  FocusableDOMProps &
  AriaLabelingProps &
  BaseStyleProps;

export type ActionButtonElementProps = {
  /** Whether the button is selected. */
  isSelected?: boolean;
} & CommonActionButtonProps &
  AriaProps;

export type ActionLinkElementProps = CommonActionButtonProps & AnchorDOMProps;

export type ActionButtonProps =
  | ActionButtonElementProps
  | ActionLinkElementProps;

// ToggleButton
// -----------------------------------------------------------------------------

export type ToggleButtonProps = {
  /** Whether the element should be selected (controlled). */
  isSelected?: boolean;
  /** Whether the element should be selected (uncontrolled). */
  defaultSelected?: boolean;
  /** Handler that is called when the element's selection state changes. */
  onChange?: (isSelected: boolean) => void;
} & ActionButtonProps;

// FieldButton
// -----------------------------------------------------------------------------

// The `FieldButton` is a special variant of the `ActionButton` that is used in
// fields. Where it would be preferable to respond to e.g. `aria-invalid` or
// `aria-expanded` on the field itself, this is not practical in all cases.
// Thus, props are provided for styling this component while the appropriate
// accessibility attributes could be applied to the parent or ancestor etc.
export type FieldButtonProps = ActionButtonProps & {
  isActive?: boolean;
  validationState?: ValidationState;
};

// Button
// -----------------------------------------------------------------------------

export type CommonButtonProps = {
  /** The content to display in the button. */
  children?: ReactNode;
  /** Whether the button is disabled. */
  isDisabled?: boolean;
  /**
   * The static style to apply. Useful when the button appears over a
   * background. Ignores tone.
   */
  static?: 'light' | 'dark';
  /**
   * The visual prominence of the button.
   * @default 'default'
   */
  prominence?: ButtonProminence;
  /**
   * The tone of the button.
   * @default 'neutral'
   */
  tone?: ButtonTone;
} & PressEvents &
  FocusableProps &
  FocusableDOMProps &
  AriaLabelingProps &
  BaseStyleProps;

export type ButtonElementProps = CommonButtonProps &
  AriaProps & {
    /** Disable events and display a progress indicator. */
    isPending?: boolean;
  };

export type LinkElementProps = CommonButtonProps & AnchorDOMProps;

export type ButtonProps = ButtonElementProps | LinkElementProps;

// ButtonGroup
// -----------------------------------------------------------------------------

export type ButtonGroupProps = {
  /**
   * The alignment of the buttons within the button group.
   * @default 'start'
   */
  align?: 'start' | 'end' | 'center';
  /** The buttons contained within the button group. */
  children: ReactNode;
  /** Whether the buttons in the button group are all disabled. */
  isDisabled?: boolean;
  /**
   * The axis the button group should align with. Setting this will prevent
   * switching behavior.
   * @default 'horizontal'
   */
  orientation?: Orientation;
} & DOMProps &
  BaseStyleProps;
