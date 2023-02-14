export interface InputBaseProps {
  /**
   * When true, the field is not editable, focusable, or even submitted with
   * the owning form.
   */
  isDisabled?: boolean;
  /**
   * When true, the input can be selected but not changed by the user.
   */
  isReadOnly?: boolean;
  /**
   * When true, the user must specify a value for the input before the
   * owning form can be submitted.
   */
  isRequired?: boolean;
}
export interface ValueBase<T, C = T> {
  /** The current value (controlled). */
  value?: T;
  /** The default value (uncontrolled). */
  defaultValue?: T;
  /** Handler that is called when the value changes. */
  onChange?: (value: C) => void;
}
export interface RangeInputBase<T> {
  /** The minimum value allowed for the input. */
  minValue?: T;
  /** The maximum value allowed for the input. */
  maxValue?: T;
  /** The amount that the input value changes with each increment or decrement. */
  step?: T;
}
