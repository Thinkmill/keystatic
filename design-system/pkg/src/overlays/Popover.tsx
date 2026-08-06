import {
  Popover as AriaPopover,
  type PopoverProps as AriaPopoverProps,
} from 'react-aria-components/Popover';
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

import { DirectionIndicator } from './DirectionIndicator';
import { PopoverProps } from './types';

/** A controlled positioned popover built on React Aria Components. */
export const Popover: ForwardRefExoticComponent<
  PopoverProps & { ref?: Ref<HTMLDivElement> }
> = forwardRef(function Popover(
  props: PopoverProps,
  forwardedRef: ForwardedRef<HTMLDivElement>
) {
  let { children, hideArrow, ...otherProps } = props;
  let styleProps = useStyleProps(props);

  return (
    <AriaPopover
      {...(filterStyleProps(otherProps) as AriaPopoverProps)}
      ref={forwardedRef}
      className={classNames(
        css({
          backgroundColor: tokenSchema.color.background.surface,
          border: `${tokenSchema.size.border.regular} solid ${tokenSchema.color.border.emphasis}`,
          borderRadius: tokenSchema.size.radius.medium,
          boxSizing: 'content-box',
          filter: `drop-shadow(0 1px 4px ${tokenSchema.color.shadow.regular})`,
          opacity: 1,
          outline: 0,
          transition: transition(['opacity', 'transform'], {
            easing: 'easeOut',
          }),
          willChange: 'filter, transform',

          '&[data-entering], &[data-exiting]': { opacity: 0 },
          '&[data-entering][data-placement^="top"], &[data-exiting][data-placement^="top"]':
            {
              transform: `translateY(${tokenSchema.size.space.regular})`,
            },
          '&[data-entering][data-placement^="bottom"], &[data-exiting][data-placement^="bottom"]':
            {
              transform: `translateY(calc(${tokenSchema.size.space.regular} * -1))`,
            },
          '&[data-entering][data-placement^="left"], &[data-exiting][data-placement^="left"]':
            {
              transform: `translateX(${tokenSchema.size.space.regular})`,
            },
          '&[data-entering][data-placement^="right"], &[data-exiting][data-placement^="right"]':
            {
              transform: `translateX(calc(${tokenSchema.size.space.regular} * -1))`,
            },
        }),
        styleProps.className
      )}
      style={styleProps.style}
    >
      {({ placement }) => (
        <>
          {!hideArrow && (
            <DirectionIndicator
              fill="surface"
              stroke={tokenSchema.color.border.emphasis}
              placement={(placement?.split(' ')[0] || 'bottom') as never}
              size="regular"
            />
          )}
          {children}
        </>
      )}
    </AriaPopover>
  );
});
