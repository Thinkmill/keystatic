import { useMemo, useState } from 'react';
import { action, Parameters, StoryObj } from '@keystar/ui-storybook';
import { ActionButton } from '@keystar/ui/button';
import { Flex } from '@keystar/ui/layout';
import { Text } from '@keystar/ui/typography';

import { TextField } from '..';

type Story = StoryObj<typeof TextField>;

export default {
  title: 'Components/TextField',

  args: {
    label: 'Label text',
    isDisabled: false,
    isReadOnly: false,
    isRequired: false,
  },
};

export const Default: Story = render();
export const ValueTestControlled: Story = render({ value: 'Test' });

ValueTestControlled.storyName = 'value: Test (controlled)';

export const DefaultValueTestUncontrolled: Story = render({
  defaultValue: 'Test',
});

DefaultValueTestUncontrolled.storyName = 'defaultValue: Test (uncontrolled)';

export const TypeEmail: Story = render({ type: 'email' });

TypeEmail.storyName = 'type: email';

export const Pattern09: Story = render({ pattern: '[0-9]+' });

Pattern09.storyName = 'pattern: [0-9]+';

export const AutoFocusTrue: Story = render({ autoFocus: true });

AutoFocusTrue.storyName = 'autoFocus: true';

export const NoVisibleLabel: Story = render({
  label: null,
  'aria-label': 'Hidden label',
});

export const WithDescription: Story = render({
  description:
    'Description text provides information to assist the user in completing a field.',
});

export const WithErrorMessage: Story = render({
  errorMessage:
    'Error messages inform the user when the input does not meet validation criteria.',
});

export const WithValidation = renderWithValidation();

export const InputDomEvents: Story = render({
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

export const CustomWidth: Story = render({
  paddingX: 'regular',
  width: 'size.container.small',
  maxWidth: '100%',
  description:
    'Description text provides information to assist the user in completing a field.',
  errorMessage:
    'Error messages inform the user when the input does not meet validation criteria.',
});

export const StaticElement: Story = render({
  startElement: (
    <Flex pointerEvents="none" alignSelf="center" marginStart="regular">
      <Text color="neutralTertiary" size="small" weight="medium">
        Prefix
      </Text>
    </Flex>
  ),
});

export const InteractiveElement: Story = render({
  endElement: <ActionButton prominence="low">Action</ActionButton>,
});

function render(props = {}) {
  return {
    render: (args: Parameters) => (
      <TextField
        {...args}
        onChange={action('change')}
        onFocus={action('focus')}
        onBlur={action('blur')}
        UNSAFE_className="custom-class-name"
        {...props}
      />
    ),
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
