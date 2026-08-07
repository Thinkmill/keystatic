import { AriaModalOverlayProps } from 'react-aria/useModalOverlay';
import { AriaPopoverProps } from 'react-aria/usePopover';
import { OverlayProps as ReactAriaOverlayProps } from 'react-aria/Overlay';
import { OverlayTriggerState } from 'react-stately/useOverlayTriggerState';
import { HTMLAttributes, MutableRefObject, ReactNode } from 'react';

import { BaseStyleProps } from '@keystar/ui/style';

export type BlanketProps = {
  isOpen?: boolean;
  isTransparent?: boolean;
} & BaseStyleProps &
  HTMLAttributes<HTMLDivElement>;

export type PopoverProps = Omit<
  AriaPopoverProps,
  'popoverRef' | 'maxHeight'
> & {
  children: ReactNode;
  hideArrow?: boolean;
  state: OverlayTriggerState;
} & BaseStyleProps;

export type ModalProps = {
  children: ReactNode;
  state: OverlayTriggerState;
  type?: 'modal' | 'fullscreen';
} & AriaModalOverlayProps &
  BaseStyleProps &
  Omit<OverlayProps, 'nodeRef'>;

export type TrayProps = {
  children: ReactNode;
  state: OverlayTriggerState;
  isFixedHeight?: boolean;
} & AriaModalOverlayProps &
  BaseStyleProps &
  Omit<OverlayProps, 'nodeRef'>;

export type TransitionProps = {
  children: ReactNode;
  isOpen?: boolean;
  nodeRef: MutableRefObject<HTMLElement | null>;
  onEnter?: () => void;
  onEntered?: () => void;
  onEntering?: () => void;
  onExit?: () => void;
  onExited?: () => void;
  onExiting?: () => void;
};

export type OverlayProps = Omit<
  ReactAriaOverlayProps,
  'portalContainer' | 'isExiting'
> &
  TransitionProps & {
    container?: ReactAriaOverlayProps['portalContainer'];
    isKeyboardDismissDisabled?: boolean;
  };
