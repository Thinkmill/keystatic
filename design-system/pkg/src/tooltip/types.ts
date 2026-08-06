import type {
  TooltipProps as AriaTooltipProps,
  TooltipTriggerComponentProps as AriaTooltipTriggerProps,
} from 'react-aria-components/Tooltip';
import type { ReactNode } from 'react';
import type { DOMProps } from '@react-types/shared';

import { BaseStyleProps } from '@keystar/ui/style';

export type TooltipProps = Omit<
  AriaTooltipProps,
  'children' | 'className' | 'style'
> &
  DOMProps &
  BaseStyleProps & {
    children: ReactNode;
    tone?: 'neutral' | 'positive' | 'critical' | 'accent';
  };

export type TooltipTriggerProps = Omit<AriaTooltipTriggerProps, 'children'> & {
  children: ReactNode;
} & Pick<
    AriaTooltipProps,
    'placement' | 'offset' | 'crossOffset' | 'shouldFlip'
  >;
