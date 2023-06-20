import { action, storiesOf, Parameters } from '@voussoir/storybook';
import { useMemo, useState } from 'react';

import { SearchField } from '../src';

export default {
  title: 'Components/SearchField',

  parameters: {
    args: {
      label: 'Search',
      isDisabled: false,
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

export const NoIcon = render({ showIcon: false });

NoIcon.story = {
  name: 'no icon',
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

export const CustomWidth = render({
  width: 240,
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
