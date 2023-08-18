import { LabelAria } from '@react-aria/label';
import {
  AriaLabelingProps,
  DOMProps,
  InputBase,
  Validation,
} from '@react-types/shared';
import { ReactElement, ReactNode } from 'react';

import { BaseStyleProps } from '@keystar/ui/style';

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
  /**
   * Description text provides information to assist the user in completing a
   * field.
   */
  description?: ReactNode;
  /**
   * Error messages inform the user when the input does not meet validation
   * criteria.
   */
  errorMessage?: ReactNode;
  /** Concisely label the field. */
  label?: ReactNode;
} & InputBase &
  Pick<Validation, 'isRequired'> &
  AriaLabelingProps &
  BaseStyleProps &
  DOMProps;
