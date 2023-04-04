import { storiesOf } from '@voussoir/storybook';
import { Grid } from '@voussoir/layout';

import { Heading } from '../src';

storiesOf('Components/Typography/Heading', module)
  .add('default', () => (
    <Heading>The quick brown fox jumps over the lazy dog.</Heading>
  ))
  .add('align', () => (
    <Grid gap="xlarge" width={320}>
      <Heading align="start">Start</Heading>
      <Heading align="center">Center</Heading>
      <Heading align="end">End</Heading>
    </Grid>
  ))
  .add('size', () => (
    <Grid gap="xlarge">
      <Heading size="small">
        The quick brown fox jumps over the lazy dog.
      </Heading>
      <Heading size="regular">
        The quick brown fox jumps over the lazy dog.
      </Heading>
      <Heading size="medium">
        The quick brown fox jumps over the lazy dog.
      </Heading>
      <Heading size="large">
        The quick brown fox jumps over the lazy dog.
      </Heading>
    </Grid>
  ))
  .add('truncate', () => (
    <Grid gap="xlarge" width={320} maxWidth="100%">
      <Heading truncate>
        The quick brown fox jumps over the lazy dog. The five boxing wizards
        jump quickly. Pack my box with five dozen liquor jugs. How vexingly
        quick daft zebras jump!
      </Heading>
      <Heading truncate={3}>
        The quick brown fox jumps over the lazy dog. The five boxing wizards
        jump quickly. Pack my box with five dozen liquor jugs. How vexingly
        quick daft zebras jump!
      </Heading>
    </Grid>
  ))
  .add('element type', () => (
    <Heading elementType="span">
      This looks like a heading, but it's actually a span.
    </Heading>
  ));
