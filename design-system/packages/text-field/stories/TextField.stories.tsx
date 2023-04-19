import { useMemo, useState } from 'react';
import { action, storiesOf, Parameters } from '@keystar-ui/storybook';

import { TextField } from '../src';

storiesOf('Components/TextField', module)
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
  .add('type: email', render({ type: 'email' }))
  .add('pattern: [0-9]+', render({ pattern: '[0-9]+' }))
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
  .add('with validation', renderWithValidation())
  .add(
    'input dom events',
    render({
      onCopy: action('onCopy'),
      onCut: action('onCut'),
      onPaste: action('onPaste'),
      onCompositionStart: action('onCompositionStart'),
      onCompositionEnd: action('onCompositionEnd'),
      onCompositionUpdate: action('onCompositionUpdate'),
      onSelect: action('onSelect'),
      onBeforeInput: action('onBeforeInput'),
      onInput: action('onInput'),
    })
  )
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
      <TextField
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

function renderWithValidation(props = {}) {
  function Example(args: Parameters) {
    let [value, setValue] = useState('1');
    let errorMessage = useMemo(() => {
      if (/^\d$/.test(value)) {
        return;
      }

      return value === ''
        ? 'Empty input not allowed.'
        : 'Single digit numbers are 0-9.';
    }, [value]);

    return (
      <TextField
        {...args}
        {...props}
        description="Enter a single digit number."
        errorMessage={errorMessage}
        label="Favorite number"
        maxLength={1}
        onChange={setValue}
        value={value}
      />
    );
  }
  return function renderWithArgs(args: Parameters) {
    return <Example {...args} />;
  };
}
