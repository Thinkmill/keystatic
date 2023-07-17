import { action } from '@keystar/ui-storybook';

import { plusCircleIcon } from '@keystar/ui/icon/icons/plusCircleIcon';
import { chevronRightIcon } from '@keystar/ui/icon/icons/chevronRightIcon';
import { Icon } from '@keystar/ui/icon';
import { Flex } from '@keystar/ui/layout';
import { Text } from '@keystar/ui/typography';

import { ActionButton, ActionButtonProps } from '..';

export default {
  title: 'Components/Button/ActionButton',
};

export const Default = () => render();

Default.story = {
  name: 'default',
};

export const _Icon = () => renderWithIcon();

_Icon.story = {
  name: 'icon',
};

export const IconOnly = () => renderWithIconOnly();

IconOnly.story = {
  name: 'icon only',
};

export const LowProminence = () => (
  <Flex direction="column" gap="regular">
    {render('Neutral', { prominence: 'low' })}
    {renderWithIcon('Neutral icon', { prominence: 'low' })}
    {renderWithIconOnly('Neutral icon only', { prominence: 'low' })}
  </Flex>
);

LowProminence.story = {
  name: 'low prominence',
};

export const StaticLight = () => (
  <Flex
    direction="column"
    gap="regular"
    backgroundColor="accentEmphasis"
    padding="large"
  >
    {render('Default', { prominence: 'default', static: 'light' })}
    {render('Low', { prominence: 'low', static: 'light' })}
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
  >
    {render('Default', { prominence: 'default', static: 'dark' })}
    {render('Low', { prominence: 'low', static: 'dark' })}
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
      <ActionButton href="https://example.com">Anchor</ActionButton>
      <ActionButton isDisabled href="https://example.com">
        Anchor
      </ActionButton>
    </Flex>
    <Flex gap="regular">
      <ActionButton prominence="low" href="https://example.com">
        Anchor
      </ActionButton>
      <ActionButton prominence="low" isDisabled href="https://example.com">
        Anchor
      </ActionButton>
    </Flex>
  </Flex>
);

Anchor.story = {
  name: 'anchor',
};

function render(label = 'Default', props: ActionButtonProps = {}) {
  return (
    <Flex gap="regular">
      <ActionButton
        onPress={action('press')}
        onPressStart={action('pressstart')}
        onPressEnd={action('pressend')}
        {...props}
      >
        {label}
      </ActionButton>
      <ActionButton
        onPress={action('press')}
        onPressStart={action('pressstart')}
        onPressEnd={action('pressend')}
        isDisabled
        {...props}
      >
        {label} (disabled)
      </ActionButton>
    </Flex>
  );
}
function renderWithIcon(label = 'Default', props: ActionButtonProps = {}) {
  return (
    <Flex gap="regular">
      <ActionButton
        onPress={action('press')}
        onPressStart={action('pressstart')}
        onPressEnd={action('pressend')}
        {...props}
      >
        <Icon src={plusCircleIcon} />
        <Text>{label}</Text>
      </ActionButton>
      <ActionButton
        onPress={action('press')}
        onPressStart={action('pressstart')}
        onPressEnd={action('pressend')}
        isDisabled
        {...props}
      >
        <Text>{label} (disabled)</Text>
        <Icon src={chevronRightIcon} />
      </ActionButton>
    </Flex>
  );
}
function renderWithIconOnly(label = 'Default', props: ActionButtonProps = {}) {
  return (
    <Flex gap="regular">
      <ActionButton
        aria-label={label}
        onPress={action('press')}
        onPressStart={action('pressstart')}
        onPressEnd={action('pressend')}
        {...props}
      >
        <Icon src={plusCircleIcon} />
      </ActionButton>
      <ActionButton
        aria-label={`${label} (disabled)`}
        onPress={action('press')}
        onPressStart={action('pressstart')}
        onPressEnd={action('pressend')}
        isDisabled
        {...props}
      >
        <Icon src={chevronRightIcon} />
      </ActionButton>
    </Flex>
  );
}
