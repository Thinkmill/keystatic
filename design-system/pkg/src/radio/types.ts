import { AriaRadioGroupProps, AriaRadioProps } from 'react-aria/useRadioGroup';
import { ReactNode } from 'react';

import { FieldProps } from '@keystar/ui/field';
import { BaseStyleProps } from '@keystar/ui/style';

export type RadioProps = AriaRadioProps & BaseStyleProps;

export type RadioGroupProps = AriaRadioGroupProps &
  FieldProps &
  BaseStyleProps & {
    /** The radio buttons contained within the group. */
    children: ReactNode;
  };
