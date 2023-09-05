import { ReactNode, useState } from 'react';
import { action, Parameters } from '@keystar/ui-storybook';
import { Grid } from '@keystar/ui/layout';

import { TextArea } from '..';

export default {
  title: 'Components/TextArea',

  args: {
    label: 'Label text',
    isDisabled: false,
    isReadOnly: false,
    isRequired: false,
  },
};

export const Default = render();

export const ValueTestControlled = render({ value: 'Test' });
ValueTestControlled.storyName = 'value: Test (controlled)';

export const DefaultValueTestUncontrolled = render({ defaultValue: 'Test' });
DefaultValueTestUncontrolled.storyName = 'defaultValue: Test (uncontrolled)';

export const AutoFocusTrue = render({ autoFocus: true });
AutoFocusTrue.storyName = 'autoFocus: true';

export const NoVisibleLabel = render({
  label: null,
  'aria-label': 'Hidden label',
});

export const WithDescription = render({
  description:
    'Description text provides information to assist the user in completing a field.',
});

export const WithErrorMessage = render({
  errorMessage:
    'Error messages inform the user when the input does not meet validation criteria.',
});

export const WithControlledInteraction = renderControlled({
  label: 'Controlled interaction',
});

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

export const CustomWidth = render({
  paddingX: 'regular',
  width: 'container.xsmall',
  maxWidth: '100%',
  description:
    'Description text provides information to assist the user in completing a field.',
  errorMessage:
    'Error messages inform the user when the input does not meet validation criteria.',
});

type Render = ((args: Parameters) => ReactNode) & {
  storyName?: string;
};

function render(props = {}): Render {
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
