import { useTooltip } from '@react-aria/tooltip';
import {
  filterDOMProps,
  mergeProps,
  mergeRefs,
  useObjectRef,
} from '@react-aria/utils';
import {
  ForwardedRef,
  forwardRef,
  ForwardRefExoticComponent,
  Ref,
  useContext,
  useMemo,
  useRef,
} from 'react';

import { Axis, DirectionIndicator } from '@keystar/ui/overlays';
import { SlotProvider } from '@keystar/ui/slots';
import {
  classNames,
  css,
  toDataAttributes,
  tokenSchema,
  transition,
  useStyleProps,
} from '@keystar/ui/style';
import { Text } from '@keystar/ui/typography';
import { isReactText } from '@keystar/ui/utils';

import { TooltipContext } from './context';
import { TooltipProps } from './types';
import { useOverlayPosition } from '@react-aria/overlays';

/**
 * A floating text label that succinctly describes the function of an
 * interactive element, typically an icon-only button.
 *
 * Tooltips are invoked on hover and keyboard focus. They cannot include
 * interactive elements.
 */
export const Tooltip: ForwardRefExoticComponent<
  TooltipProps & { ref?: Ref<HTMLDivElement> }
> = forwardRef(function Tooltip(
  props: TooltipProps,
  forwardedRef: ForwardedRef<HTMLDivElement>
) {
  let {
    state,
    targetRef: triggerRef,
    overlayRef: tooltipRef,
    crossOffset,
    offset,
    ...contextualProps
  } = useContext(TooltipContext);
  props = mergeProps(props, contextualProps);

  let { isOpen, tone, ...otherProps } = props;
  let targetGapToken = tokenSchema.size.space.regular;

  let { tooltipProps } = useTooltip(contextualProps, state);
  let styleProps = useStyleProps(otherProps);

  let ref = useRef<HTMLDivElement>(null);
  let overlayRef = useObjectRef(
    tooltipRef ? mergeRefs(tooltipRef, forwardedRef) : forwardedRef
  ); // for testing etc. tooltips may be rendered w/o a trigger
  let targetRef = triggerRef ?? ref; // for testing etc. tooltips may be rendered w/o a trigger

  let slots = useMemo(
    () =>
      ({
        icon: { size: 'small', color: 'inherit' },
        text: { size: 'small', color: 'inherit' },
        kbd: { size: 'small', color: 'inherit' },
      }) as const,
    []
  );

  let preferredPlacement = contextualProps.placement || 'top';
  let {
    overlayProps,
    arrowProps,
    placement: resolvedPlacement,
  } = useOverlayPosition({
    ...contextualProps,
    placement: preferredPlacement,
    isOpen: state?.isOpen,
    overlayRef,
    targetRef,
  });
  let placement = (resolvedPlacement || preferredPlacement).split(' ')[0];

  return (
    <div
      {...mergeProps(overlayProps, tooltipProps)}
      {...filterDOMProps(otherProps)}
      {...toDataAttributes({
        placement,
        tone,
        open: isOpen || undefined,
      })}
      ref={overlayRef}
      className={classNames(
        css({
          backgroundColor: tokenSchema.color.background.inverse,
          color: tokenSchema.color.foreground.inverse,
          borderRadius: tokenSchema.size.radius.small,
          maxWidth: tokenSchema.size.alias.singleLineWidth,
          minHeight: tokenSchema.size.element.small,
          paddingBlock: tokenSchema.size.space.regular,
          paddingInline: tokenSchema.size.space.regular,
          opacity: 0,
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

          // animate towards placement, away from the trigger
          '&[data-placement="top"]': {
            marginBottom: targetGapToken,
            transform: `translateY(calc(${targetGapToken} * 0.5))`,
          },
          '&[data-placement="bottom"]': {
            marginTop: targetGapToken,
            transform: `translateY(calc(${targetGapToken} * -0.5))`,
          },
          '&[data-placement="left"], [dir=ltr] &[data-placement="start"], [dir=rtl] &[data-placement="end"]':
            {
              marginRight: targetGapToken,
              transform: `translateX(calc(${targetGapToken} * 0.5))`,
            },
          '&[data-placement="right"], [dir=ltr] &[data-placement="end"], [dir=rtl] &[data-placement="start"]':
            {
              marginLeft: targetGapToken,
              transform: `translateX(calc(${targetGapToken} * -0.5))`,
            },

          '&[data-open="true"]': {
            opacity: 1,
            transform: `translate(0)`,
          },
        }),
        styleProps.className
      )}
      style={{
        ...overlayProps.style,
        ...tooltipProps.style,
        ...styleProps.style,
      }}
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
          {props.children &&
            (isReactText(props.children) ? (
              <Text>{props.children}</Text>
            ) : (
              props.children
            ))}
        </SlotProvider>
      </div>
      <DirectionIndicator
        {...arrowProps}
        fill={toneToFill[tone ?? 'neutral']}
        placement={placement as Axis}
        size="xsmall"
      />
    </div>
  );
});

const toneToFill = {
  accent: 'accent',
  critical: 'critical',
  neutral: 'inverse',
  positive: 'positive',
};
