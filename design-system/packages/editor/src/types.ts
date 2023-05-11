import { ContextData, Placement, ReferenceElement } from '@floating-ui/react';
import { ReactNode } from 'react';

export type EditorPopoverProps = {
  children: ReactNode;
  reference: ReferenceElement;
  placement?: Placement;
  sticky?: boolean;
};

export type EditorPopoverRef = { context: ContextData; update: () => void };
