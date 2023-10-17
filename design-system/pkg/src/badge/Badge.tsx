import { AriaLabelingProps, DOMProps } from '@react-types/shared';
import { filterDOMProps } from '@react-aria/utils';
import {
  ReactNode,
  forwardRef,
  useMemo,
  ForwardedRef,
  ForwardRefExoticComponent,
  Ref,
} from 'react';

import { Flex } from '@keystar/ui/layout';
import { SlotProvider } from '@keystar/ui/slots';
import { BaseStyleProps, useStyleProps } from '@keystar/ui/style';
import { Text } from '@keystar/ui/typography';
import { isReactText } from '@keystar/ui/utils';

type BadgeTones =
  | 'accent'
  | 'caution'
  | 'critical'
  | 'highlight'
  | 'neutral'
  | 'pending'
  | 'positive';

export type BadgeProps = {
  /** The content to display within the badge. */
  children: ReactNode;
  /**
   * The tone of the badge.
   * @default 'neutral'
   */
  tone?: BadgeTones;
} & BaseStyleProps &
  DOMProps &
  AriaLabelingProps;

/**
 * A badge is a decorative indicator used to either call attention to an item or
 * for communicating non-actionable, supplemental information.
 */
export const Badge: ForwardRefExoticComponent<
  BadgeProps & { ref?: Ref<HTMLDivElement> }
> = forwardRef(function Badge(
  props: BadgeProps,
  forwardedRef: ForwardedRef<HTMLDivElement>
) {
  const { children, tone = 'neutral', ...otherProps } = props;
  const styleProps = useStyleProps(otherProps);

  const bg = tone === 'neutral' ? 'surfaceSecondary' : tone;
  const fg = tone === 'neutral' ? undefined : tone;

  const slots = useMemo(
    () =>
      ({
        icon: { color: fg },
        text: { trim: false, color: fg, weight: 'medium' },
      }) as const,
    [fg]
  );

  return (
    <Flex
      UNSAFE_className={styleProps.className}
      UNSAFE_style={styleProps.style}
      ref={forwardedRef}
      {...filterDOMProps(otherProps, { labelable: true })}
      // appearance
      backgroundColor={bg}
      borderRadius="full"
      height="element.small"
      minWidth={0}
      paddingX="regular"
      // layout
      alignItems="center"
      flexShrink={0}
      gap="small"
      inline
    >
      <SlotProvider slots={slots}>
        {isReactText(children) ? <Text>{children}</Text> : children}
      </SlotProvider>
    </Flex>
  );
});
