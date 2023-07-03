import { action, ArgTypes } from '@keystar/ui-storybook';

import { Grid } from '@keystar/ui/layout';
import { Text } from '@keystar/ui/typography';

import { Switch, SwitchProps } from '..';

export default {
  title: 'Components/Switch',
};

export const Default = (args: ArgTypes) => render(args);

Default.args = {
  isSelected: false,
  isDisabled: false,
  isReadOnly: false,
};

export const States = () => renderStates();

States.story = {
  name: 'states',
};

export const ProminenceLow = () =>
  render({ prominence: 'low', defaultSelected: true });

ProminenceLow.story = {
  name: 'prominence: low',
};

export const SizeSmall = () => render({ size: 'small' });

SizeSmall.story = {
  name: 'size: small',
};

export const AutoFocus = () => render({ autoFocus: true });

AutoFocus.story = {
  name: 'auto focus',
};

export const LongLabel = () => (
  <Switch onChange={action('change')} UNSAFE_style={{ width: 320 }}>
    Long switch label. Gingerbread brownie danish marshmallow tootsie roll
    caramels tiramisu cake candy canes.
  </Switch>
);

LongLabel.story = {
  name: 'long label',
};

export const CustomLabel = () => renderCustomLabel();

CustomLabel.story = {
  name: 'custom label',
};

export const NoLabel = () =>
  renderNoLabel({ 'aria-label': 'This switch has no visible label' });

NoLabel.story = {
  name: 'no label',
};

function render(props: Partial<SwitchProps> = {}) {
  return (
    <Switch onChange={action('change')} {...props}>
      {props.children ?? 'Switch label'}
    </Switch>
  );
}

function renderStates() {
  return (
    <Grid gap="large" columns="repeat(2, 1fr)">
      {render({ isSelected: false, children: 'unchecked' })}
      {render({ isDisabled: true, children: 'unchecked (disabled)' })}

      {render({ isSelected: true, children: 'checked' })}
      {render({
        isSelected: true,
        isDisabled: true,
        children: 'checked (disabled)',
      })}
    </Grid>
  );
}

function renderCustomLabel(props = {}) {
  return (
    <Switch
      onChange={action('change')}
      UNSAFE_style={{ width: 320 }}
      {...props}
    >
      <Grid gap="large">
        <Text>Custom switch label text, with multiple paragraphs.</Text>
        <Text slot="description">
          Including <em>emphasis</em> and <strong>strong emphasis</strong>{' '}
          brownie danish marshmallow tootsie roll caramels tiramisu cake candy
          canes.
        </Text>
      </Grid>
    </Switch>
  );
}

function renderNoLabel(props = {}) {
  return <Switch onChange={action('change')} {...props} />;
}
