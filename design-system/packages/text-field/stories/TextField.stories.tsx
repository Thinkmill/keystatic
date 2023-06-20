import { useMemo, useState } from 'react';
import { action, storiesOf, Parameters } from '@voussoir/storybook';

import { TextField } from '../src';

export default {
  title: 'Components/TextField',

  parameters: {
    args: {
      label: 'Label text',
      isDisabled: false,
      isReadOnly: false,
      isRequired: false,
    },

    argTypes: {},
  },
};

export const Default = render();
export const ValueTestControlled = render({ value: 'Test' });

ValueTestControlled.story = {
  name: 'value: Test (controlled)',
};

export const DefaultValueTestUncontrolled = render({ defaultValue: 'Test' });

DefaultValueTestUncontrolled.story = {
  name: 'defaultValue: Test (uncontrolled)',
};

export const TypeEmail = render({ type: 'email' });

TypeEmail.story = {
  name: 'type: email',
};

export const Pattern09 = render({ pattern: '[0-9]+' });

Pattern09.story = {
  name: 'pattern: [0-9]+',
};

export const AutoFocusTrue = render({ autoFocus: true });

AutoFocusTrue.story = {
  name: 'autoFocus: true',
};

export const NoVisibleLabel = render({
  label: null,
  'aria-label': 'Hidden label',
});

NoVisibleLabel.story = {
  name: 'no visible label',
};

export const WithDescription = render({
  description:
    'Description text provides information to assist the user in completing a field.',
});

WithDescription.story = {
  name: 'with description',
};

export const WithErrorMessage = render({
  errorMessage:
    'Error messages inform the user when the input does not meet validation criteria.',
});

WithErrorMessage.story = {
  name: 'with error message',
};

export const WithValidation = renderWithValidation();

WithValidation.story = {
  name: 'with validation',
};

export const InputDomEvents = render({
  onCopy: action('onCopy'),
  onCut: action('onCut'),
  onPaste: action('onPaste'),
  onCompositionStart: action('onCompositionStart'),
  onCompositionEnd: action('onCompositionEnd'),
  onCompositionUpdate: action('onCompositionUpdate'),
  onSelect: action('onSelect'),
  onBeforeInput: action('onBeforeInput'),
  onInput: action('onInput'),
});

InputDomEvents.story = {
  name: 'input dom events',
};

export const CustomWidth = render({
  paddingX: 'regular',
  width: 'size.container.small',
  maxWidth: '100%',
  description:
    'Description text provides information to assist the user in completing a field.',
  errorMessage:
    'Error messages inform the user when the input does not meet validation criteria.',
});

CustomWidth.story = {
  name: 'custom width',
};

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
