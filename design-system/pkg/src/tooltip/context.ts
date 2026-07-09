import React, { HTMLAttributes, RefObject } from 'react';
import { TooltipTriggerState } from 'react-stately/useTooltipTriggerState';
import { PositionProps } from 'react-aria/useOverlayPosition';

import { RootStyleProps } from '@keystar/ui/style';

type TooltipContextProps = {
  state?: TooltipTriggerState;
  overlayRef?: RefObject<HTMLDivElement | null>;
  targetRef?: RefObject<HTMLElement | null>;
  arrowProps?: HTMLAttributes<HTMLElement>;
} & PositionProps &
  RootStyleProps;

export const TooltipContext = React.createContext<TooltipContextProps>({});
