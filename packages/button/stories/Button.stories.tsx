import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';

import { plusCircleIcon } from '@voussoir/icon/icons/plusCircleIcon';
import { chevronRightIcon } from '@voussoir/icon/icons/chevronRightIcon';
import { Icon } from '@voussoir/icon';
import { Flex } from '@voussoir/layout';
import { Text } from '@voussoir/typography';

import { Button, ButtonProps } from '../src';

storiesOf('Components/Button', module)
  .add('default', () => render())
  .add('icon', () => renderWithIcon())
  .add('tone', () => (
    <Flex direction="column" gap="regular">
      {render('Accent', { tone: 'accent' })}
      {render('Neutral', { tone: 'neutral' })}
      {render('Critical', { tone: 'critical' })}
      {renderWithIcon('Accent icon', { tone: 'accent' })}
      {renderWithIcon('Neutral icon', { tone: 'neutral' })}
      {renderWithIcon('Critical icon', { tone: 'critical' })}
    </Flex>
  ))
  .add('low prominence', () => (
    <Flex direction="column" gap="regular">
      {render('Accent', { prominence: 'low', tone: 'accent' })}
      {render('Neutral', { prominence: 'low', tone: 'neutral' })}
      {render('Critical', { prominence: 'low', tone: 'critical' })}
      {renderWithIcon('Accent icon', { prominence: 'low', tone: 'accent' })}
      {renderWithIcon('Neutral icon', { prominence: 'low', tone: 'neutral' })}
      {renderWithIcon('Critical icon', { prominence: 'low', tone: 'critical' })}
    </Flex>
  ))
  .add('high prominence', () => (
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
  ))
  .add('anchor', () => (
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
  ));

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
