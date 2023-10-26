import { ArgTypes, action } from '@keystar/ui-storybook';

import { alignCenterVerticalIcon } from '@keystar/ui/icon/icons/alignCenterVerticalIcon';
import { alignStartVerticalIcon } from '@keystar/ui/icon/icons/alignStartVerticalIcon';
import { alignEndVerticalIcon } from '@keystar/ui/icon/icons/alignEndVerticalIcon';
import { boldIcon } from '@keystar/ui/icon/icons/boldIcon';
import { italicIcon } from '@keystar/ui/icon/icons/italicIcon';
import { Icon } from '@keystar/ui/icon';
import { Flex } from '@keystar/ui/layout';
import { Text } from '@keystar/ui/typography';

import { Combobox, ComboboxProps, Item, Section } from '..';

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

export default {
  title: 'Components/Combobox',
};

export const DefaultWithControls = (args: ArgTypes) => (
  <Combobox
    label="Combobox"
    placeholder="Placeholder"
    {...defaultActions}
    {...args}
  >
    <Item key="One">One</Item>
    <Item key="Two">Two</Item>
    <Item key="Three">Three has a long label that will wrap</Item>
  </Combobox>
);

DefaultWithControls.storyName = 'default (with controls)';
DefaultWithControls.args = {
  label: 'Label text',
  description: '',
  errorMessage: '',
  isDisabled: false,
  isReadOnly: false,
  isRequired: false,
  menuTrigger: 'input',
  direction: 'bottom',
};
DefaultWithControls.argTypes = {
  menuTrigger: {
    control: 'select',
    options: ['input', 'focus', 'manual'],
  },
  direction: {
    control: 'select',
    options: ['top', 'bottom'],
  },
};

export const Sections = () => (
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
);

export const Dynamic = () => (
  <Combobox label="Combobox" defaultItems={flatItems} {...defaultActions}>
    {item => <Item key={item.id}>{item.name}</Item>}
  </Combobox>
);

export const DynamicWithSections = () => (
  <Combobox label="Combobox" defaultItems={nestedItems} {...defaultActions}>
    {section => (
      <Section items={section.children} title={section.name} key={section.name}>
        {item => <Item key={item.name}>{item.name}</Item>}
      </Section>
    )}
  </Combobox>
);

export const ManySections = () => (
  <Combobox label="Combobox" defaultItems={manySections}>
    {section => (
      <Section items={section.children} title={section.name} key={section.name}>
        {item => <Item key={item.name}>{item.name}</Item>}
      </Section>
    )}
  </Combobox>
);

export const ComplexItems = () => (
  <Combobox label="Combobox" {...defaultActions}>
    <Section title="Section 1">
      <Item textValue="Bold">
        <Icon src={boldIcon} />
        <Text>Bold</Text>
      </Item>
      <Item textValue="Italic">
        <Icon src={italicIcon} />
        <Text>Italic</Text>
      </Item>
    </Section>
    <Section title="Section 3">
      <Item textValue="Left">
        <Icon src={alignStartVerticalIcon} />
        <Text>Left</Text>
        <Text slot="description">The description text for left is long</Text>
      </Item>
      <Item textValue="Center has a long label that wraps">
        <Icon src={alignCenterVerticalIcon} />
        <Text>Center has a long label that wraps</Text>
      </Item>
      <Item textValue="Right">
        <Icon src={alignEndVerticalIcon} />
        <Text>Right</Text>
      </Item>
    </Section>
  </Combobox>
);

export const DisabledKeys = () => (
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
);

export const IsDisabled = () =>
  render({ isDisabled: true, selectedKey: 'One' });

export const IsReadOnly = () =>
  render({ isReadOnly: true, selectedKey: 'One' });

export const IsRequired = () =>
  render({ isRequired: true, defaultSelectedKey: 'One' });

export const AllowsCustomValue = () => render({ allowsCustomValue: true });

export const AutoFocus = () => render({ autoFocus: true });

export const LoadingState = () => {
  return (
    <Flex gap="large" direction="column" UNSAFE_style={{ width: 240 }}>
      {render({ label: 'Combobox (loading)', loadingState: 'loading' })}
      {render({ label: 'Combobox (filtering)', loadingState: 'filtering' })}
      {render({
        label: 'Combobox (loading more)',
        loadingState: 'loadingMore',
      })}
    </Flex>
  );
};

export const CustomMenuWidths = () => (
  <Flex gap="large" direction="column">
    {render({ label: 'value < control width', menuWidth: 100 })}
    {render({ label: 'value > control width', menuWidth: 300 })}
    {render({ label: 'align = end', menuWidth: 300, align: 'end' })}
  </Flex>
);

function render<T>(props: Partial<ComboboxProps<T>>) {
  return (
    <Combobox label="Combobox" {...defaultActions} {...props}>
      <Item key="One">One</Item>
      <Item key="Two">Two</Item>
      <Item key="Three">Three has a long label that will wrap</Item>
    </Combobox>
  );
}
