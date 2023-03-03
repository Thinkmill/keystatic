import { useLocale } from '@react-aria/i18n';
import { DismissButton, usePopover } from '@react-aria/overlays';
import { useObjectRef } from '@react-aria/utils';
import { Placement, Axis } from '@react-types/overlays';
import {
  forwardRef,
  ForwardedRef,
  ForwardRefExoticComponent,
  Ref,
  useRef,
} from 'react';

import {
  classNames,
  css,
  tokenSchema,
  transition,
  useStyleProps,
} from '@voussoir/style';
import { Direction } from '@voussoir/types';
import { toDataAttributes } from '@voussoir/utils';

import { Blanket } from './Blanket';
import { Overlay } from './Overlay';
import { PopoverProps } from './types';
import { DirectionIndicator } from './DirectionIndicator';

type PopoverWrapperProps = PopoverProps & {
  isOpen?: boolean;
  wrapperRef: Ref<HTMLDivElement>;
};

/**
 * A low-level utility component for implementing things like info dialogs,
 * menus and pickers.
 */
export const Popover: ForwardRefExoticComponent<
  PopoverProps & { ref?: Ref<HTMLDivElement> }
> = forwardRef(function Popover(
  props: PopoverProps,
  forwardedRef: ForwardedRef<HTMLDivElement>
) {
  let { children, state, ...otherProps } = props;
  let wrapperRef = useRef<HTMLDivElement>(null);

  return (
    /* @ts-expect-error FIXME: resolve ref inconsistencies */
    <Overlay {...otherProps} isOpen={state.isOpen} nodeRef={wrapperRef}>
      <PopoverWrapper ref={forwardedRef} {...props} wrapperRef={wrapperRef}>
        {children}
      </PopoverWrapper>
    </Overlay>
  );
});

const PopoverWrapper = forwardRef(function PopoverWrapper(
  props: PopoverWrapperProps,
  forwardedRef: ForwardedRef<HTMLDivElement>
) {
  let { children, isOpen, hideArrow, isNonModal, state, wrapperRef } = props;

  let popoverRef = useObjectRef(forwardedRef);
  let { popoverProps, arrowProps, underlayProps, placement } = usePopover(
    {
      ...props,
      containerPadding: 8,
      popoverRef,
      // @ts-expect-error we need to override the default value, but `undefined` doesn't work.
      maxHeight: null,
    },
    state
  );

  let styleProps = usePopoverStyles({
    ...props,
    placement: usePreferredPlacement(props.placement, placement as Axis),
  });

  // Attach Transition's nodeRef to outer most wrapper for node.reflow:
  // https://github.com/reactjs/react-transition-group/blob/c89f807067b32eea6f68fd6c622190d88ced82e2/src/Transition.js#L231
  return (
    <div ref={wrapperRef}>
      {!isNonModal && (
        <Blanket isTransparent {...underlayProps} isOpen={isOpen} />
      )}
      <div
        {...styleProps}
        {...popoverProps}
        style={{ ...styleProps.style, ...popoverProps.style }}
        ref={popoverRef}
        role="presentation"
      >
        {!isNonModal && <DismissButton onDismiss={state.close} />}
        {hideArrow ? null : (
          <DirectionIndicator
            {...arrowProps}
            fill="surface" // TODO: component token?
            stroke={tokenSchema.color.border.emphasis} // TODO: component token?
            placement={placement as Axis}
            size="regular"
          />
        )}
        {children}
        <DismissButton onDismiss={state.close} />
      </div>
    </div>
  );
});

// Utils
// -----------------------------------------------------------------------------

// FIXME: It looks like the popover must paint first, before passing on the placement.
// We need to patch it for the animation, which will often be fine, but there
// may be a flash if it needs to flip... Hopefully it's resolved when the
// updated `usePopover` is published.
function usePreferredPlacement(placement: Placement = 'bottom', axis?: Axis) {
  let { direction } = useLocale();
  if (axis) {
    return axis;
  }

  let logicalPosition = placement.split(' ')[0];

  return translateRTL(logicalPosition, direction) as Axis;
}

function translateRTL(position: string, direction: Direction) {
  if (direction === 'rtl') {
    return position.replace('start', 'right').replace('end', 'left');
  }
  return position.replace('start', 'left').replace('end', 'right');
}

function usePopoverStyles(
  props: Omit<PopoverWrapperProps, 'placement'> & { placement: Axis }
) {
  let { hideArrow, isOpen, placement } = props;
  let consumerStyleProps = useStyleProps(props);
  let offset = 'var(--popover-offset)';

  let popoverStyles = css({
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

    // exit animation
    transition: [
      transition('opacity', { easing: 'easeIn' }),
      transition('transform', {
        delay: 'short',
        duration: 0,
        easing: 'linear',
      }),
    ].join(', '),

    // animate towards placement. re-enforce the illusion that the popover
    // originates from, and is bound to, the trigger
    '&[data-placement="top"]': {
      marginBottom: offset,
      transform: `translateY(${offset})`,
    },
    '&[data-placement="bottom"]': {
      marginTop: offset,
      transform: `translateY(calc(${offset} * -1))`,
    },
    '&[data-placement="left"]': {
      marginRight: offset,
      transform: `translateX(${offset})`,
    },
    '&[data-placement="right"]': {
      marginLeft: offset,
      transform: `translateX(calc(${offset} * -1))`,
    },

    '&[data-open="true"]': {
      opacity: 1,
      transform: `translateX(0) translateY(0)`,

      // enter animation
      transition: transition(['opacity', 'transform'], {
        easing: 'easeOut',
      }),
    },
  });

  return {
    ...toDataAttributes({
      arrow: !hideArrow || undefined,
      placement,
      open: isOpen || undefined,
    }),
    className: classNames(popoverStyles, consumerStyleProps.className),
    style: {
      '--popover-offset': hideArrow
        ? tokenSchema.size.space.regular
        : tokenSchema.size.space.large,
      ...consumerStyleProps.style,
    },
  };
}
