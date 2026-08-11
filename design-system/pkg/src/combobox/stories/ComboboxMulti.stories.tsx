import { ArgTypes, action } from '@keystar/ui-storybook';

import { alignCenterVerticalIcon } from '@keystar/ui/icon/icons/alignCenterVerticalIcon';
import { alignStartVerticalIcon } from '@keystar/ui/icon/icons/alignStartVerticalIcon';
import { alignEndVerticalIcon } from '@keystar/ui/icon/icons/alignEndVerticalIcon';
import { boldIcon } from '@keystar/ui/icon/icons/boldIcon';
import { italicIcon } from '@keystar/ui/icon/icons/italicIcon';
import { Icon } from '@keystar/ui/icon';
import { Flex } from '@keystar/ui/layout';
import { Text } from '@keystar/ui/typography';

import {
  ComboboxCollection,
  ComboboxHeader,
  ComboboxItem,
  ComboboxLoadMoreItem,
  ComboboxMulti,
  ComboboxMultiProps,
  ComboboxSection,
} from '../index';

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
    children.push({ name: `ComboboxSection ${i}, ComboboxItem ${j}` });
  }

  manySections.push({ name: 'ComboboxSection ' + i, children });
}

const defaultActions = {
  onOpenChange: action('onOpenChange'),
  onInputChange: action('onInputChange'),
  onSelectionChange: action('onSelectionChange'),
  onBlur: action('onBlur'),
  onFocus: action('onFocus'),
};

export default {
  title: 'Components/Combobox/ComboboxMulti',
};

export const DefaultWithControls = (args: ArgTypes) => (
  <ComboboxMulti
    label="ComboboxMulti"
    placeholder="Placeholder"
    {...defaultActions}
    {...args}
  >
    <ComboboxItem id="One">One</ComboboxItem>
    <ComboboxItem id="Two">Two</ComboboxItem>
    <ComboboxItem id="Three">
      Three has a long label that will wrap
    </ComboboxItem>
  </ComboboxMulti>
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
  <ComboboxMulti label="ComboboxMulti" {...defaultActions}>
    <ComboboxSection id="Marsupials">
      <ComboboxHeader>Marsupials</ComboboxHeader>
      <ComboboxItem id="Bilby">Bilby</ComboboxItem>
      <ComboboxItem id="Kangaroo">Kangaroo</ComboboxItem>
      <ComboboxItem id="Quokka">Quokka</ComboboxItem>
    </ComboboxSection>
    <ComboboxSection id="Other">
      <ComboboxHeader>Other</ComboboxHeader>
      <ComboboxItem id="Echidna">Echidna</ComboboxItem>
      <ComboboxItem id="Dingo">Dingo</ComboboxItem>
      <ComboboxItem id="Cassowary">Cassowary</ComboboxItem>
    </ComboboxSection>
  </ComboboxMulti>
);

export const Dynamic = () => (
  <ComboboxMulti
    label="ComboboxMulti"
    defaultItems={flatItems}
    {...defaultActions}
  >
    {item => <ComboboxItem id={item.id}>{item.name}</ComboboxItem>}
  </ComboboxMulti>
);

export const DynamicWithSections = () => (
  <ComboboxMulti
    label="ComboboxMulti"
    defaultItems={nestedItems}
    {...defaultActions}
  >
    {section => (
      <ComboboxSection id={section.name}>
        <ComboboxHeader>{section.name}</ComboboxHeader>
        <ComboboxCollection items={section.children}>
          {item => <ComboboxItem id={item.name}>{item.name}</ComboboxItem>}
        </ComboboxCollection>
      </ComboboxSection>
    )}
  </ComboboxMulti>
);

export const ManySections = () => (
  <ComboboxMulti label="ComboboxMulti" defaultItems={manySections}>
    {section => (
      <ComboboxSection id={section.name}>
        <ComboboxHeader>{section.name}</ComboboxHeader>
        <ComboboxCollection items={section.children}>
          {item => <ComboboxItem id={item.name}>{item.name}</ComboboxItem>}
        </ComboboxCollection>
      </ComboboxSection>
    )}
  </ComboboxMulti>
);

export const ComplexItems = () => (
  <ComboboxMulti label="ComboboxMulti" {...defaultActions}>
    <ComboboxSection>
      <ComboboxHeader>ComboboxSection 1</ComboboxHeader>
      <ComboboxItem textValue="Bold">
        <Icon src={boldIcon} />
        <Text>Bold</Text>
      </ComboboxItem>
      <ComboboxItem textValue="Italic">
        <Icon src={italicIcon} />
        <Text>Italic</Text>
      </ComboboxItem>
    </ComboboxSection>
    <ComboboxSection>
      <ComboboxHeader>ComboboxSection 3</ComboboxHeader>
      <ComboboxItem textValue="Left">
        <Icon src={alignStartVerticalIcon} />
        <Text>Left</Text>
        <Text slot="description">The description text for left is long</Text>
      </ComboboxItem>
      <ComboboxItem textValue="Center has a long label that wraps">
        <Icon src={alignCenterVerticalIcon} />
        <Text>Center has a long label that wraps</Text>
      </ComboboxItem>
      <ComboboxItem textValue="Right">
        <Icon src={alignEndVerticalIcon} />
        <Text>Right</Text>
      </ComboboxItem>
    </ComboboxSection>
  </ComboboxMulti>
);

export const DisabledKeys = () => (
  <ComboboxMulti
    label="ComboboxMulti"
    defaultItems={nestedItems}
    disabledKeys={['a-3', 'b-1', 'b-2']}
    {...defaultActions}
  >
    {section => (
      <ComboboxSection id={section.name}>
        <ComboboxHeader>{section.name}</ComboboxHeader>
        <ComboboxCollection items={section.children}>
          {item => <ComboboxItem id={item.id}>{item.name}</ComboboxItem>}
        </ComboboxCollection>
      </ComboboxSection>
    )}
  </ComboboxMulti>
);

export const IsDisabled = () => render({ isDisabled: true, value: ['One'] });

export const IsReadOnly = () => render({ isReadOnly: true, value: ['One'] });

export const IsRequired = () =>
  render({ isRequired: true, defaultValue: ['One'] });

export const AutoFocus = () => render({ autoFocus: true });

export const LoadingState = () => {
  return (
    <Flex gap="large" direction="column" UNSAFE_style={{ width: 240 }}>
      {render({ label: 'ComboboxMulti (loading)', isLoading: true })}
      {render({
        label: 'ComboboxMulti (filtering)',
        isLoading: true,
      })}
      {render({
        label: 'ComboboxMulti (loading more)',
        isLoading: true,
      })}
    </Flex>
  );
};

function render(
  props: Partial<ComboboxMultiProps<object>> & { isLoading?: boolean }
) {
  let { isLoading, ...comboboxProps } = props;
  return (
    <ComboboxMulti label="ComboboxMulti" {...defaultActions} {...comboboxProps}>
      <ComboboxItem id="One">One</ComboboxItem>
      <ComboboxItem id="Two">Two</ComboboxItem>
      <ComboboxItem id="Three">
        Three has a long label that will wrap
      </ComboboxItem>
      {isLoading && <ComboboxLoadMoreItem isLoading />}
    </ComboboxMulti>
  );
}
