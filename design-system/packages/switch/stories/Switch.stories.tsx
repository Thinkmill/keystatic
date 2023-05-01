import { action, ArgTypes, storiesOf } from '@voussoir/storybook';

import { Grid } from '@voussoir/layout';
import { Text } from '@voussoir/typography';

import { Switch, SwitchProps } from '../src';

storiesOf('Components/Switch', module)
  .add('Default', (args: ArgTypes) => render(args), {
    argTypes: {
      isSelected: { control: 'boolean' },
      isIndeterminate: { control: 'boolean' },
      isDisabled: { control: 'boolean' },
      isReadOnly: { control: 'boolean' },
    },
  })
  .add('states', () => renderStates())
  .add('prominence: low', () =>
    render({ prominence: 'low', defaultSelected: true })
  )
  .add('size: small', () => render({ size: 'small' }))
  .add('auto focus', () => render({ autoFocus: true }))
  .add('long label', () => (
    <Switch onChange={action('change')} UNSAFE_style={{ width: 320 }}>
      Long switch label. Gingerbread brownie danish marshmallow tootsie roll
      caramels tiramisu cake candy canes.
    </Switch>
  ))
  .add('custom label', () => renderCustomLabel())
  .add('no label', () =>
    renderNoLabel({ 'aria-label': 'This switch has no visible label' })
  );

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
