import { action } from '@storybook/addon-actions';
import { storiesOf, Parameters } from '@storybook/react';
import { useMemo, useState } from 'react';

import { SearchField } from '../src';

storiesOf('Components/SearchField', module)
  .addParameters({
    args: {
      label: 'Search',
      isDisabled: false,
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
  .add('no icon', render({ showIcon: false }))
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
  .add('with validation', renderWithValidation())
  .add(
    'custom width',
    render({
      width: 240,
      description:
        'Description text provides information to assist the user in completing a field.',
      errorMessage:
        'Error messages inform the user when the input does not meet validation criteria.',
    })
  );

function render(props = {}) {
  return function renderWithArgs(args: Parameters) {
    return (
      <SearchField
        {...args}
        {...props}
        onChange={action('change')}
        onSubmit={action('submit')}
        onClear={action('clear')}
      />
    );
  };
}

function renderWithValidation(props = {}) {
  function Example(args: Parameters) {
    let [value, setValue] = useState('Test!');
    let errorMessage = useMemo(() => {
      if (!value || /^\w+$/.test(value)) {
        return;
      }

      return 'Remove special characters.';
    }, [value]);

    return (
      <SearchField
        {...args}
        {...props}
        description="Must only contain alphanumeric characters."
        errorMessage={errorMessage}
        label="User name"
        onChange={setValue}
        value={value}
      />
    );
  }
  return function renderWithArgs(args: Parameters) {
    return <Example {...args} />;
  };
}
