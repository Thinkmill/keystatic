import { PropsWithChildren, ReactElement, useRef } from 'react';

import { Flex } from '@keystar/ui/layout';
import { useLink } from '@keystar/ui/link';
import {
  classNames,
  containerQueries,
  css,
  tokenSchema,
  transition,
} from '@keystar/ui/style';
import { Heading, Text } from '@keystar/ui/typography';

export const DashboardSection = ({
  children,
  title,
}: PropsWithChildren<{ title: string }>) => {
  return (
    <Flex elementType="section" direction="column" gap="medium">
      <Text
        casing="uppercase"
        color="neutralTertiary"
        size="small"
        weight="bold"
        elementType="h2"
      >
        {title}
      </Text>
      {children}
    </Flex>
  );
};

export const FILL_COLS = 'fill';

export const DashboardGrid = (props: PropsWithChildren) => {
  return (
    <div
      className={css({
        display: 'grid',
        gap: tokenSchema.size.space.large,
        gridAutoRows: tokenSchema.size.element.xlarge,
        gridTemplateColumns: `[${FILL_COLS}-start] 1fr [${FILL_COLS}-end]`,

        [containerQueries.above.mobile]: {
          gridTemplateColumns: `[${FILL_COLS}-start] 1fr 1fr [${FILL_COLS}-end]`,
        },
        [containerQueries.above.tablet]: {
          gridTemplateColumns: `[${FILL_COLS}-start] 1fr 1fr 1fr [${FILL_COLS}-end]`,
        },
      })}
      {...props}
    />
  );
};

export const DashboardCard = (
  props: PropsWithChildren<{
    endElement?: ReactElement;
    href: string;
    label: string;
  }>
) => {
  const ref = useRef<HTMLAnchorElement>(null);
  const { linkProps } = useLink(props, ref);
  return (
    <Flex
      alignItems="center"
      backgroundColor="canvas"
      padding="large"
      position="relative"
    >
      <Flex direction="column" gap="medium" flex>
        <Heading elementType="h3" size="small" truncate>
          <a
            ref={ref}
            href={props.href}
            {...linkProps}
            className={classNames(
              css({
                color: tokenSchema.color.foreground.neutral,
                outline: 'none',

                '&:hover': {
                  color: tokenSchema.color.foreground.neutralEmphasis,

                  '::before': {
                    backgroundColor: tokenSchema.color.alias.backgroundIdle,
                    borderColor: tokenSchema.color.border.neutral,
                  },
                },
                '&:active': {
                  '::before': {
                    backgroundColor: tokenSchema.color.alias.backgroundHovered,
                    borderColor: tokenSchema.color.alias.borderHovered,
                  },
                },
                '&:focus-visible::before': {
                  outline: `${tokenSchema.size.alias.focusRing} solid ${tokenSchema.color.alias.focusRing}`,
                  outlineOffset: tokenSchema.size.alias.focusRingGap,
                },

                // fill the available space so that the card is clickable
                '::before': {
                  border: `${tokenSchema.size.border.regular} solid ${tokenSchema.color.border.muted}`,
                  borderRadius: tokenSchema.size.radius.medium,
                  content: '""',
                  position: 'absolute',
                  inset: 0,
                  transition: transition(['background-color', 'border-color']),
                },
              })
            )}
          >
            {props.label}
          </a>
        </Heading>
        {props.children}
      </Flex>
      {props.endElement}
    </Flex>
  );
};
