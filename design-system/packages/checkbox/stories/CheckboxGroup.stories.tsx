import { ArgTypes, action } from '@voussoir/storybook';

import { Text } from '@voussoir/typography';

import { Checkbox, CheckboxGroup, CheckboxGroupProps } from '../src';

export default {
  title: 'Components/Checkbox/CheckboxGroup',

  parameters: {
    providerSwitcher: { status: 'positive' },

    args: {
      label: 'Favourite marsupial',
      isDisabled: false,
      isReadOnly: false,
      isRequired: false,
      orientation: 'vertical',
    },

    argTypes: {
      orientation: {
        control: {
          type: 'checkbox',
          options: ['horizontal', 'vertical'],
        },
      },
    },
  },
};

export const Default = (args: ArgTypes) => render(args);

Default.story = {
  name: 'default',
};

export const DefaultValueQuokka = (args: ArgTypes) =>
  render({ ...args, defaultValue: ['quokka'] });

DefaultValueQuokka.story = {
  name: 'defaultValue: quokka',
};

export const ControlledQuokka = (args: ArgTypes) =>
  render({ ...args, value: ['quokka'] });

ControlledQuokka.story = {
  name: 'controlled: quokka',
};

export const IsDisabledOnOneCheckbox = (args: ArgTypes) =>
  render(args, [{}, { isDisabled: true }, {}]);

IsDisabledOnOneCheckbox.story = {
  name: 'isDisabled on one checkbox',
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

export const AutoFocusOnOneCheckbox = (args: ArgTypes) =>
  render(args, [{}, { autoFocus: true }, {}]);

AutoFocusOnOneCheckbox.story = {
  name: 'autoFocus on one checkbox',
};

function render(
  props: Partial<CheckboxGroupProps>,
  checkboxProps = [{}, {}, {}]
) {
  return (
    <CheckboxGroup
      label="Favourite marsupial"
      {...props}
      onChange={action('onChange')}
    >
      <Checkbox value="bilby" {...checkboxProps[0]}>
        Bilby
      </Checkbox>
      <Checkbox value="kangaroo" {...checkboxProps[1]}>
        Kangaroo
      </Checkbox>
      <Checkbox value="quokka" {...checkboxProps[2]}>
        Quokka
      </Checkbox>
    </CheckboxGroup>
  );
}

function renderLongLabel(
  props: Partial<CheckboxGroupProps>,
  checkboxProps = [{}, {}, {}]
) {
  return (
    <CheckboxGroup
      UNSAFE_style={{ width: 320 }}
      {...props}
      onChange={action('onChange')}
      description="Please select one."
      errorMessage="You must select a value."
    >
      <Checkbox value="bilby" {...checkboxProps[0]}>
        <Text>Bilby label text, with multiple paragraphs.</Text>
        <Text slot="description">
          Including <em>emphasis</em> and <strong>strong emphasis</strong>{' '}
          brownie danish marshmallow tootsie roll caramels tiramisu cake candy
          canes.
        </Text>
      </Checkbox>
      <Checkbox value="kangaroo" {...checkboxProps[1]}>
        Kangaroo
      </Checkbox>
      <Checkbox value="quokka" {...checkboxProps[2]}>
        Quokka
      </Checkbox>
    </CheckboxGroup>
  );
}
