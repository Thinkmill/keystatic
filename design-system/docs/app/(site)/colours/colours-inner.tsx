'use client';
import { infoIcon } from '@keystar/ui/icon/icons/infoIcon';
import { Icon } from '@keystar/ui/icon';
import { Box, BoxProps, Grid, Flex, repeat } from '@keystar/ui/layout';
import { ColorForeground, tokenSchema } from '@keystar/ui/style';
import { Heading, Text } from '@keystar/ui/typography';

import { DocsContent } from '../../../components/content';

import type { JSX } from 'react';

export function Colours(): JSX.Element {
  const colors = [
    {
      id: 'backgroundColor',
      colors: tokenSchema.color.background,
      items: [],
      level: 2,
      slug: 'backgroundColor',
      title: 'Background',
    },
    {
      id: 'border',
      colors: tokenSchema.color.border,
      items: [],
      level: 2,
      slug: 'border',
      title: 'Border',
    },
    {
      id: 'text',
      colors: tokenSchema.color.foreground,
      items: [],
      level: 2,
      slug: 'text',
      title: 'Foreground',
    },
  ];

  return (
    <DocsContent>
      {colors.map(({ colors, id, title }) => (
        <Flex direction="column" key={id} gap="xlarge">
          <Heading id={id} size="medium">
            {title}
          </Heading>
          <Grid
            columns={{
              mobile: repeat(2, '1fr'),
              tablet: repeat(3, '1fr'),
              desktop: repeat(4, '1fr'),
            }}
            rowGap="large"
            columnGap="regular"
          >
            {Object.keys(colors).map(key => {
              const swatchProps = { [id]: key };
              const textTone = id === 'text' ? key : undefined;
              return (
                <Flex
                  direction="column"
                  gap="regular"
                  key={key}
                  paddingBottom="xsmall"
                >
                  <Swatch {...swatchProps}>
                    <Flex gap="regular" alignItems="center">
                      <Text
                        size="large"
                        weight="bold"
                        color={textTone as ColorForeground}
                      >
                        Aa
                      </Text>
                      {id === 'text' && (
                        <Icon
                          src={infoIcon}
                          color={textTone as ColorForeground}
                        />
                      )}
                    </Flex>
                  </Swatch>
                  <Text size="small" weight="medium" truncate>
                    {key}
                  </Text>
                </Flex>
              );
            })}
          </Grid>
        </Flex>
      ))}
    </DocsContent>
  );
}

function Swatch({ backgroundColor = 'surface', ...props }: BoxProps) {
  return (
    <Box
      borderRadius="small"
      height="element.large"
      padding="regular"
      backgroundColor={backgroundColor}
      {...props}
    />
  );
}
