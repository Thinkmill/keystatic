import { useLocale } from '@react-aria/i18n';
import { useToastRegion } from '@react-aria/toast';
import React, { ReactElement, useRef } from 'react';
import ReactDOM from 'react-dom';

import { KeystarProvider } from '@keystar/ui/core';
import {
  FocusRing,
  useIsMobileDevice,
  css,
  tokenSchema,
} from '@keystar/ui/style';

import { ToastContainerProps } from './types';

/** @private Positioning and provider for toast children. */
export function ToastContainer(props: ToastContainerProps): ReactElement {
  let { children, state } = props;

  let { direction } = useLocale();
  let isMobileDevice = useIsMobileDevice();
  let placement = isMobileDevice ? 'center' : props.placement || 'end';
  let position = isMobileDevice ? 'bottom' : props.position || 'bottom';

  let ref = useRef<HTMLDivElement>(null);
  let { regionProps } = useToastRegion(props, state, ref);

  let contents = (
    <KeystarProvider UNSAFE_style={{ background: 'transparent' }}>
      <FocusRing>
        <div
          {...regionProps}
          ref={ref}
          // TODO: replace with CSS `dir(rtl)` when supported: https://caniuse.com/css-dir-pseudo
          data-direction={direction}
          data-position={position}
          data-placement={placement}
          className={css({
            display: 'flex',
            insetInline: 0,
            outline: 'none',
            pointerEvents: 'none',
            position: 'fixed',
            zIndex: 100 /* above modals */,

            '&[data-focus=visible] > :first-child:after': {
              borderRadius: `calc(${tokenSchema.size.radius.regular} + ${tokenSchema.size.alias.focusRingGap})`,
              boxShadow: `0 0 0 ${tokenSchema.size.alias.focusRing} ${tokenSchema.color.alias.focusRing}`,
              content: '""',
              inset: 0,
              margin: `calc(-1 * ${tokenSchema.size.alias.focusRingGap})`,
              pointerEvents: 'none',
              position: 'absolute' as const,
            },

            '&[data-position=top]': {
              top: 0,
              flexDirection: 'column',
              '--slide-from': 'translateY(-100%)',
              '--slide-to': 'translateY(0)',
            },
            '&[data-position=bottom]': {
              bottom: 0,
              flexDirection: 'column-reverse',
              '--slide-from': 'translateY(100%)',
              '--slide-to': 'translateY(0)',
            },

            '&[data-placement=start]': {
              alignItems: 'flex-start',
              '--slide-from': 'translateX(-100%)',
              '--slide-to': 'translateX(0)',

              '&[data-direction=rtl]': {
                '--slide-from': 'translateX(100%)',
              },
            },
            '&[data-placement=center]': {
              alignItems: 'center',
            },
            '&[data-placement=end]': {
              alignItems: 'flex-end',
              '--slide-from': 'translateX(100%)',
              '--slide-to': 'translateX(0)',

              '&[data-direction=rtl]': {
                '--slide-from': 'translateX(-100%)',
              },
            },
          })}
        >
          {children}
        </div>
      </FocusRing>
    </KeystarProvider>
  );

  return ReactDOM.createPortal(contents, document.body);
}
