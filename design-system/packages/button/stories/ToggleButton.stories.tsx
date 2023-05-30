import { action, storiesOf } from '@voussoir/storybook';

import { plusCircleIcon } from '@voussoir/icon/icons/plusCircleIcon';
import { chevronRightIcon } from '@voussoir/icon/icons/chevronRightIcon';
import { Icon } from '@voussoir/icon';
import { Flex } from '@voussoir/layout';
import { Text } from '@voussoir/typography';
import { useState } from 'react';

import { ToggleButton, ToggleButtonProps } from '../src';

storiesOf('Components/Button/ToggleButton', module)
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
  .add('controlled', () => {
    let [selected, setSelected] = useState(false);
    return (
      <div>
        <ToggleButton isSelected={selected} onChange={setSelected}>
          Press Me
        </ToggleButton>
        <br />
        {selected ? 'true' : 'false'}
      </div>
    );
  });

function render(label = 'Default', props: ToggleButtonProps = {}) {
  return (
    <Flex gap="regular">
      <ToggleButton
        onPress={action('press')}
        onPressStart={action('pressstart')}
        onPressEnd={action('pressend')}
        {...props}
      >
        {label}
      </ToggleButton>
      <ToggleButton
        onPress={action('press')}
        onPressStart={action('pressstart')}
        onPressEnd={action('pressend')}
        isDisabled
        {...props}
      >
        {label} (disabled)
      </ToggleButton>
    </Flex>
  );
}
function renderWithIcon(label = 'Default', props: ToggleButtonProps = {}) {
  return (
    <Flex gap="regular">
      <ToggleButton
        onPress={action('press')}
        onPressStart={action('pressstart')}
        onPressEnd={action('pressend')}
        {...props}
      >
        <Icon src={plusCircleIcon} />
        <Text>{label}</Text>
      </ToggleButton>
      <ToggleButton
        onPress={action('press')}
        onPressStart={action('pressstart')}
        onPressEnd={action('pressend')}
        isDisabled
        {...props}
      >
        <Text>{label} (disabled)</Text>
        <Icon src={chevronRightIcon} />
      </ToggleButton>
    </Flex>
  );
}
function renderWithIconOnly(label = 'Default', props: ToggleButtonProps = {}) {
  return (
    <Flex gap="regular">
      <ToggleButton
        aria-label={label}
        onPress={action('press')}
        onPressStart={action('pressstart')}
        onPressEnd={action('pressend')}
        {...props}
      >
        <Icon src={plusCircleIcon} />
      </ToggleButton>
      <ToggleButton
        aria-label={`${label} (disabled)`}
        onPress={action('press')}
        onPressStart={action('pressstart')}
        onPressEnd={action('pressend')}
        isDisabled
        {...props}
      >
        <Icon src={chevronRightIcon} />
      </ToggleButton>
    </Flex>
  );
}
