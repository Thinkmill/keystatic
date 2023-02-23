import { ArgTypes, action, storiesOf } from '@voussoir/storybook';

import { Text } from '@voussoir/typography';

import { Radio, RadioGroup, RadioGroupProps } from '../src';

storiesOf('Components/RadioGroup', module)
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
          type: 'radio',
          options: ['horizontal', 'vertical'],
        },
      },
    },
  })
  .add('default', (args: ArgTypes) => render(args))
  .add('defaultValue: quokka', (args: ArgTypes) =>
    render({ ...args, defaultValue: 'quokka' })
  )
  .add('controlled: quokka', (args: ArgTypes) =>
    render({ ...args, value: 'quokka' })
  )
  .add('isDisabled on one radio', (args: ArgTypes) =>
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
  .add('autoFocus on one radio', (args: ArgTypes) =>
    render(args, [{}, { autoFocus: true }, {}])
  );

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
    <RadioGroup width={320} {...props} onChange={action('onChange')}>
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
