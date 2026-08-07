import { ReactElement, ReactNode } from 'react';
import {
  AriaTooltipProps,
  TooltipTriggerProps as AriaTooltipTriggerProps,
} from 'react-aria/useTooltipTrigger';
import { PositionProps } from 'react-aria/useOverlayPosition';
import { DOMProps } from '@react-types/shared';

import { BaseStyleProps } from '@keystar/ui/style';

export type TooltipProps = {
  /** The content to display within the tooltip. */
  children: ReactNode;
  /**
   * The tone of the tooltip.
   * @default 'neutral'
   */
  tone?: 'neutral' | 'positive' | 'critical' | 'accent';
} & BaseStyleProps &
  DOMProps &
  AriaTooltipProps;

export type TooltipTriggerProps = {
  children: [ReactElement, ReactElement];
} & AriaTooltipTriggerProps &
  PositionProps;
