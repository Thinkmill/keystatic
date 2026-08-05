import { useState } from 'react';

import { Icon } from '@keystar/ui/icon';
import { dessertIcon } from '@keystar/ui/icon/icons/dessertIcon';
import { pizzaIcon } from '@keystar/ui/icon/icons/pizzaIcon';
import { saladIcon } from '@keystar/ui/icon/icons/saladIcon';
import { Text } from '@keystar/ui/typography';

import { Tag, TagGroup, TagList } from '..';

const foods = [
  { id: 'healthy', label: 'Healthy', icon: saladIcon },
  { id: 'fast', label: 'Fast food', icon: pizzaIcon },
  { id: 'dessert', label: 'Dessert', icon: dessertIcon },
];

export default { title: 'Components/TagGroup', component: TagGroup };

export const Static = () => (
  <TagGroup aria-label="Tag group">
    <TagList>
      <Tag id="one">Cool Tag 1</Tag>
      <Tag id="two">Cool Tag 2</Tag>
      <Tag id="three">Cool Tag 3</Tag>
    </TagList>
  </TagGroup>
);

export const Dynamic = () => (
  <TagGroup aria-label="Tag group with icons">
    <TagList items={foods}>
      {item => (
        <Tag id={item.id} textValue={item.label}>
          <Icon src={item.icon} />
          <Text>{item.label}</Text>
        </Tag>
      )}
    </TagList>
  </TagGroup>
);

export const Removable = () => {
  let [items, setItems] = useState(foods);
  return (
    <TagGroup
      aria-label="Removable tags"
      onRemove={keys => setItems(items => items.filter(x => !keys.has(x.id)))}
    >
      <TagList items={items}>
        {item => <Tag id={item.id}>{item.label}</Tag>}
      </TagList>
    </TagGroup>
  );
};
