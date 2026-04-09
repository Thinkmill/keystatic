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
    <Flex elementType="section" direction="column" gap="large">
      <Flex alignItems="center" gap="medium">
        <Text
          casing="uppercase"
          color="neutralSecondary"
          size="small"
          weight="bold"
          elementType="h2"
          UNSAFE_className={css({
            letterSpacing: '0.08em',
            lineHeight: 1.5,
          })}
        >
          {title}
        </Text>
        <div
          className={css({
            borderRadius: tokenSchema.size.radius.full,
            flex: 1,
            height: tokenSchema.size.space.xsmall,
            backgroundImage: `linear-gradient(90deg, ${tokenSchema.color.scale.indigo5}, ${tokenSchema.color.scale.green5})`,
            opacity: 0.6,
          })}
        />
      </Flex>
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
        gridAutoRows: `minmax(${tokenSchema.size.element.xlarge}, auto)`,
        gridTemplateColumns: `[${FILL_COLS}-start] 1fr [${FILL_COLS}-end]`,
        alignItems: 'stretch',

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
      alignItems="start"
      backgroundColor="surface"
      borderRadius="medium"
      padding="large"
      position="relative"
      UNSAFE_className={css({
        isolation: 'isolate',
        overflow: 'hidden',
        boxShadow: `${tokenSchema.size.shadow.small} ${tokenSchema.color.shadow.muted}`,
        minHeight: tokenSchema.size.element.xlarge,
        border: `${tokenSchema.size.border.regular} solid ${tokenSchema.color.border.muted}`,

        '::after': {
          content: '""',
          position: 'absolute',
          inset: '-35% -20% auto 45%',
          height: tokenSchema.size.space.xxlarge,
          borderRadius: tokenSchema.size.radius.full,
          backgroundImage: `radial-gradient(circle at center, ${tokenSchema.color.scale.indigo6}, transparent 70%)`,
          opacity: 0.12,
          pointerEvents: 'none',
          transition: transition(['opacity']),
          zIndex: -1,
        },

        '&:hover::after': {
          opacity: 0.25,
        },

        '&:hover': {
          boxShadow: `${tokenSchema.size.shadow.medium} ${tokenSchema.color.shadow.regular}`,
        },
      })}
    >
      <Flex direction="column" gap="medium" flex>
        <Heading
          elementType="h3"
          size="small"
          truncate
          UNSAFE_style={{ lineHeight: 1.4 }}
        >
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
                    backgroundColor: tokenSchema.color.alias.backgroundHovered,
                    borderColor: tokenSchema.color.border.neutral,
                    boxShadow: `${tokenSchema.size.shadow.medium} ${tokenSchema.color.shadow.regular}`,
                    transform: 'translateY(-3px)',
                  },
                },
                '&:active': {
                  '::before': {
                    backgroundColor: tokenSchema.color.alias.backgroundHovered,
                    borderColor: tokenSchema.color.alias.borderHovered,
                    boxShadow: 'none',
                    transform: 'translateY(0)',
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
                  transition: transition([
                    'background-color',
                    'border-color',
                    'box-shadow',
                    'transform',
                  ]),
                },
              })
            )}
          >
            {props.label}
          </a>
        </Heading>
        {props.children}
      </Flex>
      {props.endElement && (
        <Flex alignItems="flex-start" position="relative" zIndex={2}>
          {props.endElement}
        </Flex>
      )}
    </Flex>
  );
};
