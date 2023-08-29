import {
  classNames,
  css,
  filterStyleProps,
  toDataAttributes,
  transition,
  useStyleProps,
} from '@keystar/ui/style';

import { BlanketProps } from './types';

/**
 * A low-level utility component that covers the underlying interface while an
 * overlay component is open.
 */
export function Blanket(props: BlanketProps) {
  const { isOpen, isTransparent, ...otherProps } = props;
  const styleProps = useStyleProps(otherProps);

  return (
    <div
      {...filterStyleProps(otherProps)}
      {...toDataAttributes({
        fill: isTransparent ? 'transparent' : 'translucent',
        open: isOpen || undefined,
      })}
      {...styleProps}
      className={classNames(
        css({
          inset: 0,
          opacity: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
          position: 'fixed',
          visibility: 'hidden',
          zIndex: 1,

          // exit animation
          '&[data-fill="translucent"]': {
            backgroundColor: '#0006', // TODO: add token
            transition: [
              transition('opacity', {
                easing: 'easeOut',
                duration: 'regular',
                delay: 'short',
              }),
              transition('visibility', {
                delay: 'regular',
                duration: 0,
                easing: 'linear',
              }),
            ].join(', '),
          },

          '&[data-open="true"]': {
            opacity: 1,
            pointerEvents: 'auto',
            visibility: 'visible',

            // enter animation
            transition: transition('opacity', { easing: 'easeIn' }),
          },
        }),
        styleProps.className
      )}
    />
  );
}
