import type {
  RadioGroupProps as AriaRadioGroupProps,
  RadioProps as AriaRadioProps,
} from 'react-aria-components/RadioGroup';
import { ValidationState } from '@react-types/shared';
import { ReactNode } from 'react';

import { FieldProps } from '@keystar/ui/field';
import { BaseStyleProps } from '@keystar/ui/style';

export type RadioProps = Omit<
  AriaRadioProps,
  'children' | 'className' | 'style'
> &
  BaseStyleProps & { children?: ReactNode };

export type RadioGroupProps = Omit<
  AriaRadioGroupProps,
  'children' | 'className' | 'style'
> &
  FieldProps &
  BaseStyleProps & {
    /** The radio buttons contained within the group. */
    children: ReactNode;
    /** Whether the group is valid or invalid. */
    validationState?: ValidationState;
  };
