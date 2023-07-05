import React, { HTMLAttributes, RefObject } from 'react';
import { TooltipTriggerState } from '@react-stately/tooltip';
import { PositionProps } from '@react-types/overlays';

import { RootStyleProps } from '@keystar/ui/style';

type TooltipContextProps = {
  state?: TooltipTriggerState;
  overlayRef?: RefObject<HTMLDivElement>;
  targetRef?: RefObject<HTMLElement>;
  arrowProps?: HTMLAttributes<HTMLElement>;
} & PositionProps &
  RootStyleProps;

export const TooltipContext = React.createContext<TooltipContextProps>({});
