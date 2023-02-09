import { Meta } from '@storybook/react';

import { Box, Divider, Flex, Grid } from '@voussoir/layout';
import { tokenSchema } from '@voussoir/style';
import { Heading, Text } from '@voussoir/typography';

export default {
  title: 'Patterns / Tokens',
  layout: 'fullscreen',
} as Meta;

// =============================================================================
// COLOR
// =============================================================================

export const ColorTokens = () => {
  return (
    <Flex
      backgroundColor="surface"
      direction="column"
      padding="xlarge"
      gap="xlarge"
      minHeight="100vh"
      width="100vw"
      alignItems="center"
    >
      {Object.entries(tokenSchema.color).map(([sectionKey, sectionValue]) => {
        return (
          <Flex
            direction="column"
            gap="large"
            key={sectionKey}
            width="size.container.small"
            maxWidth="100%"
          >
            <Heading size="medium">{sectionKey}</Heading>
            <Grid
              // columns={{
              //   tablet: 'repeat(3, 1fr)',
              //   desktop: 'repeat(4, 1fr)',
              //   wide: 'repeat(5, 1fr)',
              // }}
              backgroundColor="canvas"
              borderRadius="regular"
              boxShadow="small regular"
              // gap="large"
            >
              {Object.entries(sectionValue).map(([key, value], index) => {
                return (
                  <>
                    {!!index && <Divider />}
                    <Flex
                      alignItems="center"
                      key={key}
                      gap="medium"
                      overflow="hidden"
                      padding="medium"
                    >
                      <Box
                        borderRadius="small"
                        height="regular"
                        width="regular"
                        UNSAFE_style={{
                          backgroundColor: value,
                          boxShadow: 'inset 0 0 0 1px rgba(0, 0, 0, 0.1)',
                        }}
                      />
                      <Text weight="bold">
                        {sectionKey}.{key}
                      </Text>
                      <Text color="neutralSecondary">{value}</Text>
                    </Flex>
                  </>
                );
              })}
            </Grid>
          </Flex>
        );
      })}
    </Flex>
  );
};

// =============================================================================
// SIZE
// =============================================================================

export const SizeTokens = () => {
  return (
    <Flex
      backgroundColor="surface"
      direction="column"
      padding="xlarge"
      gap="xlarge"
      minHeight="100vh"
      width="100vw"
    >
      {Object.entries(tokenSchema.size).map(([sectionKey, sectionValue]) => {
        return (
          <Flex
            direction="column"
            gap="large"
            key={sectionKey}
            // width="size.container.small"
            maxWidth="100%"
          >
            <Heading size="medium">{sectionKey}</Heading>
            <Grid
              // columns={{
              //   tablet: 'repeat(3, 1fr)',
              //   desktop: 'repeat(4, 1fr)',
              //   wide: 'repeat(5, 1fr)',
              // }}
              backgroundColor="canvas"
              borderRadius="regular"
              boxShadow="small regular"
              // gap="large"
            >
              {Object.entries(sectionValue).map(([key, value], index) => {
                return (
                  <>
                    {!!index && <Divider />}
                    <Flex
                      alignItems="center"
                      key={key}
                      gap="medium"
                      overflow="hidden"
                      padding="medium"
                    >
                      <Box
                        backgroundColor="accentEmphasis"
                        height="small"
                        width="regular"
                        UNSAFE_style={{
                          width: value,
                        }}
                      />
                      <Text weight="bold">
                        {sectionKey}.{key}
                      </Text>
                      {/* <Text color="neutralSecondary">{value}</Text> */}
                    </Flex>
                  </>
                );
              })}
            </Grid>
          </Flex>
        );
      })}
    </Flex>
  );
};
