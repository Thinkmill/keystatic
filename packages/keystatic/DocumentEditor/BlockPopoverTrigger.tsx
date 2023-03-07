import { useOverlayTrigger } from '@react-aria/overlays';
import { useOverlayTriggerState } from '@react-stately/overlays';
import { cloneElement, ReactElement, useRef } from 'react';
import { useFocused, useSelected } from 'slate-react';

import { Placement, OverlayTriggerProps, Popover } from '@voussoir/overlays';

type RenderFn = (close: () => void) => ReactElement;
type BlockPopoverTriggerProps = OverlayTriggerProps & {
  children: [ReactElement, ReactElement | RenderFn];
  placement?: Placement;
};

export const BlockPopoverTrigger = ({
  children,
  placement = 'bottom',
  ...consumerTriggerProps
}: BlockPopoverTriggerProps) => {
  const [trigger, content] = children;
  const focused = useFocused();
  const selected = useSelected();

  const triggerRef = useRef(null);
  const state = useOverlayTriggerState({
    isOpen: focused && selected,
    ...consumerTriggerProps,
  });

  const {
    triggerProps: { onPress: _onPress, ...triggerProps },
    overlayProps,
  } = useOverlayTrigger({ type: 'dialog' }, state, triggerRef);

  return (
    <>
      {cloneElement(trigger, { ...triggerProps, ref: triggerRef })}
      <Popover
        isNonModal
        {...overlayProps}
        placement={placement}
        triggerRef={triggerRef}
        state={state}
      >
        {typeof content === 'function' ? content(state.close) : content}
      </Popover>
    </>
  );
};
