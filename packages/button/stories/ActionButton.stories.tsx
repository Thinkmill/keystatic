import { action, storiesOf } from '@voussoir/storybook';

import { plusCircleIcon } from '@voussoir/icon/icons/plusCircleIcon';
import { chevronRightIcon } from '@voussoir/icon/icons/chevronRightIcon';
import { Icon } from '@voussoir/icon';
import { Flex } from '@voussoir/layout';
import { Text } from '@voussoir/typography';

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
