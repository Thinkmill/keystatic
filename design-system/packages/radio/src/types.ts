import { AriaRadioGroupProps, AriaRadioProps } from '@react-aria/radio';
import { ReactNode } from 'react';

import { FieldProps } from '@voussoir/field';
import { BaseStyleProps } from '@voussoir/style';

export type RadioProps = AriaRadioProps & BaseStyleProps;

export type RadioGroupProps = AriaRadioGroupProps &
  FieldProps &
  BaseStyleProps & {
    /** The radio buttons contained within the group. */
    children: ReactNode;
  };
