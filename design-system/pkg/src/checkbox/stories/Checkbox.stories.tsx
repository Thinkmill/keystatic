import { action, ArgTypes } from '@keystar/ui-storybook';

import { Grid } from '@keystar/ui/layout';
import { Text } from '@keystar/ui/typography';

import { Checkbox, CheckboxProps } from '..';

export default {
  title: 'Components/Checkbox',
};

export const Default = (args: ArgTypes) => render(args);

Default.args = {
  isSelected: false,
  isIndeterminate: false,
  isDisabled: false,
  isReadOnly: false,
};

export const States = () => renderStates();

export const AutoFocus = () => render({ autoFocus: true });

export const LongLabel = () => (
  <Checkbox onChange={action('change')} UNSAFE_style={{ width: 320 }}>
    Long checkbox label. Gingerbread brownie danish marshmallow tootsie roll
    caramels tiramisu cake candy canes.
  </Checkbox>
);

export const CustomLabel = () => renderCustomLabel();

export const NoLabel = () =>
  renderNoLabel({ 'aria-label': 'This checkbox has no visible label' });

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
