import { Grid } from '@keystar/ui/layout';

import { Heading } from '..';

export default {
  title: 'Components/Typography/Heading',
};

export const Default = () => (
  <Heading>The quick brown fox jumps over the lazy dog.</Heading>
);

Default.story = {
  name: 'default',
};

export const Align = () => (
  <Grid gap="xlarge" width="scale.3600">
    <Heading align="start">Start</Heading>
    <Heading align="center">Center</Heading>
    <Heading align="end">End</Heading>
  </Grid>
);

Align.story = {
  name: 'align',
};

export const Size = () => (
  <Grid gap="xlarge">
    <Heading size="small">The quick brown fox jumps over the lazy dog.</Heading>
    <Heading size="regular">
      The quick brown fox jumps over the lazy dog.
    </Heading>
    <Heading size="medium">
      The quick brown fox jumps over the lazy dog.
    </Heading>
    <Heading size="large">The quick brown fox jumps over the lazy dog.</Heading>
  </Grid>
);

Size.story = {
  name: 'size',
};

export const Truncate = () => (
  <Grid gap="xlarge" width="scale.3600" maxWidth="100%">
    <Heading truncate>
      The quick brown fox jumps over the lazy dog. The five boxing wizards jump
      quickly. Pack my box with five dozen liquor jugs. How vexingly quick daft
      zebras jump!
    </Heading>
    <Heading truncate={3}>
      The quick brown fox jumps over the lazy dog. The five boxing wizards jump
      quickly. Pack my box with five dozen liquor jugs. How vexingly quick daft
      zebras jump!
    </Heading>
  </Grid>
);

Truncate.story = {
  name: 'truncate',
};

export const ElementType = () => (
  <Heading elementType="span">
    This looks like a heading, but it's actually a span.
  </Heading>
);

ElementType.story = {
  name: 'element type',
};
