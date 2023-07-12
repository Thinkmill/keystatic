import { action, Meta, Parameters, StoryObj } from '@keystar/ui-storybook';
import { useMemo, useState } from 'react';

import { SearchField } from '..';

type Story = StoryObj<typeof SearchField>;

const meta: Meta = {
  title: 'Components/SearchField',
  component: SearchField,
  parameters: {
    controls: { exclude: ['onChange', 'onSubmit', 'onClear', 'UNSAFE_style'] },
  },
  args: {
    label: 'Search',
    isDisabled: false,
    onChange: action('change'),
    onSubmit: action('submit'),
    onClear: action('clear'),
  },
};

export default meta;

export const Default = { args: {} };

export const ValueTestControlled: Story = { args: { value: 'Test' } };
ValueTestControlled.storyName = 'value: Test (controlled)';

export const DefaultValueTestUncontrolled: Story = {
  args: { defaultValue: 'Test' },
};
DefaultValueTestUncontrolled.storyName = 'defaultValue: Test (uncontrolled)';

export const AutoFocusTrue: Story = { args: { autoFocus: true } };
AutoFocusTrue.storyName = 'autoFocus: true';

export const NoVisibleLabel: Story = {
  args: {
    label: null,
    'aria-label': 'Hidden label',
  },
};

export const NoIcon: Story = { args: { showIcon: false } };

export const WithDescription: Story = {
  args: {
    description:
      'Description text provides information to assist the user in completing a field.',
  },
};

export const WithErrorMessage = {
  args: {
    errorMessage:
      'Error messages inform the user when the input does not meet validation criteria.',
  },
};

export const WithValidation = renderWithValidation();

export const CustomWidth = {
  args: {
    UNSAFE_style: { width: 320 },
    description:
      'Description text provides information to assist the user in completing a field.',
    errorMessage:
      'Error messages inform the user when the input does not meet validation criteria.',
  },
};

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
