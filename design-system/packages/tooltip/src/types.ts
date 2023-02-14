import { ReactElement, ReactNode } from 'react';
import {
  AriaTooltipProps,
  TooltipTriggerProps as AriaTooltipTriggerProps,
} from '@react-aria/tooltip';
import { PositionProps } from '@react-types/overlays';

import { BaseStyleProps } from '@voussoir/style';
import { DOMProps } from '@voussoir/types';

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
