import { action } from '@keystar/ui-storybook';
import { Box, Flex, Grid } from '@keystar/ui/layout';
import { Text } from '@keystar/ui/typography';
import { useState } from 'react';

import { Image } from '..';

let belowTheFoldId = 0;

export default {
  title: 'Components/Image',
};

export const Default = () => (
  <Image
    src="https://via.placeholder.com/600x400"
    alt=""
    aspectRatio="3/2"
    UNSAFE_style={{ width: 300 }}
  />
);

Default.story = {
  name: 'default',
};

export const Fit = () => (
  <Grid
    columns="repeat(2, 1fr)"
    gap="large"
    UNSAFE_style={{ width: 660 }}
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
);

Fit.story = {
  name: 'fit',
};

export const Children = () => (
  <Image
    alt=""
    src={`https://via.placeholder.com/300x200?text=Overlay+content`}
    aspectRatio="3/2"
    UNSAFE_style={{ width: 300 }}
  >
    <Flex alignItems="end" justifyContent="end">
      <Box padding="medium" backgroundColor="canvas">
        <Text>Overlay content</Text>
      </Box>
    </Flex>
  </Image>
);

Children.story = {
  name: 'children',
};

export const Loading = () => (
  <div>
    <p>
      Go to the Network tab in your browser's developer tools: disable cache and
      throttle your connection to see the difference between "eager" and "lazy"
      loading. You will need to remount the story.
    </p>
    <Box UNSAFE_style={{ width: 300 }}>
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
      Go to the story's Actions tab to see events, then scroll to reveal another
      lazily-loaded image.
    </p>
    <div style={{ height: 2560 }} />
    <Box UNSAFE_style={{ width: 300 }}>
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
);

Loading.story = {
  name: 'loading',
};

export const Error = () => {
  const [hasError, setError] = useState(false);
  return (
    <Box
      backgroundColor={hasError ? 'criticalEmphasis' : 'surfaceSecondary'}
      UNSAFE_style={{ width: 300 }}
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
};

Error.story = {
  name: 'error',
};
