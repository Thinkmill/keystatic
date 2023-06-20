import { useState } from 'react';
import { action, Parameters } from '@voussoir/storybook';
import { Grid } from '@voussoir/layout';

import { TextArea } from '../src';

export default {
  title: 'Components/TextArea',

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

export const WithControlledInteraction = renderControlled({
  label: 'Controlled interaction',
});

WithControlledInteraction.story = {
  name: 'with controlled interaction',
};

export const CustomHeight = (args: Parameters) => (
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
);

CustomHeight.story = {
  name: 'custom height',
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
