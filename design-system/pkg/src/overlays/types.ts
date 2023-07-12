import { AriaModalOverlayProps, AriaPopoverProps } from '@react-aria/overlays';
import { OverlayTriggerState } from '@react-stately/overlays';
import { OverlayProps } from '@react-types/overlays';
import { HTMLAttributes, ReactNode } from 'react';

import { BaseStyleProps } from '@keystar/ui/style';

export type BlanketProps = {
  isOpen?: boolean;
  isTransparent?: boolean;
} & BaseStyleProps &
  HTMLAttributes<HTMLDivElement>;

// Popover
// -----------------------------------------------------------------------------

export type PopoverProps = Omit<
  AriaPopoverProps,
  'popoverRef' | 'maxHeight'
> & {
  children: ReactNode;
  hideArrow?: boolean;
  state: OverlayTriggerState;
} & BaseStyleProps;

// Modal
// -----------------------------------------------------------------------------

export type ModalProps = {
  children: ReactNode;
  state: OverlayTriggerState;
  type?: 'modal' | 'fullscreen';
} & AriaModalOverlayProps &
  BaseStyleProps &
  Omit<OverlayProps, 'nodeRef'>;

// Tray
// -----------------------------------------------------------------------------

export type TrayProps = {
  children: ReactNode;
  state: OverlayTriggerState;
  isFixedHeight?: boolean;
} & AriaModalOverlayProps &
  BaseStyleProps &
  Omit<OverlayProps, 'nodeRef'>;
