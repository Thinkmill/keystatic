import { useModalOverlay } from '@react-aria/overlays';
import { useObjectRef, useViewportSize } from '@react-aria/utils';
import {
  ForwardedRef,
  forwardRef,
  ForwardRefExoticComponent,
  HTMLAttributes,
  Ref,
} from 'react';

import {
  classNames,
  css,
  tokenSchema,
  transition,
  useStyleProps,
} from '@voussoir/style';
import { toDataAttributes } from '@voussoir/utils';

import { Blanket } from './Blanket';
import { Overlay } from './Overlay';
import { ModalProps } from './types';

type ModalWrapperProps = {
  isOpen?: boolean;
} & ModalProps &
  HTMLAttributes<HTMLElement>;

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

  return (
    <Overlay {...otherProps} isOpen={state.isOpen}>
      <ModalWrapper ref={forwardedRef} {...props}>
        {children}
      </ModalWrapper>
    </Overlay>
  );
});

const ModalWrapper = forwardRef(function ModalWrapper(
  props: ModalWrapperProps,
  forwardedRef: ForwardedRef<HTMLDivElement>
) {
  let { type, children, state, isOpen } = props;

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

  return (
    <>
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
        style={{ height: viewport.height }}
      >
        <div
          {...modalProps}
          {...toDataAttributes({ open: isOpen, type })}
          ref={domRef}
          style={Object.assign(
            {},
            { maxHeight: `calc(${viewport.height}px * 0.9)` },
            styleProps.style
          )}
          className={classNames(
            styleProps.className,
            css({
              backgroundColor: tokenSchema.color.background.surface, // TODO: component token?
              borderRadius: tokenSchema.size.radius.large, // TODO: component token?
              boxShadow: `${tokenSchema.size.shadow.large} ${tokenSchema.color.shadow.emphasis}`,
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
    </>
  );
});
