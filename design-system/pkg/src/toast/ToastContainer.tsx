import { UNSTABLE_ToastRegion as AriaToastRegion } from 'react-aria-components/Toast';

import { KeystarProvider } from '@keystar/ui/core';
import { css, tokenSchema, useIsMobileDevice } from '@keystar/ui/style';

import { Toast } from './Toast';
import { ToastContainerProps } from './types';

/** @private Positioning and provider for the RAC toast region. */
export function ToastContainer(props: ToastContainerProps) {
  let {
    placement: placementProp,
    position: positionProp,
    queue,
    ...ariaProps
  } = props;
  let isMobileDevice = useIsMobileDevice();
  let placement = isMobileDevice ? 'center' : placementProp || 'end';
  let position = isMobileDevice ? 'bottom' : positionProp || 'bottom';

  return (
    <KeystarProvider UNSAFE_style={{ background: 'transparent' }}>
      <AriaToastRegion
        {...ariaProps}
        queue={queue}
        data-position={position}
        data-placement={placement}
        className={css({
          display: 'flex',
          insetInline: 0,
          outline: 'none',
          pointerEvents: 'none',
          position: 'fixed',
          zIndex: 100,

          '&[data-focus-visible] > :first-child:after': {
            borderRadius: `calc(${tokenSchema.size.radius.regular} + ${tokenSchema.size.alias.focusRingGap})`,
            boxShadow: `0 0 0 ${tokenSchema.size.alias.focusRing} ${tokenSchema.color.alias.focusRing}`,
            content: '""',
            inset: 0,
            margin: `calc(-1 * ${tokenSchema.size.alias.focusRingGap})`,
            pointerEvents: 'none',
            position: 'absolute',
          },
          '&[data-position=top]': {
            flexDirection: 'column',
            top: 0,
          },
          '&[data-position=bottom]': {
            bottom: 0,
            flexDirection: 'column-reverse',
          },
          '&[data-placement=start]': { alignItems: 'flex-start' },
          '&[data-placement=center]': { alignItems: 'center' },
          '&[data-placement=end]': { alignItems: 'flex-end' },
        })}
      >
        {({ toast }) => <Toast toast={toast} />}
      </AriaToastRegion>
    </KeystarProvider>
  );
}
