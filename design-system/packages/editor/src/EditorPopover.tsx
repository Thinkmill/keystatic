import { forwardRef, useImperativeHandle, useState } from 'react';
import {
  ContextData,
  FloatingPortal,
  autoUpdate,
  useFloating,
  useInteractions,
  useRole,
} from '@floating-ui/react';

import { DialogElement } from './styled-components';
import { EditorPopoverProps } from './types';
import { getMiddleware } from './utils';

export type EditorPopoverRef = { context: ContextData; update: () => void };

export const EditorPopover = forwardRef<EditorPopoverRef, EditorPopoverProps>(
  function EditorPopover(props, forwardedRef) {
    const { children, reference, placement = 'bottom' } = props;

    // Floating UI stuff
    // ------------------------------
    const [floating, setFloating] = useState<HTMLDivElement | null>(null);
    const middleware = getMiddleware(props);
    const { floatingStyles, context, update } = useFloating({
      open: true,
      middleware,
      whileElementsMounted: autoUpdate,
      elements: { reference, floating },
      placement,
    });
    const role = useRole(context);
    const { getFloatingProps } = useInteractions([role]);

    useImperativeHandle(
      forwardedRef,
      () => {
        return { context, update };
      },
      [context, update]
    );

    return (
      <FloatingPortal>
        <DialogElement
          ref={setFloating}
          style={floatingStyles}
          {...getFloatingProps()}
        >
          {children}
        </DialogElement>
      </FloatingPortal>
    );
  }
);
