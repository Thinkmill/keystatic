import {
  filterDOMProps,
  useLayoutEffect,
  useObjectRef,
  useResizeObserver,
} from '@react-aria/utils';
import { DOMProps } from '@react-types/shared';
import {
  ForwardedRef,
  ForwardRefExoticComponent,
  ReactNode,
  Ref,
  forwardRef,
  useCallback,
  useState,
} from 'react';

import {
  BaseStyleProps,
  BoxAlignmentStyleProps,
  BoxStyleProps,
  classNames,
  css,
  tokenSchema,
  transition,
} from '@keystar/ui/style';
import { useGridStyleProps } from '.';

export type ScrollDirection = 'vertical' | 'horizontal';
export type ScrollIndicator = 'start' | 'end' | 'both' | 'none';
export type ScrollViewProps = {
  /** The content of the scroll view. */
  children?: ReactNode;
  /**
   * Which direction to allow scroll.
   * @default 'vertical'
   */
  direction?: ScrollDirection;
} & BoxAlignmentStyleProps &
  Omit<BoxStyleProps, 'display'> &
  DOMProps &
  BaseStyleProps;

export const ScrollView: ForwardRefExoticComponent<
  ScrollViewProps & { ref?: Ref<HTMLDivElement> }
> = forwardRef(function ScrollView(
  props: ScrollViewProps,
  forwardedRef: ForwardedRef<HTMLDivElement>
) {
  let { children, direction = 'vertical', ...otherProps } = props;
  let ref = useObjectRef(forwardedRef);
  let [scrollIndicator, setScrollIndicator] = useState<ScrollIndicator>('none');
  let styleProps = useGridStyleProps(otherProps);

  let updateScrollPosition = useCallback(() => {
    let node = ref.current;
    if (!node) {
      return;
    }
    let { clientDimension, scrollDimension, scrollStart } = getScrollProps(
      direction,
      node
    );
    let indicator: ScrollIndicator = 'none';

    if (scrollDimension > clientDimension) {
      if (scrollStart === 0) {
        indicator = 'end';
      } else if (Math.ceil(scrollStart + clientDimension) >= scrollDimension) {
        indicator = 'start';
      } else if (scrollStart > 0) {
        indicator = 'both';
      }
    }

    setScrollIndicator(indicator);
  }, [direction, ref]);

  useLayoutEffect(() => {
    updateScrollPosition();
  }, [updateScrollPosition]);
  useResizeObserver({ ref, onResize: updateScrollPosition });

  // TODO: this is overly complex. switch from pseudo-elements to borders. move
  // to "layout" package and accept box style props
  return (
    <div
      {...styleProps}
      {...filterDOMProps(props)}
      onScroll={updateScrollPosition}
      ref={ref}
      data-scroll-indicator={scrollIndicator}
      data-scroll-direction={direction}
      className={classNames(
        css({
          height: '100%',
          width: '100%',
          minHeight: 0,
          minWidth: 0,
          transition: transition('border-color', { duration: 'regular' }),
          WebkitOverflowScrolling: 'touch',

          '&[data-scroll-direction=vertical]': {
            borderBlock: `${tokenSchema.size.border.regular} solid transparent`,
            // marginBlock: `calc(${tokenSchema.size.border.regular} * -1)`,
            overflowX: 'hidden',
            overflowY: 'auto',

            '&[data-scroll-indicator=both]': {
              borderBlockColor: tokenSchema.color.border.neutral,
            },
            '&[data-scroll-indicator=start]': {
              borderBlockStartColor: tokenSchema.color.border.neutral,
            },
            '&[data-scroll-indicator=end]': {
              borderBlockEndColor: tokenSchema.color.border.neutral,
            },
          },
          '&[data-scroll-direction=horizontal]': {
            borderInline: `${tokenSchema.size.border.regular} solid transparent`,
            // marginInline: `calc(${tokenSchema.size.border.regular} * -1)`,
            gridAutoFlow: 'column',
            overflowX: 'auto',
            overflowY: 'hidden',

            '&[data-scroll-indicator=both]': {
              borderInlineColor: tokenSchema.color.border.neutral,
            },
            '&[data-scroll-indicator=start]': {
              borderInlineStartColor: tokenSchema.color.border.neutral,
            },
            '&[data-scroll-indicator=end]': {
              borderInlineEndColor: tokenSchema.color.border.neutral,
            },
          },
        }),
        styleProps.className
      )}
    >
      {children}
    </div>
  );
});

function getScrollProps(direction: ScrollDirection, node: HTMLElement) {
  let scrollStart =
    direction === 'horizontal' ? node.scrollLeft : node.scrollTop;
  let scrollDimension =
    direction === 'horizontal' ? node.scrollWidth : node.scrollHeight;
  let clientDimension =
    direction === 'horizontal' ? node.clientWidth : node.clientHeight;

  return { clientDimension, scrollDimension, scrollStart };
}
