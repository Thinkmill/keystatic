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
  breakpointQueries,
  breakpoints,
  classNames,
  css,
  filterStyleProps,
  tokenSchema,
  transition,
  useStyleProps,
} from '@keystar/ui/style';

import { TrayProps } from './types';

/** A controlled bottom tray built on React Aria Components. */
export const Tray: ForwardRefExoticComponent<
  TrayProps & { ref?: Ref<HTMLDivElement> }
> = forwardRef(function Tray(
  props: TrayProps,
  forwardedRef: ForwardedRef<HTMLDivElement>
) {
  let { children, isFixedHeight, isDismissable = true, ...otherProps } = props;
  let styleProps = useStyleProps(props);

  return (
    <AriaModalOverlay
      {...(filterStyleProps(otherProps) as AriaModalOverlayProps)}
      isDismissable={isDismissable}
      className={css({
        alignItems: 'flex-end',
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
        data-fill-screen={isFixedHeight || undefined}
        className={classNames(
          css({
            backgroundColor: tokenSchema.color.background.surface,
            maxHeight: `calc(100dvh - ${tokenSchema.size.space.xxlarge})`,
            maxWidth: '100vw',
            outline: 0,
            paddingBottom: 'env(safe-area-inset-bottom)',
            transform: 'translateY(0)',
            transition: transition(['opacity', 'transform'], {
              delay: 'short',
              easing: 'easeOut',
            }),
            width: '100%',

            '&[data-entering], &[data-exiting]': {
              opacity: 0,
              transform: 'translateY(100%)',
            },
            '&[data-fill-screen]': {
              height: `calc(100dvh - ${tokenSchema.size.space.xxlarge})`,
            },
            [breakpointQueries.above.mobile]: {
              borderStartEndRadius: tokenSchema.size.radius.medium,
              borderStartStartRadius: tokenSchema.size.radius.medium,
              maxWidth: breakpoints.tablet,
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
