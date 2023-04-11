import { ArgTypes, action, storiesOf } from '@voussoir/storybook';

import { Text } from '@voussoir/typography';

import { Checkbox, CheckboxGroup, CheckboxGroupProps } from '../src';

storiesOf('Components/Checkbox/CheckboxGroup', module)
  .addParameters({
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
  })
  .add('default', (args: ArgTypes) => render(args))
  .add('defaultValue: quokka', (args: ArgTypes) =>
    render({ ...args, defaultValue: ['quokka'] })
  )
  .add('controlled: quokka', (args: ArgTypes) =>
    render({ ...args, value: ['quokka'] })
  )
  .add('isDisabled on one checkbox', (args: ArgTypes) =>
    render(args, [{}, { isDisabled: true }, {}])
  )
  .add('with description', (args: ArgTypes) =>
    render({ ...args, description: 'Please select one.' })
  )
  .add('with error message', (args: ArgTypes) =>
    render({
      ...args,
      description: 'Please select one.',
      errorMessage: 'You must select a value.',
    })
  )
  .add('no visible label', (args: ArgTypes) =>
    render({ ...args, label: null, 'aria-label': 'Favourite marsupial' })
  )
  .add('custom label', (args: ArgTypes) => renderLongLabel(args))
  .add('autoFocus on one checkbox', (args: ArgTypes) =>
    render(args, [{}, { autoFocus: true }, {}])
  );

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
