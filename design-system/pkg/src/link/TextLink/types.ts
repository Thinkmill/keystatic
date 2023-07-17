import { DOMProps, FocusableProps, PressEvents } from '@react-types/shared';
import { ReactNode } from 'react';

import { AnchorDOMProps } from '@keystar/ui/types';

export type TextLinkProminence = 'default' | 'high';

export type TextLinkButtonProps = {
  /** The content to display in the text link. */
  children?: ReactNode;
  /**
   * The visual prominence of the text link.
   * @default 'default'
   */
  prominence?: TextLinkProminence;
} & DOMProps &
  PressEvents &
  FocusableProps;

export type TextLinkAnchorProps = TextLinkButtonProps & AnchorDOMProps;

export type TextLinkProps = TextLinkButtonProps | TextLinkAnchorProps;
