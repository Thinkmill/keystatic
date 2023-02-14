import { LabelAria } from '@react-aria/label';
import { ReactElement, ReactNode } from 'react';

import { BaseStyleProps } from '@voussoir/style';
import { AriaLabellingProps, DOMProps, InputBaseProps } from '@voussoir/types';

export type FieldRenderProp = (props: LabelAria['fieldProps']) => ReactElement;

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
} & InputBaseProps &
  AriaLabellingProps &
  BaseStyleProps &
  DOMProps;
