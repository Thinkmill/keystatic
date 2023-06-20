import { action, ArgTypes } from '@voussoir/storybook';

import { Grid } from '@voussoir/layout';
import { Text } from '@voussoir/typography';

import { Checkbox, CheckboxProps } from '../src';

export default {
  title: 'Components/Checkbox',
};

export const Default = (args: ArgTypes) => render(args);

Default.story = {
  parameters: {
    argTypes: {
      isSelected: { control: 'boolean' },
      isIndeterminate: { control: 'boolean' },
      isDisabled: { control: 'boolean' },
      isReadOnly: { control: 'boolean' },
    },
  },
};

export const States = () => renderStates();

States.story = {
  name: 'states',
};

export const AutoFocus = () => render({ autoFocus: true });

AutoFocus.story = {
  name: 'auto focus',
};

export const LongLabel = () => (
  <Checkbox onChange={action('change')} UNSAFE_style={{ width: 320 }}>
    Long checkbox label. Gingerbread brownie danish marshmallow tootsie roll
    caramels tiramisu cake candy canes.
  </Checkbox>
);

LongLabel.story = {
  name: 'long label',
};

export const CustomLabel = () => renderCustomLabel();

CustomLabel.story = {
  name: 'custom label',
};

export const NoLabel = () =>
  renderNoLabel({ 'aria-label': 'This checkbox has no visible label' });

NoLabel.story = {
  name: 'no label',
};

function render(props: Partial<CheckboxProps> = {}) {
  return (
    <Checkbox onChange={action('change')} {...props}>
      {props.children ?? 'Checkbox label'}
    </Checkbox>
  );
}

function renderStates() {
  return (
    <Grid gap="large" columns="repeat(2, 1fr)">
      {render()}
      {render({ isDisabled: true })}

      {render({ isSelected: true })}
      {render({ isSelected: true, isDisabled: true })}

      {render({ isIndeterminate: true })}
      {render({ isIndeterminate: true, isDisabled: true })}
    </Grid>
  );
}

function renderCustomLabel(props = {}) {
  return (
    <Checkbox
      onChange={action('change')}
      UNSAFE_style={{ width: 320 }}
      {...props}
    >
      <Grid gap="large">
        <Text>Custom checkbox label text, with multiple paragraphs.</Text>
        <Text>
          Including <em>emphasis</em> and <strong>strong emphasis</strong>{' '}
          brownie danish marshmallow tootsie roll caramels tiramisu cake candy
          canes.
        </Text>
      </Grid>
    </Checkbox>
  );
}

function renderNoLabel(props = {}) {
  return <Checkbox onChange={action('change')} {...props} />;
}
