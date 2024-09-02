import { LabelAria } from '@react-aria/label';
import { AriaLabelingProps, DOMProps, InputBase } from '@react-types/shared';
import { HTMLAttributes, ReactElement, ReactNode } from 'react';

import { BaseStyleProps } from '@keystar/ui/style';
import { HTMLTag } from '@keystar/ui/utils/ts';

type FieldRenderInputProps = LabelAria['fieldProps'] & {
  disabled?: boolean;
  readOnly?: boolean;
  'aria-required'?: boolean;
  'aria-invalid'?: boolean;
};
export type FieldRenderProp = (
  inputProps: FieldRenderInputProps
) => ReactElement;

export type FieldProps = Pick<
  FieldPrimitiveProps,
  | 'contextualHelp'
  | 'description'
  | 'errorMessage'
  | 'isRequired'
  | 'label'
  | 'labelElementType'
> &
  InputBase &
  AriaLabelingProps &
  BaseStyleProps &
  DOMProps;

export type FieldPrimitiveProps = {
  /** The field contents. */
  children: ReactElement;
  /** A `ContextualHelp` element to place next to the label. */
  contextualHelp?: ReactElement;
  /**
   * Description text provides information to assist the user in completing a
   * field.
   */
  description?: ReactNode;
  /** Props for the description element. */
  descriptionProps?: HTMLAttributes<HTMLElement>;
  /**
   * Error messages inform the user when the input does not meet validation
   * criteria.
   */
  errorMessage?: ReactNode;
  /** Props for the message element. */
  errorMessageProps?: HTMLAttributes<HTMLElement>;
  /** Whether user input is required on the input before form submission. */
  isRequired?: boolean;
  /** Concisely label the field. */
  label?: ReactNode;
  /**
   * The HTML element used to render the label, e.g. 'label', or 'span'.
   * @default 'label'
   */
  labelElementType?: HTMLTag;
  /** Props for the label element. */
  labelProps?: HTMLAttributes<HTMLElement>;
  /**
   * For controls that DO NOT use a semantic element for user input. In these
   * cases the "required" state would not otherwise be announced to users of
   * assistive technology.
   */
  supplementRequiredState?: boolean;
} & BaseStyleProps;
