import { Box, Divider, Flex, Grid } from '@keystar/ui/layout';

import { Text } from '../text';

function getPangram() {
  const pangrams = [
    'The quick brown fox jumps over the lazy dog',
    'Jived fox nymph grabs quick waltz.',
    'Glib jocks quiz nymph to vex dwarf.',
    'Sphinx of black quartz, judge my vow.',
    'How vexingly quick daft zebras jump!',
    'The five boxing wizards jump quickly.',
    'Jackdaws love my big sphinx of quartz.',
    'Pack my box with five dozen liquor jugs.',
  ];

  return pangrams[Math.floor(Math.random() * pangrams.length)];
}

export default {
  title: 'Components/Typography/Text',
};

export const Default = () => <Text>{getPangram()}</Text>;

Default.story = {
  name: 'default',
};

export const Hidden = () => (
  <>
    <Text isHidden={{ below: 'desktop' }}>1. Hidden below desktop</Text>
    <Text isHidden={{ above: 'desktop' }}>2. Hidden above desktop</Text>
  </>
);

Hidden.story = {
  name: 'hidden',
};

export const Align = () => (
  <Grid gap="large">
    <Text align="start">Start</Text>
    <Text align="center">Center</Text>
    <Text align="end">End</Text>
    <Divider />
    <Text align="FORCE_left">Left (Ignore locale)</Text>
    <Text align="FORCE_right">Right (Ignore locale)</Text>
  </Grid>
);

Align.story = {
  name: 'align',
};

export const Casing = () => (
  <Grid gap="large">
    <Text casing="capitalize">
      <strong>Capitalize</strong> {getPangram()}
    </Text>
    <Text casing="lowercase">
      <strong>Lowercase</strong> {getPangram()}
    </Text>
    <Text casing="none">
      <strong>None (default)</strong> {getPangram()}
    </Text>
    <Text casing="uppercase">
      <strong>Uppercase</strong> {getPangram()}
    </Text>
  </Grid>
);

Casing.story = {
  name: 'casing',
};

export const Overflow = () => (
  <Flex direction="column" gap="medium" width="scale.2400">
    <Box border="neutral" padding="regular">
      <Text overflow="unset">
        <strong>Unset</strong> KeystoneVoussoirComponentLibrary {getPangram()}
      </Text>
    </Box>
    <Box border="neutral" padding="regular">
      <Text overflow="nowrap">
        <strong>Nowrap</strong> KeystoneVoussoirComponentLibrary {getPangram()}
      </Text>
    </Box>
    <Box border="neutral" padding="regular">
      <Text overflow="breakword">
        <strong>Breakword (default)</strong> KeystoneVoussoirComponentLibrary{' '}
        {getPangram()}
      </Text>
    </Box>
  </Flex>
);

Overflow.story = {
  name: 'overflow',
};

export const Size = () => (
  <Flex direction="column" gap="medium">
    <Text size="small">Small</Text>
    <Text size="regular">Regular (default)</Text>
    <Text size="medium">Medium</Text>
    <Text size="large">Large</Text>
  </Flex>
);

Size.story = {
  name: 'size',
};

export const Color = () => (
  <Flex direction="column" gap="medium">
    <Flex gap="small" wrap>
      <Text color="neutral">neutral (default)</Text>
      <Text color="neutralSecondary">muted</Text>
      <Text color="neutralEmphasis">emphasis</Text>
    </Flex>
    <Flex gap="small" wrap>
      <Text color="positive">positive</Text>
      <Text color="caution">caution</Text>
      <Text color="critical">critical</Text>
      <Text color="pending">pending</Text>
      <Text color="highlight">highlight</Text>
      <Text color="accent">accent</Text>
    </Flex>
  </Flex>
);

Color.story = {
  name: 'color',
};

export const Truncate = () => (
  <Grid gap="large" width="scale.3400" maxWidth="100%">
    <Text truncate>
      The quick brown fox jumps over the lazy dog. The five boxing wizards jump
      quickly. Pack my box with five dozen liquor jugs. How vexingly quick daft
      zebras jump!
    </Text>
    <Text truncate={3}>
      The quick brown fox jumps over the lazy dog. The five boxing wizards jump
      quickly. Pack my box with five dozen liquor jugs. How vexingly quick daft
      zebras jump!
    </Text>
  </Grid>
);

Truncate.story = {
  name: 'truncate',
};

export const Variant = () => (
  <Grid gap="large">
    <Text variant="diagonal-fractions">
      <strong>diagonal-fractions</strong> 1/2 1/3 1/4 2/3 3/4
    </Text>
    <Text variant="normal">
      <strong>normal</strong> 0123456789
    </Text>
    <Text variant="ordinal">
      <strong>ordinal</strong> 1st 2nd 3rd 4th 5th
    </Text>
    <Text variant="slashed-zero">
      <strong>slashed-zero</strong> 0
    </Text>
    <Text variant="tabular-nums">
      <strong>tabular-nums</strong> 0123456789
    </Text>
  </Grid>
);

Variant.story = {
  name: 'variant',
};

export const Weight = () => (
  <Flex direction="column" gap="medium">
    <Text weight="regular">Regular (default)</Text>
    <Text weight="medium">Medium</Text>
    <Text weight="bold">Bold</Text>
  </Flex>
);

Weight.story = {
  name: 'weight',
};
