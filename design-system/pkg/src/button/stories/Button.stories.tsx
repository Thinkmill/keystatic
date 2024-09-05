import { useState } from 'react';
import { action } from '@keystar/ui-storybook';

import { plusCircleIcon } from '@keystar/ui/icon/icons/plusCircleIcon';
import { chevronRightIcon } from '@keystar/ui/icon/icons/chevronRightIcon';
import { Icon } from '@keystar/ui/icon';
import { Flex } from '@keystar/ui/layout';
import { Text } from '@keystar/ui/typography';

import { Button, ButtonProps } from '..';

export default {
  title: 'Components/Button',
};

export const Default = () => render();

Default.story = {
  name: 'default',
};

export const _Icon = () => renderWithIcon();

_Icon.story = {
  name: 'icon',
};

export const Tone = () => (
  <Flex direction="column" gap="regular">
    {render('Accent', { tone: 'accent' })}
    {render('Neutral', { tone: 'neutral' })}
    {render('Critical', { tone: 'critical' })}
    {renderWithIcon('Accent icon', { tone: 'accent' })}
    {renderWithIcon('Neutral icon', { tone: 'neutral' })}
    {renderWithIcon('Critical icon', { tone: 'critical' })}
  </Flex>
);

Tone.story = {
  name: 'tone',
};

export const ProminenceLow = () => (
  <Flex direction="column" gap="regular">
    {render('Accent', { prominence: 'low', tone: 'accent' })}
    {render('Neutral', { prominence: 'low', tone: 'neutral' })}
    {render('Critical', { prominence: 'low', tone: 'critical' })}
    {renderWithIcon('Accent icon', { prominence: 'low', tone: 'accent' })}
    {renderWithIcon('Neutral icon', { prominence: 'low', tone: 'neutral' })}
    {renderWithIcon('Critical icon', { prominence: 'low', tone: 'critical' })}
  </Flex>
);

ProminenceLow.story = {
  name: 'prominence: low',
};

export const ProminenceHigh = () => (
  <Flex direction="column" gap="regular">
    {render('Neutral', { prominence: 'high', tone: 'neutral' })}
    {render('Accent', { prominence: 'high', tone: 'accent' })}
    {render('Critical', { prominence: 'high', tone: 'critical' })}
    {renderWithIcon('Neutral icon', { prominence: 'high', tone: 'neutral' })}
    {renderWithIcon('Accent icon', { prominence: 'high', tone: 'accent' })}
    {renderWithIcon('Critical icon', {
      prominence: 'high',
      tone: 'critical',
    })}
  </Flex>
);

ProminenceHigh.story = {
  name: 'prominence: high',
};

export const StaticLight = () => (
  <Flex
    direction="column"
    gap="regular"
    padding="large"
    UNSAFE_style={{ backgroundColor: '#111' }}
  >
    {render('High', { prominence: 'high', static: 'light' })}
    {render('Default', { prominence: 'default', static: 'light' })}
    {render('Low', { prominence: 'low', static: 'light' })}
    {renderWithIcon('High icon', { prominence: 'high', static: 'light' })}
    {renderWithIcon('Default icon', {
      prominence: 'default',
      static: 'light',
    })}
    {renderWithIcon('Low icon', { prominence: 'low', static: 'light' })}
  </Flex>
);

StaticLight.story = {
  name: 'static: light',
};

export const StaticDark = () => (
  <Flex
    direction="column"
    gap="regular"
    backgroundColor="accent"
    padding="large"
    UNSAFE_style={{ backgroundColor: '#eee' }}
  >
    {render('High', { prominence: 'high', static: 'dark' })}
    {render('Default', { prominence: 'default', static: 'dark' })}
    {render('Low', { prominence: 'low', static: 'dark' })}
    {renderWithIcon('High icon', { prominence: 'high', static: 'dark' })}
    {renderWithIcon('Default icon', {
      prominence: 'default',
      static: 'dark',
    })}
    {renderWithIcon('Low icon', { prominence: 'low', static: 'dark' })}
  </Flex>
);

StaticDark.story = {
  name: 'static: dark',
};

export const Anchor = () => (
  <Flex direction="column" gap="regular">
    <Flex gap="regular">
      <Button href="https://example.com">Anchor</Button>
      <Button isDisabled href="https://example.com">
        Anchor
      </Button>
    </Flex>
    <Flex gap="regular">
      <Button prominence="low" href="https://example.com">
        Anchor
      </Button>
      <Button prominence="low" isDisabled href="https://example.com">
        Anchor
      </Button>
    </Flex>
    <Flex gap="regular">
      <Button prominence="high" href="https://example.com">
        Anchor
      </Button>
      <Button prominence="high" isDisabled href="https://example.com">
        Anchor
      </Button>
    </Flex>
  </Flex>
);

Anchor.story = {
  name: 'anchor',
};

export const Pending = () => {
  return (
    <Flex direction="column" gap="regular" alignItems="start">
      <SimulatedPendingButton>Default</SimulatedPendingButton>
      <SimulatedPendingButton prominence="low">
        Low prominence
      </SimulatedPendingButton>
      <SimulatedPendingButton prominence="high">
        High prominence
      </SimulatedPendingButton>
      <form
        onSubmit={e => {
          e.preventDefault();
          action('submit')(e);
        }}
      >
        <SimulatedPendingButton type="submit">Submit</SimulatedPendingButton>
      </form>
    </Flex>
  );
};

function SimulatedPendingButton(props: any) {
  let [isPending, setPending] = useState(false);

  let handlePress = (e: any) => {
    action('press')(e);
    setPending(true);
    setTimeout(() => {
      setPending(false);
    }, 5000);
  };

  return <Button {...props} isPending={isPending} onPress={handlePress} />;
}

function render(label = 'Default', props: ButtonProps = {}) {
  return (
    <Flex gap="regular">
      <Button
        onPress={action('press')}
        onPressStart={action('pressstart')}
        onPressEnd={action('pressend')}
        {...props}
      >
        {label}
      </Button>
      <Button
        onPress={action('press')}
        onPressStart={action('pressstart')}
        onPressEnd={action('pressend')}
        isDisabled
        {...props}
      >
        {label} (disabled)
      </Button>
    </Flex>
  );
}
function renderWithIcon(label = 'Default', props: ButtonProps = {}) {
  return (
    <Flex gap="regular">
      <Button
        onPress={action('press')}
        onPressStart={action('pressstart')}
        onPressEnd={action('pressend')}
        {...props}
      >
        <Icon src={plusCircleIcon} />
        <Text>{label}</Text>
      </Button>
      <Button
        onPress={action('press')}
        onPressStart={action('pressstart')}
        onPressEnd={action('pressend')}
        isDisabled
        {...props}
      >
        <Text>{label} (disabled)</Text>
        <Icon src={chevronRightIcon} />
      </Button>
    </Flex>
  );
}
