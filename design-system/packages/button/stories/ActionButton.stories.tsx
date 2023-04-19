import { action, storiesOf } from '@keystar-ui/storybook';

import { plusCircleIcon } from '@keystar-ui/icon/icons/plusCircleIcon';
import { chevronRightIcon } from '@keystar-ui/icon/icons/chevronRightIcon';
import { Icon } from '@keystar-ui/icon';
import { Flex } from '@keystar-ui/layout';
import { Text } from '@keystar-ui/typography';

import { ActionButton, ActionButtonProps } from '../src';

storiesOf('Components/Button/ActionButton', module)
  .add('default', () => render())
  .add('icon', () => renderWithIcon())
  .add('icon only', () => renderWithIconOnly())
  .add('low prominence', () => (
    <Flex direction="column" gap="regular">
      {render('Neutral', { prominence: 'low' })}
      {renderWithIcon('Neutral icon', { prominence: 'low' })}
      {renderWithIconOnly('Neutral icon only', { prominence: 'low' })}
    </Flex>
  ))
  .add('static: light', () => (
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
  ))
  .add('static: dark', () => (
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
  ));

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
