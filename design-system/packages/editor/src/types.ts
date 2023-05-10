import { Placement, ReferenceElement } from '@floating-ui/react';
import { ReactNode } from 'react';

export type EditorPopoverProps = {
  children: ReactNode;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  reference?: ReferenceElement | null;
  placement?: Placement;
  sticky?: boolean;
};
