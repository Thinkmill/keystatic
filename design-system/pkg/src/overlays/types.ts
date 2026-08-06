import type { ModalOverlayProps as AriaModalOverlayProps } from 'react-aria-components/Modal';
import type { PopoverProps as AriaPopoverProps } from 'react-aria-components/Popover';
import { HTMLAttributes, MutableRefObject, ReactNode } from 'react';

import { BaseStyleProps } from '@keystar/ui/style';

export type BlanketProps = {
  isOpen?: boolean;
  isTransparent?: boolean;
} & BaseStyleProps &
  HTMLAttributes<HTMLDivElement>;

export type PopoverProps = Omit<AriaPopoverProps, 'className' | 'style'> & {
  children: ReactNode;
  hideArrow?: boolean;
} & BaseStyleProps;

export type ModalProps = {
  children: ReactNode;
  type?: 'modal' | 'fullscreen';
} & Omit<AriaModalOverlayProps, 'children' | 'className' | 'style'> &
  BaseStyleProps;

export type TrayProps = {
  children: ReactNode;
  isFixedHeight?: boolean;
} & Omit<AriaModalOverlayProps, 'children' | 'className' | 'style'> &
  BaseStyleProps;

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
