import {
  Modal as AriaModal,
  ModalOverlay as AriaModalOverlay,
  type ModalOverlayProps as AriaModalOverlayProps,
} from 'react-aria-components/Modal';
import {
  type ForwardedRef,
  type ForwardRefExoticComponent,
  type Ref,
  forwardRef,
} from 'react';

import {
  classNames,
  css,
  filterStyleProps,
  tokenSchema,
  transition,
  useStyleProps,
} from '@keystar/ui/style';

import { ModalProps } from './types';

/** A controlled modal surface built on React Aria Components. */
export const Modal: ForwardRefExoticComponent<
  ModalProps & { ref?: Ref<HTMLDivElement> }
> = forwardRef(function Modal(
  props: ModalProps,
  forwardedRef: ForwardedRef<HTMLDivElement>
) {
  let { children, type = 'modal', ...otherProps } = props;
  let styleProps = useStyleProps(props);

  return (
    <AriaModalOverlay
      {...(filterStyleProps(otherProps) as AriaModalOverlayProps)}
      className={css({
        alignItems: 'center',
        backgroundColor: '#0006',
        display: 'flex',
        height: '100dvh',
        inset: 0,
        justifyContent: 'center',
        opacity: 1,
        position: 'fixed',
        transition: transition('opacity', { easing: 'easeOut' }),
        width: '100vw',
        zIndex: 1,

        '&[data-entering], &[data-exiting]': { opacity: 0 },
      })}
    >
      <AriaModal
        ref={forwardedRef}
        data-type={type}
        className={classNames(
          css({
            backgroundColor: tokenSchema.color.background.surface,
            borderRadius: tokenSchema.size.radius.large,
            boxShadow: `${tokenSchema.size.shadow.large} ${tokenSchema.color.shadow.emphasis}`,
            maxHeight: '90dvh',
            maxWidth: '90vw',
            outline: 0,
            transform: 'translateY(0)',
            transition: transition(['opacity', 'transform'], {
              easing: 'easeOut',
            }),

            '&[data-entering], &[data-exiting]': {
              opacity: 0,
              transform: `translateY(${tokenSchema.size.space.large})`,
            },
            '&[data-type="fullscreen"]': {
              height: `calc(100dvh - 2 * ${tokenSchema.size.space.xxlarge})`,
              maxHeight: 'none',
              maxWidth: 'none',
              width: `calc(100vw - 2 * ${tokenSchema.size.space.xxlarge})`,
            },
          }),
          styleProps.className
        )}
        style={styleProps.style}
      >
        {children}
      </AriaModal>
    </AriaModalOverlay>
  );
});
