import { ArgTypes, action } from '@keystar/ui-storybook';

import { Text } from '@keystar/ui/typography';

import { Radio, RadioGroup, RadioGroupProps } from '..';

export default {
  title: 'Components/RadioGroup',

  args: {
    label: 'Favourite marsupial',
    isDisabled: false,
    isReadOnly: false,
    isRequired: false,
    orientation: 'vertical',
  },

  argTypes: {
    orientation: {
      control: { type: 'radio' },
      options: ['horizontal', 'vertical'],
    },
  },
};

export const Default = (args: ArgTypes) => render(args);

Default.story = {
  name: 'default',
};

export const DefaultValueQuokka = (args: ArgTypes) =>
  render({ ...args, defaultValue: 'quokka' });

DefaultValueQuokka.story = {
  name: 'defaultValue: quokka',
};

export const ControlledQuokka = (args: ArgTypes) =>
  render({ ...args, value: 'quokka' });

ControlledQuokka.story = {
  name: 'controlled: quokka',
};

export const IsDisabledOnOneRadio = (args: ArgTypes) =>
  render(args, [{}, { isDisabled: true }, {}]);

IsDisabledOnOneRadio.story = {
  name: 'isDisabled on one radio',
};

export const WithDescription = (args: ArgTypes) =>
  render({ ...args, description: 'Please select one.' });

WithDescription.story = {
  name: 'with description',
};

export const WithErrorMessage = (args: ArgTypes) =>
  render({
    ...args,
    description: 'Please select one.',
    errorMessage: 'You must select a value.',
  });

WithErrorMessage.story = {
  name: 'with error message',
};

export const NoVisibleLabel = (args: ArgTypes) =>
  render({ ...args, label: null, 'aria-label': 'Favourite marsupial' });

NoVisibleLabel.story = {
  name: 'no visible label',
};

export const CustomLabel = (args: ArgTypes) => renderLongLabel(args);

CustomLabel.story = {
  name: 'custom label',
};

export const AutoFocusOnOneRadio = (args: ArgTypes) =>
  render(args, [{}, { autoFocus: true }, {}]);

AutoFocusOnOneRadio.story = {
  name: 'autoFocus on one radio',
};

function render(props: Partial<RadioGroupProps>, radioProps = [{}, {}, {}]) {
  return (
    <RadioGroup
      label="Favourite marsupial"
      {...props}
      onChange={action('onChange')}
    >
      <Radio value="bilby" {...radioProps[0]}>
        Bilby
      </Radio>
      <Radio value="kangaroo" {...radioProps[1]}>
        Kangaroo
      </Radio>
      <Radio value="quokka" {...radioProps[2]}>
        Quokka
      </Radio>
    </RadioGroup>
  );
}

function renderLongLabel(
  props: Partial<RadioGroupProps>,
  radioProps = [{}, {}, {}]
) {
  return (
    <RadioGroup width="scale.3400" {...props} onChange={action('onChange')}>
      <Radio value="bilby" {...radioProps[0]}>
        <Text>Bilby label text, with multiple paragraphs.</Text>
        <Text slot="description">
          Including <em>emphasis</em> and <strong>strong emphasis</strong>{' '}
          brownie danish marshmallow tootsie roll caramels tiramisu cake candy
          canes.
        </Text>
      </Radio>
      <Radio value="kangaroo" {...radioProps[1]}>
        Kangaroo
      </Radio>
      <Radio value="quokka" {...radioProps[2]}>
        Quokka
      </Radio>
    </RadioGroup>
  );
}
