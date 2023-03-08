import { useOverlayTrigger } from '@react-aria/overlays';
import { useOverlayTriggerState } from '@react-stately/overlays';
import { cloneElement, ReactElement, useRef } from 'react';
import { useFocused, useSelected } from 'slate-react';

import { OverlayTriggerProps, Popover, PopoverProps } from '@voussoir/overlays';

type RenderFn = (close: () => void) => ReactElement;
type BlockPopoverTriggerProps = OverlayTriggerProps &
  Pick<PopoverProps, 'hideArrow' | 'placement'> & {
    children: [ReactElement, ReactElement | RenderFn];
  };

export const BlockPopoverTrigger = ({
  children,
  placement = 'bottom',
  isOpen: _consumerIsOpen,
  defaultOpen,
  onOpenChange,
  hideArrow,
}: BlockPopoverTriggerProps) => {
  const [trigger, content] = children;
  const focused = useFocused();
  const selected = useSelected();

  const triggerRef = useRef(null);
  const state = useOverlayTriggerState({
    isOpen:
      _consumerIsOpen === undefined ? focused && selected : _consumerIsOpen,
    defaultOpen,
    onOpenChange,
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
        hideArrow={hideArrow}
        placement={placement}
        triggerRef={triggerRef}
        state={state}
      >
        {typeof content === 'function' ? content(state.close) : content}
      </Popover>
    </>
  );
};
