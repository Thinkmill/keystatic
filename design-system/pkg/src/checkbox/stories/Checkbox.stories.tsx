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
export const LowProminence = () =>
  renderStates({
    prominence: 'low',
  });

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

function renderStates(props: Partial<CheckboxProps> = {}) {
  return (
    <Grid gap="large" columns="repeat(2, 1fr)">
      {render(props)}
      {render({ isDisabled: true, ...props })}

      {render({ isSelected: true, ...props })}
      {render({ isSelected: true, isDisabled: true, ...props })}

      {render({ isIndeterminate: true, ...props })}
      {render({ isIndeterminate: true, isDisabled: true, ...props })}
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
