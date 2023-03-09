import {
  AriaPopoverProps,
  PopoverAria,
  useOverlay,
  useOverlayPosition,
} from '@react-aria/overlays';
import { mergeProps, useLayoutEffect } from '@react-aria/utils';
import {
  OverlayTriggerState,
  useOverlayTriggerState,
} from '@react-stately/overlays';
import {
  cloneElement,
  createContext,
  ReactElement,
  Ref,
  useContext,
  useEffect,
  useRef,
} from 'react';

import { Overlay, PopoverProps } from '@voussoir/overlays';
import { css, tokenSchema, transition } from '@voussoir/style';

import { useSelectedOrFocusWithin } from '../utils';

type RenderFn = (close: () => void) => ReactElement;
type BlockPopoverTriggerProps = {
  children: [ReactElement, ReactElement<BlockPopoverProps>];
  // isOpen: boolean;
};
type BlockPopoverProps = Pick<PopoverProps, 'hideArrow' | 'placement'> & {
  children: ReactElement | RenderFn;
};

const BlockPopoverContext = createContext<{
  // isOpen: boolean;
  dialogFocusProps: ReturnType<typeof useOverlay>['overlayProps'];
  state: OverlayTriggerState;
  triggerRef: React.MutableRefObject<HTMLElement | null>;
} | null>(null);

function useBlockPopoverContext() {
  const context = useContext(BlockPopoverContext);
  if (!context) {
    throw new Error(
      'useBlockPopoverContext must be used within a BlockPopoverTrigger'
    );
  }
  return context;
}

export const BlockPopoverTrigger = ({ children }: BlockPopoverTriggerProps) => {
  const [trigger, popover] = children;
  const triggerRef = useRef(null);
  const [selectedOrFocused, dialogFocusProps] = useSelectedOrFocusWithin();
  const state = useOverlayTriggerState({ isOpen: selectedOrFocused });
  const context = { dialogFocusProps, state, triggerRef };

  return (
    <BlockPopoverContext.Provider value={context}>
      {cloneElement(trigger, { ref: triggerRef })}
      {popover}
    </BlockPopoverContext.Provider>
  );
};

export function BlockPopover(props: BlockPopoverProps) {
  const { state } = useBlockPopoverContext();
  let wrapperRef = useRef<HTMLDivElement>(null);

  return (
    /* @ts-expect-error FIXME: resolve ref inconsistencies */
    <Overlay isOpen={state.isOpen} nodeRef={wrapperRef}>
      <BlockPopoverWrapper wrapperRef={wrapperRef} {...props} />
    </Overlay>
  );
}

const BlockPopoverWrapper = ({
  children,
  placement: preferredPlacement = 'bottom',
}: BlockPopoverProps & { wrapperRef: Ref<HTMLDivElement> }) => {
  let popoverRef = useRef(null);
  const { dialogFocusProps, state, triggerRef } = useBlockPopoverContext();
  let {
    // arrowProps,
    placement,
    popoverProps,
    // underlayProps,
    updatePosition,
  } = useBlockPopover(
    {
      isNonModal: true,
      isKeyboardDismissDisabled: false,
      placement: preferredPlacement,
      triggerRef,
      popoverRef,
    },
    state
  );

  let previousBoundingRect = usePrevious(
    triggerRef.current?.getBoundingClientRect()
  );
  useLayoutEffect(() => {
    if (previousBoundingRect) {
      const currentBoundingRect = triggerRef.current?.getBoundingClientRect();
      if (currentBoundingRect) {
        const hasChanged =
          previousBoundingRect.height !== currentBoundingRect.height ||
          previousBoundingRect.width !== currentBoundingRect.width;
        // previousBoundingRect.x !== currentBoundingRect.x ||
        // previousBoundingRect.y !== currentBoundingRect.y;
        if (hasChanged) {
          console.log('has changed');
          updatePosition();
        }
      }
    }
  }, [previousBoundingRect, triggerRef, updatePosition]);

  return (
    <div
      ref={popoverRef}
      {...mergeProps(dialogFocusProps, popoverProps)}
      data-open={state.isOpen}
      data-placement={placement}
      contentEditable={false}
      className={css({
        backgroundColor: tokenSchema.color.background.surface, // TODO: component token?
        borderRadius: tokenSchema.size.radius.medium, // TODO: component token?
        border: `${tokenSchema.size.border.regular} solid ${tokenSchema.color.border.emphasis}`,
        boxSizing: 'content-box', // resolves measurement/scroll issues related to border
        // boxShadow: `0 0 0 ${tokenSchema.size.border.regular} ${tokenSchema.color.border.emphasis}`,
        minHeight: tokenSchema.size.element.regular,
        minWidth: tokenSchema.size.element.regular,
        opacity: 0,
        outline: 0,
        pointerEvents: 'auto',
        position: 'absolute',
        // use filter:drop-shadow instead of box-shadow so the arrow is included
        filter: `drop-shadow(0 1px 4px ${tokenSchema.color.shadow.regular})`,
        // filter bug in safari: https://stackoverflow.com/questions/56478925/safari-drop-shadow-filter-remains-visible-even-with-hidden-element
        willChange: 'filter',
        userSelect: 'none',

        // placement
        '&[data-placement="top"]': {
          marginBottom: tokenSchema.size.space.regular,
          transform: `translateY(${tokenSchema.size.space.regular})`,
        },
        '&[data-placement="bottom"]': {
          marginTop: tokenSchema.size.space.regular,
          transform: `translateY(calc(${tokenSchema.size.space.regular} * -1))`,
        },

        '&[data-open="true"]': {
          opacity: 1,
          transform: `translateX(0) translateY(0)`,

          // enter animation
          transition: transition(['opacity', 'transform'], {
            easing: 'easeOut',
          }),
        },
      })}
    >
      {typeof children === 'function' ? children(state.close) : children}
    </div>
  );
};

/**
 * Provides the behavior and accessibility implementation for a popover component.
 * A popover is an overlay element positioned relative to a trigger.
 */
function useBlockPopover(
  props: AriaPopoverProps,
  state: OverlayTriggerState
): PopoverAria & { updatePosition: () => void } {
  let {
    triggerRef,
    popoverRef,
    isNonModal,
    isKeyboardDismissDisabled,
    ...otherProps
  } = props;

  let { overlayProps, underlayProps } = useOverlay(
    {
      isOpen: state.isOpen,
      onClose: state.close,
      shouldCloseOnBlur: true,
      isDismissable: !isNonModal,
      isKeyboardDismissDisabled: false,
    },
    popoverRef
  );

  let {
    overlayProps: positionProps,
    arrowProps,
    placement,
    updatePosition,
  } = useOverlayPosition({
    ...otherProps,
    targetRef: triggerRef,
    overlayRef: popoverRef,
    isOpen: state.isOpen,
    onClose: undefined,
  });

  return {
    arrowProps,
    placement,
    popoverProps: mergeProps(overlayProps, positionProps),
    underlayProps,
    updatePosition,
  };
}

function usePrevious<T>(value: T) {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
