import {
  filterDOMProps,
  useLayoutEffect,
  useObjectRef,
} from '@react-aria/utils';
import { AriaLabelingProps, DOMProps } from '@react-types/shared';
import {
  ForwardedRef,
  ReactNode,
  RefObject,
  forwardRef,
  useEffect,
  useMemo,
  useState,
  ForwardRefExoticComponent,
  Ref,
} from 'react';

import { Flex } from '@keystar/ui/layout';
import { SlotProvider } from '@keystar/ui/slots';
import { BaseStyleProps, css, useStyleProps } from '@keystar/ui/style';

import {
  itemContentGutter,
  listBlockGutter,
  textInsetStart,
} from './constants';

export type NavListProps = {
  children: ReactNode;
} & BaseStyleProps &
  DOMProps &
  AriaLabelingProps;

/** Navigation lists let users navigate the application. */
export const NavList: ForwardRefExoticComponent<
  NavListProps & { ref?: Ref<HTMLDivElement> }
> = forwardRef(function NavList(
  props: NavListProps,
  forwardedRef: ForwardedRef<HTMLDivElement>
) {
  const { children, ...otherProps } = props;
  const domRef = useObjectRef(forwardedRef);
  const styleProps = useStyleProps(otherProps);
  const dividerStyles = useDividerStyles();
  const currentItem = useCurrentItem(domRef);

  // FIXME: called by the docs' example snippets. over eager; probably a good
  // indicator that it should be configurable.
  useEffect(() => {
    if (currentItem) {
      currentItem.scrollIntoView({ block: 'center' });
    }
  }, [currentItem]);

  const slots = useMemo(
    () =>
      ({
        divider: {
          'aria-hidden': true,
          elementType: 'li',
          size: 'medium',
          UNSAFE_className: dividerStyles,
        },
      }) as const,
    [dividerStyles]
  );

  return (
    <Flex
      elementType="nav"
      ref={domRef}
      direction="column"
      UNSAFE_className={styleProps.className}
      UNSAFE_style={styleProps.style}
      {...filterDOMProps(otherProps, { labelable: true })}
    >
      <Flex direction="column" elementType="ul" flex="1 0 0">
        <SlotProvider slots={slots}>{children}</SlotProvider>
      </Flex>
    </Flex>
  );
});

// Styles
// -----------------------------------------------------------------------------

function useDividerStyles() {
  return css({
    marginBlock: listBlockGutter,
    marginInlineStart: textInsetStart,
    width: `calc(40% - ${textInsetStart} - ${itemContentGutter})`,
    // FIXME: magic numbers
    minWidth: 80,
    maxWidth: 240,
  });
}

// Utils
// -----------------------------------------------------------------------------

function useCurrentItem(ref: RefObject<HTMLElement>) {
  let [currentItem, setCurrentItem] = useState<Element | null>(null);

  useLayoutEffect(() => {
    let el = ref.current && ref.current.querySelector('[aria-current]');
    if (el) {
      setCurrentItem(el);
    }
  }, [ref]);

  return currentItem;
}
