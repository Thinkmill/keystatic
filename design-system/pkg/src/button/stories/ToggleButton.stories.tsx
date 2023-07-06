import { action } from '@keystar/ui-storybook';

import { plusCircleIcon } from '@keystar/ui/icon/icons/plusCircleIcon';
import { chevronRightIcon } from '@keystar/ui/icon/icons/chevronRightIcon';
import { Icon } from '@keystar/ui/icon';
import { Flex } from '@keystar/ui/layout';
import { Text } from '@keystar/ui/typography';
import { useState } from 'react';

import { ToggleButton, ToggleButtonProps } from '..';

export default {
  title: 'Components/Button/ToggleButton',
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

export const Controlled = () => {
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
};

Controlled.story = {
  name: 'controlled',
};

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
