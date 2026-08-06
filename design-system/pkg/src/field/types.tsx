import { LabelAria } from 'react-aria/useLabel';
import { AriaLabelingProps, DOMProps, InputBase } from '@react-types/shared';
import { ReactElement, ReactNode } from 'react';

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

export type FieldProps = {
  /** A contextual help trigger displayed beside the label. */
  contextualHelp?: ReactElement;
  /** Description text that assists the user in completing the field. */
  description?: ReactNode;
  /** An error message for invalid input. */
  errorMessage?: ReactNode;
  /** Whether user input is required. */
  isRequired?: boolean;
  /** Concisely labels the field. */
  label?: ReactNode;
  /** The HTML element used to render the label. */
  labelElementType?: HTMLTag;
} & InputBase &
  AriaLabelingProps &
  BaseStyleProps &
  DOMProps;
