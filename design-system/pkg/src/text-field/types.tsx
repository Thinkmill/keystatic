import {
  FocusableProps,
  TextInputDOMProps,
  ValueBase,
} from '@react-types/shared';
import {
  HTMLAttributes,
  InputHTMLAttributes,
  LabelHTMLAttributes,
  ReactElement,
  TextareaHTMLAttributes,
} from 'react';

import { FieldProps } from '@keystar/ui/field';
import { Conditional } from '@keystar/ui/types';

export type TextFieldPrimitiveProps = TextFieldProps & {
  /**
   * When true, text will wrap onto multiple lines using a `textarea` instead of
   * the traditional `input` element.
   */
  isMultiline?: boolean;
  labelProps?: LabelHTMLAttributes<HTMLLabelElement>;
  inputProps:
    | InputHTMLAttributes<HTMLInputElement>
    | TextareaHTMLAttributes<HTMLTextAreaElement>;
  descriptionProps?: HTMLAttributes<HTMLElement>;
  errorMessageProps?: HTMLAttributes<HTMLElement>;
  inputWrapperProps?: HTMLAttributes<HTMLElement>;
};

export type TextFieldProps = {
  // https://www.w3.org/TR/wai-aria-1.2/#textbox
  /** Identifies the currently active element when DOM focus is on a composite widget, textbox, group, or application. */
  'aria-activedescendant'?: string;
  /**
   * Indicates whether inputting text could trigger display of one or more predictions of the user's intended value for an input and specifies how predictions would be
   * presented if they are made.
   */
  'aria-autocomplete'?: 'none' | 'inline' | 'list' | 'both';
  // https://www.w3.org/TR/wai-aria-1.2/#aria-errormessage
  /**
   * Identifies the element that provides an error message for the object.
   */
  'aria-errormessage'?: string;
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
  /** Element to display before the input. */
  startElement?: Conditional<ReactElement>;
  /** Element to display after the input. */
  endElement?: Conditional<ReactElement>;
} & ValueBase<string> &
  FieldProps &
  TextInputDOMProps &
  FocusableProps;

export type TextAreaProps = Omit<
  TextFieldProps,
  'pattern' | 'type' | 'startElement' | 'endElement'
>;
