import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import { Box, Flex, Grid, repeat } from '@voussoir/layout';
import { Text } from '@voussoir/typography';
import { useState } from 'react';

import { Image } from '../src';

let belowTheFoldId = 0;

storiesOf('Components/Image', module)
  .add('default', () => (
    <Image
      src="https://via.placeholder.com/600x400"
      alt=""
      aspectRatio="3/2"
      width={300}
    />
  ))
  .add('fit', () => (
    <Grid
      columns={repeat(2, '1fr')}
      gap="large"
      width="size.container.small"
      maxWidth="100%"
    >
      <Image
        alt=""
        src="https://via.placeholder.com/600x400?text=cover+landscape"
        fit="cover"
        aspectRatio="1"
      />
      <Image
        alt=""
        src="https://via.placeholder.com/600x400?text=contain+landscape"
        fit="contain"
        aspectRatio="1"
      />
      <Image
        alt=""
        src="https://via.placeholder.com/400x600?text=cover+portrait"
        fit="cover"
        aspectRatio="1"
      />
      <Image
        alt=""
        src="https://via.placeholder.com/400x600?text=contain+portrait"
        fit="contain"
        aspectRatio="1"
      />
    </Grid>
  ))
  .add('children', () => (
    <Image
      alt=""
      src={`https://via.placeholder.com/300x200?text=Overlay+content`}
      aspectRatio="3/2"
      width={300}
    >
      <Flex alignItems="end" justifyContent="end">
        <Box padding="medium" backgroundColor="canvas">
          <Text>Overlay content</Text>
        </Box>
      </Flex>
    </Image>
  ))
  .add('loading', () => (
    <div>
      <p>
        Go to the Network tab in your browser's developer tools: disable cache
        and throttle your connection to see the difference between "eager" and
        "lazy" loading. You will need to remount the story.
      </p>
      <Box width={300}>
        <Image
          alt=""
          src={`https://via.placeholder.com/300x200?text=Above+the+fold`}
          onLoad={action('onLoad')}
          onError={action('onError')}
          loading="lazy"
          aspectRatio="300 /200"
        />
      </Box>
      <p>Content unaffected by reflow.</p>
      <p>
        Go to the story's Actions tab to see events, then scroll to reveal
        another lazily-loaded image.
      </p>
      <div style={{ height: 2560 }} />
      <Box width={300}>
        <Image
          alt=""
          src={`https://via.placeholder.com/300x200?text=Below+the+fold&${++belowTheFoldId}`}
          onLoad={action('onLoad')}
          onError={action('onError')}
          loading="lazy"
          aspectRatio="300 / 200"
        />
      </Box>
      <p>Text below the image.</p>
    </div>
  ))
  .add('error', () => {
    const [hasError, setError] = useState(false);
    return (
      <Box
        backgroundColor={hasError ? 'criticalEmphasis' : 'surfaceSecondary'}
        width={300}
      >
        <Image
          aspectRatio="300 / 200"
          alt=""
          src="invalid src"
          onLoad={action('onLoad')}
          onError={(...args) => {
            setError(true);
            action('onError')(...args);
          }}
        />
      </Box>
    );
  });
