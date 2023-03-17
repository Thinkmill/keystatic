import { useToastRegion } from '@react-aria/toast';
import React, { ReactElement, useRef } from 'react';
import ReactDOM from 'react-dom';

import { VoussoirProvider } from '@voussoir/core';
import {
  FocusRing,
  useIsMobileDevice,
  css,
  tokenSchema,
} from '@voussoir/style';

import { ToasterProps } from './types';
import { toastClassList } from './Toast';

/** @private */
export function Toaster(props: ToasterProps): ReactElement {
  let { children, state } = props;
  let containerPlacement = useIsMobileDevice() ? 'center' : 'right';

  let ref = useRef<HTMLDivElement>(null);
  let { regionProps } = useToastRegion(props, state, ref);

  let contents = (
    <VoussoirProvider UNSAFE_style={{ background: 'transparent' }}>
      <FocusRing>
        <div
          {...regionProps}
          ref={ref}
          data-position="bottom"
          data-placement={containerPlacement}
          className={css({
            display: 'flex',
            insetInline: 0,
            outline: 'none',
            pointerEvents: 'none',
            position: 'fixed',
            zIndex: 100050 /* above modals */,

            [toastClassList.selector('element')]: {
              margin: tokenSchema.size.space.large,
              pointerEvents: 'auto',
              position: 'absolute',
            },

            '&[data-focus=visible] > :first-child': {
              boxShadow: `0 0 0 ${tokenSchema.size.alias.focusRing} ${tokenSchema.color.alias.focusRing}`,
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

            '&[data-placement=left]': {
              alignItems: 'flex-start',
              '--slide-from': 'translateX(-100%)',
              '--slide-to': 'translateX(0)',

              '&:dir(rtl)': {
                '--slide-from': 'translateX(100%)',
              },
            },
            '&[data-placement=center]': {
              alignItems: 'center',
            },
            '&[data-placement=right]': {
              alignItems: 'flex-end',
              '--slide-from': 'translateX(100%)',
              '--slide-to': 'translateX(0)',

              '&:dir(rtl)': {
                '--slide-from': 'translateX(-100%)',
              },
            },
          })}
        >
          {children}
        </div>
      </FocusRing>
    </VoussoirProvider>
  );

  return ReactDOM.createPortal(contents, document.body);
}
