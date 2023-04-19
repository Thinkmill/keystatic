import { action, storiesOf } from '@keystar-ui/storybook';

import { Grid } from '@keystar-ui/layout';
import { Heading, Text } from '@keystar-ui/typography';

import { TextLink, TextLinkProps } from '../src';

storiesOf('Components/TextLink', module)
  .add('default', () => render())
  .add('with href', () => render({ href: '#' }))
  .add('prominence', () => (
    <Grid gap="large">
      {render({ prominence: 'high' })}
      {render({ prominence: 'default' })}
    </Grid>
  ))
  .add('on background', () => (
    <Grid gap="large" backgroundColor="accentEmphasis" padding="large">
      {render({ prominence: 'high' })}
      {render({ prominence: 'default' })}
    </Grid>
  ))
  .add('truncate', () => (
    <Grid gap="large" maxWidth="100%" UNSAFE_style={{ width: 280 }}>
      <Text truncate>
        <TextLink>
          The quick brown fox jumps over the lazy dog. The five boxing wizards
          jump quickly. Pack my box with five dozen liquor jugs. How vexingly
          quick daft zebras jump!
        </TextLink>
      </Text>
      <Text truncate={3}>
        <TextLink>
          The quick brown fox jumps over the lazy dog. The five boxing wizards
          jump quickly. Pack my box with five dozen liquor jugs. How vexingly
          quick daft zebras jump!
        </TextLink>
      </Text>
    </Grid>
  ))
  .add('inheritance: text', () => (
    <Grid gap="medium">
      <Text size="small">
        The <TextLink>quick brown fox</TextLink> jumps over the lazy dog.
      </Text>
      <Text size="regular">
        The <TextLink>quick brown fox</TextLink> jumps over the lazy dog.
      </Text>
      <Text size="medium">
        The <TextLink>quick brown fox</TextLink> jumps over the lazy dog.
      </Text>
      <Text size="large">
        The <TextLink>quick brown fox</TextLink> jumps over the lazy dog.
      </Text>
    </Grid>
  ))
  .add('inheritance: heading', () => (
    <Grid gap="xlarge">
      <Heading size="small">
        The <TextLink>quick brown fox</TextLink> jumps over the lazy dog.
      </Heading>
      <Heading size="regular">
        The <TextLink>quick brown fox</TextLink> jumps over the lazy dog.
      </Heading>
      <Heading size="medium">
        The <TextLink>quick brown fox</TextLink> jumps over the lazy dog.
      </Heading>
      <Heading size="large">
        The <TextLink>quick brown fox</TextLink> jumps over the lazy dog.
      </Heading>
    </Grid>
  ))
  .add('navigate', () =>
    render({
      children: 'Link to example URL, within frame',
      href: '//example.com',
      rel: 'noreferrer noopener',
      target: '_self',
    })
  );

function render(props: Partial<TextLinkProps> = {}) {
  props.children =
    props.children || 'The quick brown fox jumps over the lazy dog.';
  return (
    <TextLink
      onPress={action('press')}
      onPressStart={action('pressStart')}
      onPressEnd={action('pressEnd')}
      {...props}
    />
  );
}
