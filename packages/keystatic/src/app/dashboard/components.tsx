import { PropsWithChildren, ReactElement, useRef } from 'react';

import { Flex } from '@keystar/ui/layout';
import { useLink } from '@keystar/ui/link';
import {
  classNames,
  containerQueries,
  css,
  tokenSchema,
} from '@keystar/ui/style';
import { Heading, Text } from '@keystar/ui/typography';

export const DashboardSection = ({
  children,
  endElement,
  title,
}: PropsWithChildren<{ title: string; endElement?: ReactElement }>) => {
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
            height: tokenSchema.size.space.small,
            backgroundImage: `linear-gradient(90deg, ${tokenSchema.color.scale.indigo5}, ${tokenSchema.color.scale.green5})`,
            opacity: 0.9,
          })}
        />
        {endElement}
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
      gap="medium"
      backgroundColor="surface"
      borderRadius="large"
      padding="large"
      position="relative"
      UNSAFE_className={css({
        overflow: 'hidden',
        minHeight: tokenSchema.size.element.xlarge,
        border: `${tokenSchema.size.border.regular} solid ${tokenSchema.color.border.neutral}`,
        backgroundColor: tokenSchema.color.background.surface,
        boxShadow: `0 14px 28px ${tokenSchema.color.shadow.muted}`,
        transition:
          'box-shadow 160ms ease, transform 160ms ease, border-color 160ms ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          borderColor: tokenSchema.color.border.accent,
          boxShadow: `0 18px 34px ${tokenSchema.color.shadow.regular}`,
        },
      })}
    >
      <Flex direction="column" gap="small" flex>
        <Heading elementType="h3" size="small" truncate>
          <a
            ref={ref}
            href={props.href}
            {...linkProps}
            className={classNames(
              css({
                color: tokenSchema.color.foreground.neutral,
                outline: 'none',
                textDecoration: 'none',
                '&:hover': {
                  color: tokenSchema.color.foreground.accent,
                },
                '&:focus-visible::before': {
                  outline: `${tokenSchema.size.alias.focusRing} solid ${tokenSchema.color.alias.focusRing}`,
                  outlineOffset: tokenSchema.size.alias.focusRingGap,
                },
                '::before': {
                  content: '""',
                  position: 'absolute',
                  inset: 0,
                  borderRadius: tokenSchema.size.radius.large,
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
        <Flex
          alignItems="flex-start"
          position="relative"
          zIndex={1}
          UNSAFE_className={css({
            marginInlineStart: tokenSchema.size.space.medium,
            flexShrink: 0,
          })}
        >
          {props.endElement}
        </Flex>
      )}
    </Flex>
  );
};
