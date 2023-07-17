import { PropsWithChildren, ReactElement } from 'react';

import { Flex } from '@keystar/ui/layout';
import { useLinkComponent } from '@keystar/ui/link';
import { containerQueries, css, tokenSchema } from '@keystar/ui/style';
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

export const DashboardGrid = (props: PropsWithChildren) => {
  return (
    <div
      className={css({
        display: 'grid',
        gap: tokenSchema.size.space.large,

        [containerQueries.above.mobile]: {
          gridTemplateColumns: '1fr 1fr',
        },
        [containerQueries.above.tablet]: {
          gridTemplateColumns: '1fr 1fr 1fr',
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
  let Link = useLinkComponent(null);

  return (
    <Flex
      position="relative"
      border="muted"
      borderRadius="medium"
      backgroundColor="canvas"
      padding="large"
    >
      <Flex direction="column" gap="regular" flex>
        <Heading elementType="h3" size="small" truncate>
          <Link
            href={props.href}
            className={css({
              color: tokenSchema.color.foreground.neutral,
              textDecoration: 'underline',
              textDecorationColor: 'transparent',
              textDecorationThickness: tokenSchema.size.border.regular,
              textUnderlineOffset: tokenSchema.size.border.medium,

              '&:hover': {
                color: tokenSchema.color.foreground.neutralEmphasis,
                textDecorationColor: tokenSchema.color.foreground.neutral,
              },

              // fill the available space so that the card is clickable
              '::before': {
                content: '""',
                position: 'absolute',
                inset: 0,
              },
            })}
          >
            {props.label}
          </Link>
        </Heading>
        {props.children}
      </Flex>
      {props.endElement}
    </Flex>
  );
};
