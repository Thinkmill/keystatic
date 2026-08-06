import {
  OverlayArrow,
  Tooltip as AriaTooltip,
  type TooltipProps as AriaTooltipProps,
} from 'react-aria-components/Tooltip';
import { ForwardedRef, forwardRef, useMemo } from 'react';

import { DirectionIndicator } from '@keystar/ui/overlays';
import { SlotProvider } from '@keystar/ui/slots';
import {
  classNames,
  css,
  filterStyleProps,
  tokenSchema,
  transition,
  useStyleProps,
} from '@keystar/ui/style';
import { Text } from '@keystar/ui/typography';
import { isReactText } from '@keystar/ui/utils';

import { TooltipProps } from './types';

/** A short, non-interactive description shown on hover or keyboard focus. */
export const Tooltip = forwardRef(function Tooltip(
  props: TooltipProps,
  forwardedRef: ForwardedRef<HTMLDivElement>
) {
  let { children, tone = 'neutral', ...otherProps } = props;
  let styleProps = useStyleProps(otherProps);
  let slots = useMemo(
    () =>
      ({
        icon: { size: 'small', color: 'inherit' },
        text: { size: 'small', color: 'inherit' },
        kbd: { size: 'small', color: 'inherit' },
      }) as const,
    []
  );

  return (
    <AriaTooltip
      {...(filterStyleProps(otherProps) as AriaTooltipProps)}
      ref={forwardedRef}
      data-tone={tone}
      className={classNames(
        css({
          backgroundColor: tokenSchema.color.background.inverse,
          borderRadius: tokenSchema.size.radius.small,
          color: tokenSchema.color.foreground.inverse,
          maxWidth: tokenSchema.size.alias.singleLineWidth,
          minHeight: tokenSchema.size.element.small,
          opacity: 1,
          paddingBlock: tokenSchema.size.space.regular,
          paddingInline: tokenSchema.size.space.regular,
          pointerEvents: 'none',
          transition: transition(['opacity', 'transform']),
          userSelect: 'none',

          '&[data-tone="accent"]': {
            backgroundColor: tokenSchema.color.background.accentEmphasis,
            color: tokenSchema.color.foreground.onEmphasis,
          },
          '&[data-tone="critical"]': {
            backgroundColor: tokenSchema.color.background.criticalEmphasis,
            color: tokenSchema.color.foreground.onEmphasis,
          },
          '&[data-tone="positive"]': {
            backgroundColor: tokenSchema.color.background.positiveEmphasis,
            color: tokenSchema.color.foreground.onEmphasis,
          },
          '&[data-entering], &[data-exiting]': {
            opacity: 0,
          },
          '&[data-placement="top"][data-entering], &[data-placement="top"][data-exiting]':
            {
              transform: `translateY(calc(${tokenSchema.size.space.regular} * 0.5))`,
            },
          '&[data-placement="bottom"][data-entering], &[data-placement="bottom"][data-exiting]':
            {
              transform: `translateY(calc(${tokenSchema.size.space.regular} * -0.5))`,
            },
        }),
        styleProps.className
      )}
      style={styleProps.style}
    >
      <div
        className={css({
          alignItems: 'center',
          boxSizing: 'border-box',
          display: 'flex',
          gap: tokenSchema.size.space.small,
        })}
      >
        <SlotProvider slots={slots}>
          {isReactText(children) ? <Text>{children}</Text> : children}
        </SlotProvider>
      </div>
      <OverlayArrow>
        {({ placement }) => (
          <DirectionIndicator
            fill={toneToFill[tone]}
            placement={placement as 'top' | 'bottom' | 'left' | 'right'}
            size="xsmall"
          />
        )}
      </OverlayArrow>
    </AriaTooltip>
  );
});

const toneToFill = {
  accent: 'accent',
  critical: 'critical',
  neutral: 'inverse',
  positive: 'positive',
} as const;
