import { useState } from 'react';
import { action, storiesOf, Parameters } from '@voussoir/storybook';
import { Grid } from '@voussoir/layout';

import { TextArea } from '../src';

storiesOf('Components/TextArea', module)
  .addParameters({
    args: {
      label: 'Label text',
      isDisabled: false,
      isReadOnly: false,
      isRequired: false,
    },
    argTypes: {},
  })
  .add('Default', render())
  .add('value: Test (controlled)', render({ value: 'Test' }))
  .add('defaultValue: Test (uncontrolled)', render({ defaultValue: 'Test' }))
  .add('autoFocus: true', render({ autoFocus: true }))
  .add(
    'no visible label',
    render({ label: null, 'aria-label': 'Hidden label' })
  )
  .add(
    'with description',
    render({
      description:
        'Description text provides information to assist the user in completing a field.',
    })
  )
  .add(
    'with error message',
    render({
      errorMessage:
        'Error messages inform the user when the input does not meet validation criteria.',
    })
  )
  .add(
    'with controlled interaction',
    renderControlled({ label: 'Controlled interaction' })
  )
  .add('custom height', (args: Parameters) => (
    <Grid columns="repeat(3, minmax(140px, 1fr))" gap="regular">
      <TextArea {...args} label="With label" height="scale.2000" />
      <TextArea
        {...args}
        label="With description"
        description="Description text."
        height="scale.2000"
      />
      <TextArea
        {...args}
        label="With error message"
        description="Description text."
        errorMessage="Error message text."
        height="scale.2000"
      />
    </Grid>
  ))
  .add(
    'custom width',
    render({
      paddingX: 'regular',
      width: 'size.container.small',
      maxWidth: '100%',
      description:
        'Description text provides information to assist the user in completing a field.',
      errorMessage:
        'Error messages inform the user when the input does not meet validation criteria.',
    })
  );

function render(props = {}) {
  return function renderWithArgs(args: Parameters) {
    return (
      <TextArea
        {...args}
        {...props}
        onChange={action('change')}
        onFocus={action('focus')}
        onBlur={action('blur')}
        UNSAFE_className="custom-class-name"
      />
    );
  };
}

function renderControlled(props = {}) {
  function Example(args: Parameters) {
    let [value, setValue] = useState('');
    let paragraph =
      'A voussoir is a wedge-shaped element, typically a stone, which is used in building an arch or vault.';

    return (
      <>
        <TextArea
          {...props}
          {...args}
          width="scale.3000"
          onChange={setValue}
          value={value}
        />
        <button onClick={() => setValue(paragraph)} type="button">
          Set Text
        </button>
      </>
    );
  }
  return function renderWithArgs(args: Parameters) {
    return <Example {...args} />;
  };
}
