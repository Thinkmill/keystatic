import { action } from '@storybook/addon-actions';
import { ArgTypes, storiesOf } from '@storybook/react';
import { Flex } from '@voussoir/layout';

import { Combobox, ComboboxProps, Item, Section } from '../src';

let flatItems = [
  { id: '1', name: 'Echidna' },
  { id: '2', name: 'Dingo' },
  { id: '3', name: 'Kangaroo' },
  { id: '4', name: 'Quokka' },
  { id: '5', name: 'Platypus' },
  { id: '6', name: 'Koala' },
  { id: '7', name: 'Cassowary' },
  { id: '8', name: 'Wallaby' },
  { id: '9', name: 'Bilby' },
];

let nestedItems = [
  {
    name: 'Marsupials',
    id: 'a',
    children: [
      { id: 'a-1', name: 'Bilby' },
      { id: 'a-2', name: 'Kangaroo' },
      { id: 'a-3', name: 'Quokka' },
    ],
  },
  {
    name: 'Other',
    id: 'b',
    children: [
      { id: 'b-1', name: 'Echidna' },
      { id: 'b-2', name: 'Dingo' },
      { id: 'b-3', name: 'Cassowary' },
    ],
  },
];

let manySections: { name: string; children: { name: string }[] }[] = [];
for (let i = 0; i < 50; i++) {
  let children = [];
  for (let j = 0; j < 50; j++) {
    children.push({ name: `Section ${i}, Item ${j}` });
  }

  manySections.push({ name: 'Section ' + i, children });
}

const defaultActions = {
  onOpenChange: action('onOpenChange'),
  onInputChange: action('onInputChange'),
  onSelectionChange: action('onSelectionChange'),
  onBlur: action('onBlur'),
  onFocus: action('onFocus'),
};

storiesOf('Components/Combobox', module)
  .add(
    'default (with controls)',
    (args: ArgTypes) => (
      <Combobox label="Combobox" {...defaultActions} {...args}>
        <Item key="One">One</Item>
        <Item key="Two">Two</Item>
        <Item key="Three">Three has a long label that will wrap</Item>
      </Combobox>
    ),
    {
      argTypes: {
        label: {
          control: 'text',
          defaultValue: 'Label text',
        },
        description: {
          control: 'text',
        },
        errorMessage: {
          control: 'text',
        },
        isDisabled: {
          control: 'boolean',
          defaultValue: false,
        },
        isReadOnly: {
          control: 'boolean',
          defaultValue: false,
        },
        isRequired: {
          control: 'boolean',
          defaultValue: false,
        },
        menuTrigger: {
          control: 'select',
          defaultValue: 'input',
          options: ['input', 'focus', 'manual'],
        },
        direction: {
          control: 'select',
          defaultValue: 'bottom',
          options: ['top', 'bottom'],
        },
      },
    }
  )
  .add('sections', () => (
    <Combobox label="Combobox" {...defaultActions}>
      <Section title="Marsupials" key="Marsupials">
        <Item key="Bilby">Bilby</Item>
        <Item key="Kangaroo">Kangaroo</Item>
        <Item key="Quokka">Quokka</Item>
      </Section>
      <Section title="Other" key="Other">
        <Item key="Echidna">Echidna</Item>
        <Item key="Dingo">Dingo</Item>
        <Item key="Cassowary">Cassowary</Item>
      </Section>
    </Combobox>
  ))
  .add('dynamic', () => (
    <Combobox label="Combobox" defaultItems={flatItems} {...defaultActions}>
      {item => <Item key={item.id}>{item.name}</Item>}
    </Combobox>
  ))
  .add('dynamic with sections', () => (
    <Combobox label="Combobox" defaultItems={nestedItems}>
      {section => (
        <Section
          items={section.children}
          title={section.name}
          key={section.name}
        >
          {item => <Item key={item.name}>{item.name}</Item>}
        </Section>
      )}
    </Combobox>
  ))
  .add('many sections', () => (
    <Combobox label="Combobox" defaultItems={manySections}>
      {section => (
        <Section
          items={section.children}
          title={section.name}
          key={section.name}
        >
          {item => <Item key={item.name}>{item.name}</Item>}
        </Section>
      )}
    </Combobox>
  ))
  .add('disabledKeys', () => (
    <Combobox
      label="Combobox"
      defaultItems={nestedItems}
      disabledKeys={['a-3', 'b-1', 'b-2']}
      {...defaultActions}
    >
      {section => (
        <Section items={section.children} title={section.name}>
          {item => <Item>{item.name}</Item>}
        </Section>
      )}
    </Combobox>
  ))
  .add('isDisabled', () => render({ isDisabled: true, selectedKey: 'One' }))
  .add('isReadOnly', () => render({ isReadOnly: true, selectedKey: 'One' }))
  .add('isRequired', () =>
    render({ isRequired: true, defaultSelectedKey: 'One' })
  )
  .add('allowsCustomValue', () => render({ allowsCustomValue: true }))
  .add('autoFocus', () => render({ autoFocus: true }))
  .add('loadingState', () => {
    return (
      <Flex gap="large" direction="column" width={240}>
        {render({ label: 'Combobox (loading)', loadingState: 'loading' })}
        {render({ label: 'Combobox (filtering)', loadingState: 'filtering' })}
        {render({
          label: 'Combobox (loading more)',
          loadingState: 'loadingMore',
        })}
      </Flex>
    );
  });

function render<T>(props: Partial<ComboboxProps<T>>) {
  return (
    <Combobox label="Combobox" {...defaultActions} {...props}>
      <Item key="One">One</Item>
      <Item key="Two">Two</Item>
      <Item key="Three">Three has a long label that will wrap</Item>
    </Combobox>
  );
}
