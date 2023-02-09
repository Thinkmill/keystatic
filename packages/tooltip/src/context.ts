import React, { HTMLAttributes, RefObject } from 'react';
import { TooltipTriggerState } from '@react-stately/tooltip';
import { PositionProps } from '@react-types/overlays';

import { RootStyleProps } from '@voussoir/style';

type TooltipContextProps = {
  state?: TooltipTriggerState;
  targetRef?: RefObject<HTMLElement>;
  arrowProps?: HTMLAttributes<HTMLElement>;
} & PositionProps &
  RootStyleProps;

export const TooltipContext = React.createContext<TooltipContextProps>({});
