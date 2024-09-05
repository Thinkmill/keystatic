import { useModalOverlay } from '@react-aria/overlays';
import { useObjectRef, useViewportSize } from '@react-aria/utils';
import {
  ForwardedRef,
  forwardRef,
  ForwardRefExoticComponent,
  HTMLAttributes,
  Ref,
  useRef,
} from 'react';

import { TOKEN_PREFIX } from '@keystar/ui/primitives';
import {
  classNames,
  css,
  toDataAttributes,
  tokenSchema,
  transition,
  useStyleProps,
} from '@keystar/ui/style';

import { Blanket } from './Blanket';
import { Overlay } from './Overlay';
import { ModalProps } from './types';

type ModalWrapperProps = ModalProps &
  HTMLAttributes<HTMLElement> & {
    isOpen?: boolean;
    wrapperRef: Ref<HTMLDivElement>;
  };

/**
 * A low-level utility component for implementing things like dialogs and
 * popovers, in a layer above the page.
 */
export const Modal: ForwardRefExoticComponent<
  ModalProps & { ref?: Ref<HTMLDivElement> }
> = forwardRef(function Modal(
  props: ModalProps,
  forwardedRef: ForwardedRef<HTMLDivElement>
) {
  let { children, state, ...otherProps } = props;
  let wrapperRef = useRef<HTMLDivElement>(null);

  return (
    <Overlay {...otherProps} isOpen={state.isOpen} nodeRef={wrapperRef}>
      <ModalWrapper ref={forwardedRef} {...props} wrapperRef={wrapperRef}>
        {children}
      </ModalWrapper>
    </Overlay>
  );
});

const MAX_HEIGHT_VAR = `--${TOKEN_PREFIX}-visual-viewport-height`;

const ModalWrapper = forwardRef(function ModalWrapper(
  props: ModalWrapperProps,
  forwardedRef: ForwardedRef<HTMLDivElement>
) {
  let { type, children, state, isOpen, wrapperRef } = props;

  let domRef = useObjectRef(forwardedRef);
  let { modalProps, underlayProps } = useModalOverlay(props, state, domRef);
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
          alignItems: 'center',
          boxSizing: 'border-box',
          display: 'flex',
          insetBlockStart: 0,
          insetInlineStart: 0,
          justifyContent: 'center',
          pointerEvents: 'none',
          position: 'fixed',
          width: '100vw',
          zIndex: 2, // above blanket
        })}
        style={{
          // @ts-ignore
          [MAX_HEIGHT_VAR]: `${viewport.height}px`,
          height: `var(${MAX_HEIGHT_VAR})`,
        }}
      >
        <div
          {...modalProps}
          {...toDataAttributes({ open: isOpen, type })}
          {...styleProps}
          ref={domRef}
          className={classNames(
            styleProps.className,
            css({
              backgroundColor: tokenSchema.color.background.surface, // TODO: component token?
              borderRadius: tokenSchema.size.radius.large, // TODO: component token?
              boxShadow: `${tokenSchema.size.shadow.large} ${tokenSchema.color.shadow.emphasis}`,
              maxHeight: `calc(var(${MAX_HEIGHT_VAR}) * 0.9)`,
              maxWidth: '90vw',
              opacity: 0,
              outline: 0,
              pointerEvents: 'auto',
              transform: `translateY(${tokenSchema.size.space.large})`, // initialise with offset
              zIndex: 2, // above blanket

              // exit animation
              transition: [
                transition('opacity', { easing: 'easeIn' }),
                transition('transform', {
                  delay: 'short',
                  duration: 0,
                  easing: 'linear',
                }),
              ].join(', '),

              '&[data-type="fullscreen"]': {
                position: 'fixed',
                inset: tokenSchema.size.space.xxlarge,
                maxWidth: 'none',
                maxHeight: 'none',
                width: `calc(100% - calc(2 * ${tokenSchema.size.space.xxlarge}))`,
                height: `calc(100% - calc(2 * ${tokenSchema.size.space.xxlarge}))`,
              },
              '&[data-open="true"]': {
                opacity: 1,
                transform: `translateY(0)`,

                // enter animation
                transition: transition(['opacity', 'transform'], {
                  easing: 'easeOut',
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
