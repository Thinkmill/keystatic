import { AriaLabelingProps, DOMProps } from '@react-types/shared';
import { ReactNode } from 'react';

import type { DialogTriggerProps } from '@keystar/ui/dialog';
import { BaseStyleProps } from '@keystar/ui/style';

export type ContextualHelpProps = {
  /** Contents of the Contextual Help popover. */
  children: ReactNode;
  /**
   * The placement of the popover with respect to the action button.
   * @default 'bottom start'
   */
  placement?: DialogTriggerProps['placement'];
  /**
   * Indicates whether contents are informative or provides helpful guidance.
   * @default 'help'
   */
  variant?: 'help' | 'info';
} & Omit<DialogTriggerProps, 'children' | 'type' | 'mobileType'> &
  BaseStyleProps &
  DOMProps &
  AriaLabelingProps;
