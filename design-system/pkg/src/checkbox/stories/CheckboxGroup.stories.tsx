import { ArgTypes, action } from '@keystar/ui-storybook';

import { Text } from '@keystar/ui/typography';

import { Checkbox, CheckboxGroup, CheckboxGroupProps } from '..';

export default {
  title: 'Components/Checkbox/CheckboxGroup',
  args: {
    label: 'Favourite marsupial',
    isDisabled: false,
    isReadOnly: false,
    isRequired: false,
    orientation: 'vertical',
  },

  argTypes: {
    orientation: {
      options: ['horizontal', 'vertical'],
      control: { type: 'radio' },
    },
  },
};

export const Default = (args: ArgTypes) => render(args);

export const DefaultValueQuokka = (args: ArgTypes) =>
  render({ ...args, defaultValue: ['quokka'] });

DefaultValueQuokka.storyName = 'defaultValue: quokka';

export const ControlledQuokka = (args: ArgTypes) =>
  render({ ...args, value: ['quokka'] });

ControlledQuokka.storyName = 'controlled: quokka';

export const IsDisabledOnOneCheckbox = (args: ArgTypes) =>
  render(args, [{}, { isDisabled: true }, {}]);

export const WithDescription = (args: ArgTypes) =>
  render({ ...args, description: 'Please select one.' });

export const WithErrorMessage = (args: ArgTypes) =>
  render({
    ...args,
    description: 'Please select one.',
    errorMessage: 'You must select a value.',
  });

export const NoVisibleLabel = (args: ArgTypes) =>
  render({ ...args, label: null, 'aria-label': 'Favourite marsupial' });

export const CustomLabel = (args: ArgTypes) => renderLongLabel(args);

export const AutoFocusOnOneCheckbox = (args: ArgTypes) =>
  render(args, [{}, { autoFocus: true }, {}]);

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
