import {
  filterDOMProps,
  useLayoutEffect,
  useObjectRef,
  useResizeObserver,
  useValueEffect,
} from '@react-aria/utils';
import {
  ForwardedRef,
  forwardRef,
  ForwardRefExoticComponent,
  MutableRefObject,
  ReactNode,
  Ref,
  useMemo,
  useRef,
} from 'react';

import {
  KeystarProvider,
  useProvider,
  useProviderProps,
} from '@keystar/ui/core';
import { useSlotProps } from '@keystar/ui/slots';
import {
  classNames,
  css,
  toDataAttributes,
  tokenSchema,
  useStyleProps,
} from '@keystar/ui/style';

import { ButtonGroupProps } from './types';

function getCheckForOverflow(
  domRef: MutableRefObject<HTMLDivElement | null>,
  orientation: string,
  _scale: string,
  setHasOverflow: (value: () => Generator<any, void, unknown>) => void,
  _children: ReactNode
) {
  return () => {
    let computeHasOverflow = () => {
      if (domRef.current && orientation === 'horizontal') {
        let buttonGroupChildren = Array.from(
          domRef.current.children
        ) as HTMLElement[];
        let maxX = domRef.current.offsetWidth + 1; // + 1 to account for rounding errors
        // If any buttons have negative X positions (align="end") or extend beyond
        // the width of the button group (align="start"), then switch to vertical.
        if (
          buttonGroupChildren.some(
            child =>
              child.offsetLeft < 0 ||
              child.offsetLeft + child.offsetWidth > maxX
          )
        ) {
          return true;
        }
        return false;
      }
    };
    if (orientation === 'horizontal') {
      setHasOverflow(function* () {
        // Force to horizontal for measurement.
        yield false;

        // Measure, and update if there is overflow.
        yield computeHasOverflow();
      });
    }
  };
}

/**
 * Handles overflow for a grouping of buttons whose actions are related to each
 * other.
 */
export const ButtonGroup: ForwardRefExoticComponent<
  ButtonGroupProps & { ref?: Ref<HTMLDivElement> }
> = forwardRef(function ButtonGroup(
  props: ButtonGroupProps,
  forwardedRef: ForwardedRef<HTMLDivElement>
) {
  let { scale } = useProvider();
  props = useProviderProps(props);
  props = useSlotProps(props, 'buttonGroup');

  let {
    align = 'start',
    children,
    isDisabled,
    orientation = 'horizontal',
    ...otherProps
  } = props;

  let styleProps = useStyleProps(otherProps);
  let domRef = useObjectRef(forwardedRef);
  let [hasOverflow, setHasOverflow] = useValueEffect(false);

  // Avoid widows, horizontal orientations may switch to vertical when there
  // isn't enough space for all buttons in a single row. There's no "wrap"
  // event, so we have to measure.
  let checkForOverflow = useMemo(() => {
    return getCheckForOverflow(
      domRef,
      orientation,
      scale,
      setHasOverflow,
      children
    );
  }, [domRef, orientation, scale, setHasOverflow, children]);

  // There are two main reasons we need to remeasure:
  // 1. Internal changes: Check for initial overflow or when
  //    orientation/scale/children change (from checkForOverflow dep array)
  useLayoutEffect(() => {
    checkForOverflow();
  }, [checkForOverflow]);

  // 2. External changes: buttongroup won't change size due to any parents
  //    changing size, so listen to its container for size changes to figure out
  //    if we should remeasure
  let parent = useRef<HTMLElement>();
  useLayoutEffect(() => {
    if (domRef.current) {
      parent.current = domRef.current.parentElement as HTMLElement;
    }
  });
  useResizeObserver({ ref: parent, onResize: checkForOverflow });

  return (
    <div
      {...filterDOMProps(otherProps)}
      {...toDataAttributes({
        align,
        orientation: hasOverflow ? 'vertical' : orientation,
      })}
      {...styleProps}
      ref={domRef}
      className={classNames(
        styleProps.className,
        css({
          alignItems: 'flex-start',
          display: 'inline-flex',
          gap: tokenSchema.size.space.regular,
          position: 'relative',

          '&[data-orientation="horizontal"]': {
            '&[data-align="center"]': {
              justifyContent: 'center',
            },
            '&[data-align="end"]': {
              justifyContent: 'flex-end',
            },
          },

          '&[data-orientation="vertical"]': {
            flexDirection: 'column',

            '&[data-align="center"]': {
              alignItems: 'center',
            },
            '&[data-align="end"]': {
              alignItems: 'flex-end',
            },
          },
        })
      )}
    >
      <KeystarProvider isDisabled={isDisabled}>{children}</KeystarProvider>
    </div>
  );
});
