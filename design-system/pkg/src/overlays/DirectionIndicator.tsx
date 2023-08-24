import {
  classNames,
  css,
  toDataAttributes,
  tokenSchema,
} from '@keystar/ui/style';
import { HTMLAttributes } from 'react';

type DirectionIndicatorProps = {
  /** The SVG fill color. */
  fill: string;
  /** The simulated stroke color. */
  stroke?: string;
  /** The size of the indicator. */
  size: 'xsmall' | 'small' | 'regular';
  /**
   * The placement of the overlay element, relative to its target.
   * @default 'bottom'
   */
  placement?: 'start' | 'end' | 'right' | 'left' | 'top' | 'bottom';
} & HTMLAttributes<HTMLElement>;

export function DirectionIndicator({
  fill,
  placement,
  size,
  stroke,
  ...props
}: DirectionIndicatorProps) {
  return (
    <span
      {...props}
      {...toDataAttributes({ fill, placement, size })}
      data-placement={placement}
      className={classNames(
        css({
          height: 'var(--size)',
          position: 'absolute',
          width: 'var(--size)',

          // fill
          '&[data-fill="surface"]': {
            fill: tokenSchema.color.background.surface,
          },
          '&[data-fill="inverse"]': {
            fill: tokenSchema.color.background.inverse,
          },
          '&[data-fill="accent"]': {
            fill: tokenSchema.color.background.accentEmphasis,
          },
          '&[data-fill="critical"]': {
            fill: tokenSchema.color.background.criticalEmphasis,
          },
          '&[data-fill="positive"]': {
            fill: tokenSchema.color.background.positiveEmphasis,
          },

          // size
          '&[data-size="xsmall"]': {
            '--size': tokenSchema.size.element.xsmall,
          },
          '&[data-size="small"]': { '--size': tokenSchema.size.element.small },
          '&[data-size="regular"]': {
            '--size': tokenSchema.size.element.regular,
          },

          // align block
          '&[data-placement="top"], &[data-placement="bottom"]': {
            left: '50%',
            transform: 'translateX(-50%)',
          },
          '&[data-placement="top"]': { top: '100%' },
          '&[data-placement="bottom"]': { bottom: '100%' },
          // align inline
          '&[data-placement="left"], &[data-placement="right"], &[data-placement="start"], &[data-placement="end"]':
            {
              top: '50%',
              transform: 'translateY(-50%)',
            },
          '&[data-placement="left"]': { left: '100%' },
          '&[data-placement="right"]': { right: '100%' },
          '&[data-placement="start"]': { insetInlineStart: '100%' },
          '&[data-placement="end"]': { insetInlineEnd: '100%' },
        }),
        props.className
      )}
    >
      <svg
        data-placement={placement}
        viewBox="0 0 30 30"
        className={css({
          // bottom is default; no rotation
          '&[data-placement="top"]': { transform: 'rotate(180deg)' },
          '&[data-placement="left"], [dir=ltr] &[data-placement="start"], [dir=rtl] &[data-placement="end"]':
            { transform: 'rotate(90deg)' },
          '&[data-placement="right"], [dir=ltr] &[data-placement="end"], [dir=rtl] &[data-placement="start"]':
            { transform: 'rotate(270deg)' },
        })}
      >
        {stroke && (
          <path
            fill={stroke}
            d="M23.7,27.1L17,19.9C16.5,19.3,15.8,19,15,19s-1.6,0.3-2.1,0.9l-6.6,7.2C5.3,28.1,3.4,29,2,29h26 C26.7,29,24.6,28.1,23.7,27.1z"
          />
        )}
        <path d="M23,27.8c1.1,1.2,3.4,2.2,5,2.2h2H0h2c1.7,0,3.9-1,5-2.2l6.6-7.2c0.7-0.8,2-0.8,2.7,0L23,27.8L23,27.8z" />
      </svg>
    </span>
  );
}
