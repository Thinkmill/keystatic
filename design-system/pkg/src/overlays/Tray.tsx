import {
  forwardRef,
  ForwardedRef,
  HTMLAttributes,
  ForwardRefExoticComponent,
  Ref,
  useRef,
} from 'react';
import { useModalOverlay } from '@react-aria/overlays';
import { useObjectRef, useViewportSize } from '@react-aria/utils';

import {
  breakpointQueries,
  breakpoints,
  classNames,
  css,
  toDataAttributes,
  tokenSchema,
  transition,
  useStyleProps,
} from '@keystar/ui/style';

import { Blanket } from './Blanket';
import { Overlay } from './Overlay';
import { TrayProps } from './types';

type TrayWrapperProps = TrayProps &
  HTMLAttributes<HTMLElement> & {
    isOpen?: boolean;
    wrapperRef: Ref<HTMLDivElement>;
  };

/**
 * A low-level utility component for implementing things like info dialogs,
 * menus and pickers. They should only ever be displayed on devices with small
 * screens, for interfaces where popovers wouldn't be appropriate.
 */
export const Tray: ForwardRefExoticComponent<
  TrayProps & { ref?: Ref<HTMLDivElement> }
> = forwardRef<HTMLDivElement, TrayProps>(function Tray(props, forwardedRef) {
  let { children, state, ...otherProps } = props;
  let wrapperRef = useRef<HTMLDivElement>(null);

  return (
    <Overlay {...otherProps} isOpen={state.isOpen} nodeRef={wrapperRef}>
      <TrayWrapper ref={forwardedRef} {...props} wrapperRef={wrapperRef}>
        {children}
      </TrayWrapper>
    </Overlay>
  );
});

let TrayWrapper = forwardRef(function TrayWrapper(
  props: TrayWrapperProps,
  forwardedRef: ForwardedRef<HTMLDivElement>
) {
  let { children, state, isFixedHeight, isOpen, wrapperRef } = props;

  let domRef = useObjectRef(forwardedRef);
  let { modalProps, underlayProps } = useModalOverlay(
    { ...props, isDismissable: true },
    state,
    domRef
  );
  let styleProps = useStyleProps(props);

  // TODO: move to CSS' dynamic viewport units, when possible:
  // @see https://caniuse.com/viewport-unit-variants
  // ---------------------------------------------------------------------------
  // On mobile browsers, vh units are fixed based on the maximum height of the
  // screen. However, when you scroll, the toolbar and address bar shrink,
  // making the viewport resize. The visual viewport also shrinks when the
  // keyboard is displayed.
  let viewport = useViewportSize();

  // Attach Transition's nodeRef to outer most wrapper for node.reflow:
  // https://github.com/reactjs/react-transition-group/blob/c89f807067b32eea6f68fd6c622190d88ced82e2/src/Transition.js#L231
  return (
    <div ref={wrapperRef}>
      <Blanket {...underlayProps} isOpen={isOpen} />
      <div
        className={css({
          boxSizing: 'border-box',
          display: 'flex',
          insetBlockStart: 0,
          insetInlineStart: 0,
          justifyContent: 'center',
          pointerEvents: 'none',
          position: 'fixed',
          height: '100vh',
          width: '100%',
          zIndex: 2, // above blanket
        })}
        style={{ height: viewport.height }}
      >
        <div
          {...modalProps}
          {...toDataAttributes({
            open: isOpen,
            fillScreen: isFixedHeight || undefined,
          })}
          ref={domRef}
          style={Object.assign(
            {},
            isFixedHeight
              ? {
                  height: `calc(${viewport.height}px - ${tokenSchema.size.space.xxlarge})`,
                  top: tokenSchema.size.space.xxlarge,
                }
              : {},
            {
              maxHeight: `calc(${viewport.height}px - ${tokenSchema.size.space.xxlarge})`,
              paddingBottom: `max(calc(100vh - ${viewport.height}px), env(safe-area-inset-bottom))`,
            },
            styleProps.style
          )}
          className={classNames(
            styleProps.className,
            css({
              backgroundColor: tokenSchema.color.background.surface, // TODO: component token?
              bottom: 0,
              maxWidth: '100vw',
              opacity: 0,
              outline: 0,
              pointerEvents: 'auto',
              position: 'absolute',
              transform: 'translateY(100%)', // initialise with offset
              width: '100%',
              zIndex: 2, // above blanket

              // NOTE: trays shouldn't be used for larger screens, but in case
              // they are we need to tweak the appearance.
              [breakpointQueries.above.mobile]: {
                borderStartStartRadius: tokenSchema.size.radius.medium, // TODO: component token?
                borderStartEndRadius: tokenSchema.size.radius.medium, // TODO: component token?
                maxWidth: breakpoints.tablet,
              },

              // exit animation
              transition: transition(['opacity', 'transform'], {
                easing: 'easeIn',
              }),

              '&[data-open="true"]': {
                opacity: 1,
                transform: `translateY(0)`,

                // enter animation
                transition: transition(['opacity', 'transform'], {
                  easing: 'easeOut',
                  delay: 'short',
                }),
              },
            })
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
});
