import { forwardRef, useState } from 'react';
import {
  FloatingPortal,
  autoUpdate,
  useFloating,
  useInteractions,
  useMergeRefs,
  useRole,
} from '@floating-ui/react';

import { DialogElement } from './styled-components';
import { EditorPopoverProps } from './types';
import { getMiddleware } from './utils';

export const EditorPopover = forwardRef<HTMLDivElement, EditorPopoverProps>(
  function EditorPopover(props, forwardedRef) {
    const {
      children,
      isOpen,
      onOpenChange,
      placement = 'bottom',
      reference,
    } = props;

    const [floating, setFloating] = useState<HTMLDivElement | null>(null);
    const middleware = getMiddleware(props);
    const { floatingStyles, context } = useFloating({
      open: isOpen,
      onOpenChange,
      middleware,
      whileElementsMounted: autoUpdate,
      elements: { reference, floating },
      placement,
    });
    const role = useRole(context);
    const { getFloatingProps } = useInteractions([role]);
    const floatingRef = useMergeRefs([setFloating, forwardedRef]);

    if (!isOpen || !reference) {
      return null;
    }

    return (
      <FloatingPortal>
        <DialogElement
          ref={floatingRef}
          style={floatingStyles}
          {...getFloatingProps()}
        >
          {children}
        </DialogElement>
      </FloatingPortal>
    );
  }
);
